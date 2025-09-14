import React from 'react'

interface YouTubeModalProps {
  videoId: string
  isOpen: boolean
  onClose: () => void
}

const YouTubeModal: React.FC<YouTubeModalProps> = () => {
  // Modal is now disabled - videos play directly in posts
  return null
}

export default YouTubeModal