import React from 'react'
import { Download, X, Smartphone, Zap, Wifi } from 'lucide-react'
import OptimizedImage from './OptimizedImage'

interface PWAInstallPromptProps {
  isVisible: boolean
  onInstall: () => Promise<boolean>
  onDismiss: () => void
}

const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({
  isVisible,
  onInstall,
  onDismiss
}) => {
  const [installing, setInstalling] = React.useState(false)

  const handleInstall = async () => {
    setInstalling(true)
    try {
      const success = await onInstall()
      // Always reset installing state after attempt
      setInstalling(false)
      
      if (success) {
        // Installation was accepted, prompt will be hidden by the hook
        console.log('Installation initiated successfully')
      } else {
        // Installation was dismissed or failed, prompt should already be hidden
        console.log('Installation was not completed')
      }
    } catch (error) {
      console.error('Install error:', error)
      setInstalling(false)
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-500 ease-out animate-slide-up">
        {/* Header */}
        <div className="relative p-6 pb-4">
          <button
            onClick={onDismiss}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
          >
            <X size={20} />
          </button>
          
          <div className="text-center">
            <div className="relative mb-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg flex items-center justify-center">
                <OptimizedImage
                  src="/logo.png"
                  alt="Nonce Firewall App Icon"
                  className="w-10 h-10 object-contain"
                  width={40}
                  height={40}
                  priority={true}
                />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <Download size={12} className="text-white" />
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Install Nonce Firewall
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-2">
              Get the full portfolio experience with faster loading, offline access, and native features.
            </p>
            <p className="text-gray-500 text-xs">
              Perfect for browsing projects, reading blog posts, and staying updated with my work.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="px-6 pb-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Zap size={18} className="text-blue-600" />
              </div>
              <span className="text-xs font-medium text-gray-700">Faster</span>
            </div>
            
            <div className="flex flex-col items-center space-y-2">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Wifi size={18} className="text-green-600" />
              </div>
              <span className="text-xs font-medium text-gray-700">Offline</span>
            </div>
            
            <div className="flex flex-col items-center space-y-2">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Smartphone size={18} className="text-purple-600" />
              </div>
              <span className="text-xs font-medium text-gray-700">Native</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 pt-2 space-y-3">
          <button
            onClick={handleInstall}
            disabled={installing}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {installing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                Installing...
              </>
            ) : (
              <>
                <Download size={20} className="mr-3" />
                Install App
              </>
            )}
          </button>
          
          <button
            onClick={onDismiss}
            className="w-full text-gray-600 hover:text-gray-800 py-3 font-medium transition-colors duration-200"
          >
            Maybe Later
          </button>
        </div>

        {/* Bottom indicator */}
        <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-b-2xl"></div>
      </div>
    </div>
  )
}

export default PWAInstallPrompt