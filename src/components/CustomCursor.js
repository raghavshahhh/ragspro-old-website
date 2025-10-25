import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => setIsHovering(false)

    // Add global mouse move listener
    document.addEventListener('mousemove', updateMousePosition, { passive: true })

    // Function to add hover listeners to all interactive elements
    const addHoverListeners = () => {
      const interactiveElements = document.querySelectorAll(`
        a, button, input, textarea, select, 
        [role="button"], [onclick], [tabindex]:not([tabindex="-1"]),
        .hero-content button, .hero-content a,
        nav a, .nav-link, .menu-item,
        .project-card, .service-card, .contact-form,
        .cursor-hover, [data-cursor-hover]
      `)
      
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter)
        el.removeEventListener('mouseleave', handleMouseLeave)
        el.addEventListener('mouseenter', handleMouseEnter)
        el.addEventListener('mouseleave', handleMouseLeave)
      })
    }

    // Initial setup
    addHoverListeners()

    // Re-add listeners when DOM changes (for dynamic content)
    const observer = new MutationObserver(() => {
      setTimeout(addHoverListeners, 100) // Small delay to ensure elements are rendered
    })
    
    observer.observe(document.body, { 
      childList: true, 
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'role']
    })

    // Also re-add on route changes
    const handleRouteChange = () => {
      setTimeout(addHoverListeners, 500)
    }
    
    window.addEventListener('popstate', handleRouteChange)

    return () => {
      document.removeEventListener('mousemove', updateMousePosition)
      window.removeEventListener('popstate', handleRouteChange)
      observer.disconnect()
    }
  }, [])

  // Hide on mobile or if not mounted
  if (!mounted || (typeof window !== 'undefined' && window.innerWidth < 768)) {
    return null
  }

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 9999 }}>
      {/* Main cursor */}
      <motion.div
        className="fixed w-4 h-4 bg-white rounded-full pointer-events-none mix-blend-difference"
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
        style={{ position: 'fixed', zIndex: 9999 }}
      />
      
      {/* Trail cursor 1 */}
      <motion.div
        className="fixed w-6 h-6 bg-accent rounded-full pointer-events-none opacity-70"
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
        style={{ position: 'fixed', zIndex: 9998 }}
      />
      
      {/* Trail cursor 2 */}
      <motion.div
        className="fixed w-8 h-8 bg-purple-500 rounded-full pointer-events-none opacity-50"
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
        style={{ position: 'fixed', zIndex: 9997 }}
      />
      
      {/* Trail cursor 3 */}
      <motion.div
        className="fixed w-10 h-10 bg-blue-500 rounded-full pointer-events-none opacity-30"
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
        style={{ position: 'fixed', zIndex: 9996 }}
      />
    </div>
  )
}
