import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [cursorType, setCursorType] = useState('default')

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleHover = (type) => {
      setIsHovering(true)
      setCursorType(type)
    }

    const handleLeave = () => {
      setIsHovering(false)
      setCursorType('default')
    }

    // Global mouse move
    document.addEventListener('mousemove', updateMousePosition)

    // Add hover listeners to all interactive elements
    const updateHoverListeners = () => {
      // Remove existing listeners first
      document.querySelectorAll('*').forEach(el => {
        el.removeEventListener('mouseenter', () => handleHover('hover'))
        el.removeEventListener('mouseleave', handleLeave)
      })

      // Links
      document.querySelectorAll('a').forEach(el => {
        el.addEventListener('mouseenter', () => handleHover('link'))
        el.addEventListener('mouseleave', handleLeave)
      })

      // Buttons
      document.querySelectorAll('button, [role="button"]').forEach(el => {
        el.addEventListener('mouseenter', () => handleHover('button'))
        el.addEventListener('mouseleave', handleLeave)
      })

      // Text inputs
      document.querySelectorAll('input[type="text"], input[type="email"], textarea').forEach(el => {
        el.addEventListener('mouseenter', () => handleHover('text'))
        el.addEventListener('mouseleave', handleLeave)
      })

      // Text elements
      document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span').forEach(el => {
        el.addEventListener('mouseenter', () => handleHover('text'))
        el.addEventListener('mouseleave', handleLeave)
      })
    }

    // Initial setup
    updateHoverListeners()

    // Update on DOM changes
    const observer = new MutationObserver(updateHoverListeners)
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    })

    // Update on page navigation
    const handleNavigation = () => {
      setTimeout(updateHoverListeners, 100)
    }
    
    window.addEventListener('popstate', handleNavigation)
    window.addEventListener('pushstate', handleNavigation)

    return () => {
      document.removeEventListener('mousemove', updateMousePosition)
      window.removeEventListener('popstate', handleNavigation)
      window.removeEventListener('pushstate', handleNavigation)
      observer.disconnect()
    }
  }, [])

  // Don't show on mobile
  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    return null
  }

  const getCursorStyle = () => {
    switch (cursorType) {
      case 'link':
        return {
          width: 48,
          height: 48,
          backgroundColor: 'rgba(110, 68, 255, 0.2)',
          border: '2px solid rgb(110, 68, 255)',
          borderRadius: '50%'
        }
      case 'button':
        return {
          width: 40,
          height: 40,
          backgroundColor: 'rgba(110, 68, 255, 0.3)',
          border: '2px solid rgb(110, 68, 255)',
          borderRadius: '50%'
        }
      case 'text':
        return {
          width: 2,
          height: 20,
          backgroundColor: 'white',
          borderRadius: '1px'
        }
      default:
        return {
          width: 20,
          height: 20,
          backgroundColor: 'white',
          borderRadius: '50%',
          mixBlendMode: 'difference'
        }
    }
  }

  return (
    <motion.div
      className="fixed pointer-events-none z-[99999]"
      animate={{
        x: mousePosition.x - (getCursorStyle().width / 2),
        y: mousePosition.y - (getCursorStyle().height / 2),
        ...getCursorStyle()
      }}
      transition={{
        type: "spring",
        damping: 30,
        stiffness: 600,
        mass: 0.5
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 99999
      }}
    />
  )
}
