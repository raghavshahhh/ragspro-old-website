import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => setIsHovering(false)

    document.addEventListener('mousemove', updateMousePosition)

    // Add hover effects
    const interactiveElements = document.querySelectorAll('a, button, input, textarea')
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter)
      el.addEventListener('mouseleave', handleMouseLeave)
    })

    return () => {
      document.removeEventListener('mousemove', updateMousePosition)
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter)
        el.removeEventListener('mouseleave', handleMouseLeave)
      })
    }
  }, [])

  // Hide on mobile
  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    return null
  }

  return (
    <>
      {/* Main cursor */}
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference"
        animate={{
          x: mousePosition.x - 8,
          y: mousePosition.y - 8,
          scale: isHovering ? 1.5 : 1,
        }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 500,
          mass: 0.5,
        }}
      />
      
      {/* Trail cursor 1 */}
      <motion.div
        className="fixed top-0 left-0 w-6 h-6 bg-accent rounded-full pointer-events-none z-[9998] opacity-70"
        animate={{
          x: mousePosition.x - 12,
          y: mousePosition.y - 12,
          scale: isHovering ? 1.3 : 1,
        }}
        transition={{
          type: "spring",
          damping: 35,
          stiffness: 300,
          mass: 0.8,
        }}
      />
      
      {/* Trail cursor 2 */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 bg-purple-500 rounded-full pointer-events-none z-[9997] opacity-50"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
          scale: isHovering ? 1.2 : 1,
        }}
        transition={{
          type: "spring",
          damping: 40,
          stiffness: 200,
          mass: 1,
        }}
      />
      
      {/* Trail cursor 3 */}
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 bg-blue-500 rounded-full pointer-events-none z-[9996] opacity-30"
        animate={{
          x: mousePosition.x - 20,
          y: mousePosition.y - 20,
          scale: isHovering ? 1.1 : 1,
        }}
        transition={{
          type: "spring",
          damping: 45,
          stiffness: 150,
          mass: 1.2,
        }}
      />
    </>
  )
}
