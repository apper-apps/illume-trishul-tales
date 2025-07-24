import React from "react"
import { motion } from "framer-motion"

const TrishulIcon = ({ className = "", size = 48, animated = false }) => {
  const IconComponent = () => (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      className={className}
      fill="currentColor"
    >
      {/* Main shaft */}
      <rect x="47" y="30" width="6" height="60" />
      
      {/* Three prongs */}
      <path d="M35 10 L35 35 L45 30 L45 15 Z" />
      <path d="M42 5 L42 35 L58 35 L58 5 Z" />
      <path d="M55 15 L55 30 L65 35 L65 10 Z" />
      
      {/* Base ornament */}
      <circle cx="50" cy="75" r="8" />
      <path d="M42 85 Q50 90 58 85" strokeWidth="2" stroke="currentColor" fill="none" />
    </svg>
  )

  if (animated) {
    return (
      <motion.div
        animate={{ 
          rotateY: [0, 10, -10, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <IconComponent />
      </motion.div>
    )
  }

  return <IconComponent />
}

export default TrishulIcon