import { useEffect, useState, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [cursorText, setCursorText] = useState('')
  
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  
  // Ultra smooth spring configs
  const cursors = [
    { damping: 20, stiffness: 1000, size: 6, opacity: 1, color: 'bg-white', blend: 'mix-blend-difference' },
    { damping: 25, stiffness: 800, size: 10, opacity: 0.9, color: 'bg-accent', blend: '' },
    { damping: 30, stiffness: 600, size: 14, opacity: 0.7, color: 'bg-purple-400', blend: '' },
    { damping: 35, stiffness: 450, size: 18, opacity: 0.5, color: 'bg-blue-400', blend: '' },
    { damping: 40, stiffness: 350, size: 22, opacity: 0.4, color: 'bg-pink-400', blend: '' },
    { damping: 45, stiffness: 250, size: 26, opacity: 0.3, color: 'bg-green-400', blend: '' },
    { damping: 50, stiffness: 180, size: 30, opacity: 0.2, color: 'bg-yellow-400', blend: '' },
    { damping: 55, stiffness: 120, size: 34, opacity: 0.15, color: 'bg-red-400', blend: '' }
  ]
  
  const springCursors = cursors.map(cursor => ({
    ...cursor,
    x: useSpring(cursorX, { damping: cursor.damping, stiffness: cursor.stiffness, restDelta: 0.001 }),
    y: useSpring(cursorY, { damping: cursor.damping, stiffness: cursor.stiffness, restDelta: 0.001 })
  }))

  useEffect(() => {
    let animationId

    const moveCursor = (e) => {
      if (animationId) cancelAnimationFrame(animationId)
      
      animationId = requestAnimationFrame(() => {
        cursorX.set(e.clientX)
        cursorY.set(e.clientY)
        setIsVisible(true)
      })
    }

    const handleMouseEnter = () => setIsVisible(true)
    const handleMouseLeave = () => setIsVisible(false)
    
    const handleHoverStart = (e) => {
      setIsHovering(true)
      const text = e.target.getAttribute('data-cursor-text')
      if (text) setCursorText(text)
    }
    
    const handleHoverEnd = () => {
      setIsHovering(false)
      setCursorText('')
    }

    // Add event listeners
    document.addEventListener('mousemove', moveCursor, { passive: true })
    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mouseleave', handleMouseLeave)
    
    // Enhanced interactive elements detection
    const updateInteractiveElements = () => {
      const interactiveElements = document.querySelectorAll(`
        button, a, [role="button"], input, textarea, select, 
        [data-cursor-hover], .cursor-hover, 
        .hero-content button, .hero-content a,
        nav a, .nav-link, .menu-item,
        .project-card, .service-card, .contact-form,
        [onclick], [onmouseenter], [tabindex]:not([tabindex="-1"])
      `)
      
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleHoverStart)
        el.removeEventListener('mouseleave', handleHoverEnd)
        el.addEventListener('mouseenter', handleHoverStart)
        el.addEventListener('mouseleave', handleHoverEnd)
      })
    }

    // Initial setup and periodic updates for dynamic content
    updateInteractiveElements()
    const intervalId = setInterval(updateInteractiveElements, 2000)

    return () => {
      if (animationId) cancelAnimationFrame(animationId)
      clearInterval(intervalId)
      document.removeEventListener('mousemove', moveCursor)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [cursorX, cursorY])

  // Hide on mobile and tablets
  if (typeof window !== 'undefined' && window.innerWidth < 1024) {
    return null
  }

  return (
    <>
      {springCursors.map((cursor, index) => (
        <motion.div
          key={index}
          className={`fixed pointer-events-none z-[9999] ${cursor.blend}`}
          style={{
            x: cursor.x,
            y: cursor.y,
            width: cursor.size,
            height: cursor.size,
            marginLeft: -cursor.size / 2,
            marginTop: -cursor.size / 2,
          }}
          animate={{
            scale: isHovering ? (index === 0 ? 2 : 1.8) : 1,
            opacity: isVisible ? cursor.opacity : 0,
          }}
          transition={{ 
            duration: 0.05,
            ease: "easeOut"
          }}
        >
          <div className={`w-full h-full ${cursor.color} rounded-full`} />
        </motion.div>
      ))}
      
      {/* Cursor text for hover states */}
      {cursorText && (
        <motion.div
          className="fixed pointer-events-none z-[9999] text-white text-sm font-medium px-3 py-1 bg-black bg-opacity-80 rounded-full"
          style={{
            x: springCursors[0].x,
            y: springCursors[0].y,
            marginLeft: 20,
            marginTop: -10,
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.1 }}
        >
          {cursorText}
        </motion.div>
      )}
    </>
  )
}
