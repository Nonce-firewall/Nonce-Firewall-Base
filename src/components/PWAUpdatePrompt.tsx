import React from 'react'
import { RefreshCw, X } from 'lucide-react'

interface PWAUpdatePromptProps {
  isVisible: boolean
  onUpdate: () => void
  onDismiss: () => void
}

const PWAUpdatePrompt: React.FC<PWAUpdatePromptProps> = ({
  isVisible,
  onUpdate,
  onDismiss
}) => {
  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-80 bg-blue-600 text-white rounded-xl shadow-lg z-40 animate-slide-up">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <RefreshCw size={18} />
            <h4 className="font-semibold text-sm">Update Available</h4>
          </div>
          <button
            onClick={onDismiss}
            className="text-blue-200 hover:text-white transition-colors duration-200"
          >
            <X size={16} />
          </button>
        </div>
        
        <p className="text-blue-100 text-xs mb-4">
          A new version is available with improvements and bug fixes.
        </p>
        
        <div className="flex space-x-2">
          <button
            onClick={onUpdate}
            className="flex-1 bg-white text-blue-600 py-2 px-3 rounded-lg font-medium text-sm hover:bg-blue-50 transition-colors duration-200"
          >
            Update Now
          </button>
          <button
            onClick={onDismiss}
            className="px-3 py-2 text-blue-200 hover:text-white text-sm transition-colors duration-200"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  )
}

export default PWAUpdatePrompt