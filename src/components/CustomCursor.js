import { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export default function CustomCursor() {
  const [cursorVariant, setCursorVariant] = useState("default");
  const [cursorSize, setCursorSize] = useState(40);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Spring configs for smooth movement
  const springConfig = { damping: 20, stiffness: 300 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);
  
  // Magnet effect with subtle delay
  const magnetX = useTransform(x, (value) => value);
  const magnetY = useTransform(y, (value) => value);

  useEffect(() => {
    const moveCursor = (e) => {
      mouseX.set(e.clientX - cursorSize / 2);
      mouseY.set(e.clientY - cursorSize / 2);
    };

    // Cursor variants for different elements
    const handleDefault = () => {
      setCursorVariant("default");
      setCursorSize(40);
    };

    const handleHover = () => {
      setCursorVariant("hover");
      setCursorSize(80);
    };

    const handleText = () => {
      setCursorVariant("text");
      setCursorSize(60);
    };

    const handleButton = () => {
      setCursorVariant("button");
      setCursorSize(100);
    };

    const handleDrag = () => {
      setCursorVariant("drag");
      setCursorSize(120);
    };

    // Add event listeners
    window.addEventListener("mousemove", moveCursor);

    // Function to add hover listeners
    const addHoverListeners = () => {
      // Links
      document.querySelectorAll("a").forEach((el) => {
        el.addEventListener("mouseenter", handleHover);
        el.addEventListener("mouseleave", handleDefault);
      });

      // Buttons
      document.querySelectorAll("button, [role='button']").forEach((el) => {
        el.addEventListener("mouseenter", handleButton);
        el.addEventListener("mouseleave", handleDefault);
      });

      // Text elements
      document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, span").forEach((el) => {
        el.addEventListener("mouseenter", handleText);
        el.addEventListener("mouseleave", handleDefault);
      });

      // Input fields
      document.querySelectorAll("input, textarea").forEach((el) => {
        el.addEventListener("mouseenter", handleText);
        el.addEventListener("mouseleave", handleDefault);
      });

      // Draggable elements
      document.querySelectorAll("[draggable='true'], .draggable").forEach((el) => {
        el.addEventListener("mouseenter", handleDrag);
        el.addEventListener("mouseleave", handleDefault);
      });
    };

    addHoverListeners();

    // Re-add listeners when DOM changes
    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      observer.disconnect();
    };
  }, [cursorSize, mouseX, mouseY]);

  // Cursor variants with different styles
  const variants = {
    default: {
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      border: "1px solid rgba(255, 255, 255, 0.4)",
      boxShadow: "0 0 20px rgba(255, 255, 255, 0.3)",
    },
    hover: {
      backgroundColor: "rgba(110, 68, 255, 0.3)",
      border: "2px solid rgba(110, 68, 255, 0.6)",
      boxShadow: "0 0 30px rgba(110, 68, 255, 0.5)",
    },
    text: {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      border: "1px solid rgba(255, 255, 255, 0.6)",
      boxShadow: "0 0 25px rgba(255, 255, 255, 0.4)",
    },
    button: {
      backgroundColor: "rgba(110, 68, 255, 0.4)",
      border: "3px solid rgba(110, 68, 255, 0.8)",
      boxShadow: "0 0 40px rgba(110, 68, 255, 0.6)",
    },
    drag: {
      backgroundColor: "rgba(255, 100, 100, 0.3)",
      border: "2px solid rgba(255, 100, 100, 0.7)",
      boxShadow: "0 0 50px rgba(255, 100, 100, 0.5)",
    }
  };

  // Hide on mobile
  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    return null;
  }

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full backdrop-blur-sm"
      style={{
        width: cursorSize,
        height: cursorSize,
        x: magnetX,
        y: magnetY,
        mixBlendMode: "difference",
      }}
      animate={variants[cursorVariant]}
      transition={{
        type: "spring",
        damping: 25,
        stiffness: 400,
        mass: 0.5,
      }}
    />
  );
}
