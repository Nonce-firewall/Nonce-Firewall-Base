import React from 'react'
import { WifiOff } from 'lucide-react'

interface OfflineIndicatorProps {
  isOffline: boolean
}

const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ isOffline }) => {
  if (!isOffline) return null

  return (
    <div className="fixed top-20 left-4 right-4 sm:left-auto sm:right-6 sm:w-80 bg-orange-500 text-white px-4 py-3 rounded-lg shadow-lg z-40 animate-slide-down">
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <WifiOff size={20} />
        </div>
        <div className="flex-1">
          <p className="font-medium text-sm">You're offline</p>
          <p className="text-xs text-orange-100">
            Some features may be limited. Content will sync when you're back online.
          </p>
        </div>
      </div>
    </div>
  )
}

export default OfflineIndicator