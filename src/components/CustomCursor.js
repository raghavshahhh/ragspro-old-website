import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const [mounted, setMounted] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  
  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)
  
  // Simple spring configs that work reliably
  const springConfig = { damping: 25, stiffness: 400 }
  
  const cursor1X = useSpring(cursorX, springConfig)
  const cursor1Y = useSpring(cursorY, springConfig)
  
  const cursor2X = useSpring(cursorX, { damping: 30, stiffness: 300 })
  const cursor2Y = useSpring(cursorY, { damping: 30, stiffness: 300 })
  
  const cursor3X = useSpring(cursorX, { damping: 35, stiffness: 200 })
  const cursor3Y = useSpring(cursorY, { damping: 35, stiffness: 200 })
  
  const cursor4X = useSpring(cursorX, { damping: 40, stiffness: 150 })
  const cursor4Y = useSpring(cursorY, { damping: 40, stiffness: 150 })

  useEffect(() => {
    setMounted(true)
    
    const moveCursor = (e) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }
    
    const handleHover = () => setIsHovering(true)
    const handleUnhover = () => setIsHovering(false)

    // Add listeners
    document.addEventListener('mousemove', moveCursor)
    
    // Add hover listeners to common interactive elements
    const addHoverListeners = () => {
      const elements = document.querySelectorAll('a, button, input, textarea, [role="button"], .cursor-hover')
      elements.forEach(el => {
        el.addEventListener('mouseenter', handleHover)
        el.addEventListener('mouseleave', handleUnhover)
      })
    }
    
    addHoverListeners()
    
    // Re-add listeners when page content changes
    const observer = new MutationObserver(addHoverListeners)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      document.removeEventListener('mousemove', moveCursor)
      observer.disconnect()
    }
  }, [cursorX, cursorY])

  // Don't render on mobile or if not mounted
  if (!mounted || (typeof window !== 'undefined' && window.innerWidth < 1024)) {
    return null
  }

  return (
    <div className="cursor-container">
      {/* Main cursor */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursor1X,
          y: cursor1Y,
          translateX: '-50%',
          translateY: '-50%'
        }}
        animate={{
          scale: isHovering ? 2 : 1
        }}
        transition={{ duration: 0.1 }}
      />
      
      {/* Second cursor */}
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 bg-accent rounded-full pointer-events-none z-[9998] opacity-80"
        style={{
          x: cursor2X,
          y: cursor2Y,
          translateX: '-50%',
          translateY: '-50%'
        }}
        animate={{
          scale: isHovering ? 1.8 : 1
        }}
        transition={{ duration: 0.15 }}
      />
      
      {/* Third cursor */}
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 bg-purple-500 rounded-full pointer-events-none z-[9997] opacity-60"
        style={{
          x: cursor3X,
          y: cursor3Y,
          translateX: '-50%',
          translateY: '-50%'
        }}
        animate={{
          scale: isHovering ? 1.6 : 1
        }}
        transition={{ duration: 0.2 }}
      />
      
      {/* Fourth cursor */}
      <motion.div
        className="fixed top-0 left-0 w-5 h-5 bg-blue-500 rounded-full pointer-events-none z-[9996] opacity-40"
        style={{
          x: cursor4X,
          y: cursor4Y,
          translateX: '-50%',
          translateY: '-50%'
        }}
        animate={{
          scale: isHovering ? 1.4 : 1
        }}
        transition={{ duration: 0.25 }}
      />
    </div>
  )
}
