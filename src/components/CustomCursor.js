import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  
  const springConfig = { damping: 25, stiffness: 700 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)
  
  // Secondary cursors with different spring configs
  const cursor2X = useSpring(cursorX, { damping: 30, stiffness: 400 })
  const cursor2Y = useSpring(cursorY, { damping: 30, stiffness: 400 })
  
  const cursor3X = useSpring(cursorX, { damping: 40, stiffness: 200 })
  const cursor3Y = useSpring(cursorY, { damping: 40, stiffness: 200 })

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX - 16)
      cursorY.set(e.clientY - 16)
      setIsVisible(true)
    }

    const handleMouseEnter = () => setIsVisible(true)
    const handleMouseLeave = () => setIsVisible(false)
    
    const handleHoverStart = () => setIsHovering(true)
    const handleHoverEnd = () => setIsHovering(false)

    window.addEventListener('mousemove', moveCursor)
    window.addEventListener('mouseenter', handleMouseEnter)
    window.addEventListener('mouseleave', handleMouseLeave)
    
    // Add hover effects for interactive elements
    const interactiveElements = document.querySelectorAll('button, a, [role="button"]')
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleHoverStart)
      el.addEventListener('mouseleave', handleHoverEnd)
    })

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      window.removeEventListener('mouseenter', handleMouseEnter)
      window.removeEventListener('mouseleave', handleMouseLeave)
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleHoverStart)
        el.removeEventListener('mouseleave', handleHoverEnd)
      })
    }
  }, [cursorX, cursorY])

  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    return null // Hide on mobile
  }

  return (
    <>
      {/* Main cursor */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-50 mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
        animate={{
          scale: isHovering ? 1.5 : 1,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.15 }}
      >
        <div className="w-full h-full bg-white rounded-full" />
      </motion.div>

      {/* Secondary cursor */}
      <motion.div
        className="fixed top-0 left-0 w-6 h-6 pointer-events-none z-49"
        style={{
          x: cursor2X,
          y: cursor2Y,
        }}
        animate={{
          scale: isHovering ? 2 : 1,
          opacity: isVisible ? 0.6 : 0,
        }}
        transition={{ duration: 0.2 }}
      >
        <div className="w-full h-full bg-accent rounded-full" />
      </motion.div>

      {/* Third cursor */}
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 pointer-events-none z-48"
        style={{
          x: cursor3X,
          y: cursor3Y,
        }}
        animate={{
          scale: isHovering ? 2.5 : 1,
          opacity: isVisible ? 0.3 : 0,
        }}
        transition={{ duration: 0.25 }}
      >
        <div className="w-full h-full bg-gradient-to-r from-accent to-purple-500 rounded-full" />
      </motion.div>
    </>
  )
}
