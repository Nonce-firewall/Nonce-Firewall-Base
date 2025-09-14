import { useState, useEffect } from 'react'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

interface PWAState {
  isInstallable: boolean
  isInstalled: boolean
  isOffline: boolean
  showInstallPrompt: boolean
  installPrompt: BeforeInstallPromptEvent | null
}

export const usePWA = () => {
  const [pwaState, setPwaState] = useState<PWAState>({
    isInstallable: false,
    isInstalled: false,
    isOffline: false,
    showInstallPrompt: false,
    installPrompt: null
  })

  useEffect(() => {
    // Check if app is already installed
    const checkInstalled = () => {
      const isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
                         (window.navigator as any).standalone ||
                         document.referrer.includes('android-app://')
      
      setPwaState(prev => ({ ...prev, isInstalled }))
    }

    // Check online/offline status
    const updateOnlineStatus = () => {
      setPwaState(prev => ({ ...prev, isOffline: !navigator.onLine }))
    }

    // Handle beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      const installEvent = e as BeforeInstallPromptEvent
      
      setPwaState(prev => ({
        ...prev,
        isInstallable: true,
        installPrompt: installEvent,
        showInstallPrompt: !prev.isInstalled && !localStorage.getItem('pwa-install-dismissed')
      }))
    }

    // Handle app installed event
    const handleAppInstalled = () => {
      setPwaState(prev => ({
        ...prev,
        isInstalled: true,
        showInstallPrompt: false,
        installPrompt: null
      }))
      
      // Clear any stored dismissal
      localStorage.removeItem('pwa-install-dismissed')
    }

    // Initial checks
    checkInstalled()
    updateOnlineStatus()

    // Event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    // Auto-show install prompt after 30 seconds if not dismissed
    const autoPromptTimer = setTimeout(() => {
      if (pwaState.isInstallable && !pwaState.isInstalled && !localStorage.getItem('pwa-install-dismissed') && !window.location.pathname.startsWith('/admin')) {
        setPwaState(prev => ({ ...prev, showInstallPrompt: true }))
      }
    }, 25000) // Reduced to 25 seconds for better UX

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
      clearTimeout(autoPromptTimer)
    }
  }, [pwaState.isInstallable, pwaState.isInstalled])

  const installApp = async () => {
    if (!pwaState.installPrompt) {
      // If no install prompt available, hide the UI prompt
      setPwaState(prev => ({ ...prev, showInstallPrompt: false }))
      return false
    }

    try {
      // Always hide the prompt immediately when user clicks install
      setPwaState(prev => ({ 
        ...prev, 
        showInstallPrompt: false,
        installPrompt: null 
      }))
      
      await pwaState.installPrompt.prompt()
      const { outcome } = await pwaState.installPrompt.userChoice
      
      if (outcome === 'accepted') {
        // Installation accepted - the 'appinstalled' event will handle the rest
        console.log('PWA installation accepted')
        return true
      } else {
        // User dismissed the installation
        console.log('PWA installation dismissed by user')
        localStorage.setItem('pwa-install-dismissed', 'true')
        return false
      }
    } catch (error) {
      console.error('Error installing PWA:', error)
      // Always hide prompt on error
      setPwaState(prev => ({ 
        ...prev, 
        showInstallPrompt: false,
        installPrompt: null 
      }))
      return false
    }
  }

  const dismissInstallPrompt = () => {
    setPwaState(prev => ({ ...prev, showInstallPrompt: false }))
    localStorage.setItem('pwa-install-dismissed', 'true')
    
    // Show again after 7 days
    setTimeout(() => {
      localStorage.removeItem('pwa-install-dismissed')
    }, 7 * 24 * 60 * 60 * 1000)
  }

  const showInstallPromptManually = () => {
    if (pwaState.isInstallable && !pwaState.isInstalled) {
      setPwaState(prev => ({ ...prev, showInstallPrompt: true }))
    }
  }

  return {
    ...pwaState,
    installApp,
    dismissInstallPrompt,
    showInstallPromptManually
  }
}