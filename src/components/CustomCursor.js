import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  
  // Multiple cursors with different spring configs for smooth trailing effect
  const cursors = [
    { damping: 25, stiffness: 800, size: 8, opacity: 1, color: 'bg-white', blend: 'mix-blend-difference' },
    { damping: 30, stiffness: 600, size: 12, opacity: 0.8, color: 'bg-accent', blend: '' },
    { damping: 35, stiffness: 400, size: 16, opacity: 0.6, color: 'bg-purple-500', blend: '' },
    { damping: 40, stiffness: 300, size: 20, opacity: 0.4, color: 'bg-blue-500', blend: '' },
    { damping: 45, stiffness: 200, size: 24, opacity: 0.3, color: 'bg-pink-500', blend: '' },
    { damping: 50, stiffness: 150, size: 28, opacity: 0.2, color: 'bg-green-500', blend: '' },
    { damping: 55, stiffness: 100, size: 32, opacity: 0.15, color: 'bg-yellow-500', blend: '' },
    { damping: 60, stiffness: 80, size: 36, opacity: 0.1, color: 'bg-red-500', blend: '' }
  ]
  
  const springCursors = cursors.map(cursor => ({
    ...cursor,
    x: useSpring(cursorX, { damping: cursor.damping, stiffness: cursor.stiffness }),
    y: useSpring(cursorY, { damping: cursor.damping, stiffness: cursor.stiffness })
  }))

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
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
    const interactiveElements = document.querySelectorAll('button, a, [role="button"], input, textarea')
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
      {springCursors.map((cursor, index) => (
        <motion.div
          key={index}
          className={`fixed pointer-events-none z-50 ${cursor.blend}`}
          style={{
            x: cursor.x,
            y: cursor.y,
            width: cursor.size,
            height: cursor.size,
            marginLeft: -cursor.size / 2,
            marginTop: -cursor.size / 2,
          }}
          animate={{
            scale: isHovering ? 1.5 : 1,
            opacity: isVisible ? cursor.opacity : 0,
          }}
          transition={{ duration: 0.1 }}
        >
          <div className={`w-full h-full ${cursor.color} rounded-full`} />
        </motion.div>
      ))}
    </>
  )
}
