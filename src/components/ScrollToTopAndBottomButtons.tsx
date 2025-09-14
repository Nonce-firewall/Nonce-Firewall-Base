import React, { useState, useEffect } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'

interface ScrollToTopAndBottomButtonsProps {
  showScrollDownButton?: boolean
}

const ScrollToTopAndBottomButtons: React.FC<ScrollToTopAndBottomButtonsProps> = ({ 
  showScrollDownButton = true 
}) => {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY

      // Show scroll to top button when user has scrolled down more than 300px
      setShowScrollTop(scrollY > 300)
    }

    // Initial check
    handleScroll()

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true })

    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    })
  }

  // Check if page is scrollable (has content beyond viewport)
  const isPageScrollable = () => {
    return document.documentElement.scrollHeight > window.innerHeight + 200
  }

  return (
    <>
      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-32 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 z-40 hover:from-blue-700 hover:to-purple-700 ${
          showScrollTop 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        title="Scroll to top"
        aria-label="Scroll to top"
      >
        <ChevronUp size={20} />
      </button>

      {/* Scroll to Bottom Button */}
      {showScrollDownButton && (
        <button
          onClick={scrollToBottom}
          className={`fixed bottom-20 right-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 z-40 hover:from-purple-700 hover:to-blue-700 ${
            !showScrollTop && isPageScrollable()
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
          title="Scroll to bottom"
          aria-label="Scroll to bottom"
        >
          <ChevronDown size={20} />
        </button>
      )}
    </>
  )
}

export default ScrollToTopAndBottomButtons