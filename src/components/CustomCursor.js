import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const [mounted, setMounted] = useState(false)
  const [cursorVariant, setCursorVariant] = useState('default')
  
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  
  const springConfig = { damping: 25, stiffness: 700 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  useEffect(() => {
    setMounted(true)

    const moveCursor = (e) => {
      cursorX.set(e.clientX - 16)
      cursorY.set(e.clientY - 16)
    }

    const onMouseEnterLink = () => setCursorVariant('link')
    const onMouseEnterText = () => setCursorVariant('text')
    const onMouseEnterButton = () => setCursorVariant('button')
    const onMouseLeave = () => setCursorVariant('default')

    // Add event listeners
    document.addEventListener('mousemove', moveCursor)

    // Function to add hover listeners
    const addHoverListeners = () => {
      // Links
      const links = document.querySelectorAll('a, [role="link"]')
      links.forEach(link => {
        link.addEventListener('mouseenter', onMouseEnterLink)
        link.addEventListener('mouseleave', onMouseLeave)
      })

      // Buttons
      const buttons = document.querySelectorAll('button, [role="button"], input[type="submit"]')
      buttons.forEach(button => {
        button.addEventListener('mouseenter', onMouseEnterButton)
        button.addEventListener('mouseleave', onMouseLeave)
      })

      // Text elements
      const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div[contenteditable], textarea, input[type="text"], input[type="email"]')
      textElements.forEach(text => {
        text.addEventListener('mouseenter', onMouseEnterText)
        text.addEventListener('mouseleave', onMouseLeave)
      })
    }

    addHoverListeners()

    // Re-add listeners when DOM changes
    const observer = new MutationObserver(addHoverListeners)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      document.removeEventListener('mousemove', moveCursor)
      observer.disconnect()
    }
  }, [cursorX, cursorY])

  // Cursor variants
  const variants = {
    default: {
      width: 32,
      height: 32,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      mixBlendMode: 'difference',
      borderRadius: '50%',
    },
    text: {
      width: 2,
      height: 24,
      backgroundColor: 'rgba(255, 255, 255, 1)',
      mixBlendMode: 'difference',
      borderRadius: '1px',
    },
    link: {
      width: 48,
      height: 48,
      backgroundColor: 'rgba(110, 68, 255, 0.3)',
      mixBlendMode: 'normal',
      borderRadius: '50%',
      border: '2px solid rgba(110, 68, 255, 0.8)',
    },
    button: {
      width: 40,
      height: 40,
      backgroundColor: 'rgba(110, 68, 255, 0.2)',
      mixBlendMode: 'normal',
      borderRadius: '50%',
      border: '2px solid rgba(110, 68, 255, 1)',
    }
  }

  // Hide on mobile or if not mounted
  if (!mounted || (typeof window !== 'undefined' && window.innerWidth < 768)) {
    return null
  }

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
      }}
      animate={variants[cursorVariant]}
      transition={{
        type: "spring",
        damping: 20,
        stiffness: 400,
        mass: 0.5,
      }}
    />
  )
}
