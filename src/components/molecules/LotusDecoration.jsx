import React from "react"

const LotusDecoration = ({ className = "", size = 40 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      className={className}
      fill="currentColor"
    >
      {/* Lotus petals */}
      <ellipse cx="50" cy="70" rx="8" ry="25" transform="rotate(0 50 70)" opacity="0.8" />
      <ellipse cx="50" cy="70" rx="8" ry="25" transform="rotate(30 50 70)" opacity="0.8" />
      <ellipse cx="50" cy="70" rx="8" ry="25" transform="rotate(60 50 70)" opacity="0.8" />
      <ellipse cx="50" cy="70" rx="8" ry="25" transform="rotate(90 50 70)" opacity="0.8" />
      <ellipse cx="50" cy="70" rx="8" ry="25" transform="rotate(120 50 70)" opacity="0.8" />
      <ellipse cx="50" cy="70" rx="8" ry="25" transform="rotate(150 50 70)" opacity="0.8" />
      <ellipse cx="50" cy="70" rx="8" ry="25" transform="rotate(180 50 70)" opacity="0.8" />
      <ellipse cx="50" cy="70" rx="8" ry="25" transform="rotate(210 50 70)" opacity="0.8" />
      
      {/* Center */}
      <circle cx="50" cy="70" r="6" />
    </svg>
  )
}

export default LotusDecoration