import React from "react"

const OmSymbol = ({ className = "", size = 32 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      className={className}
      fill="currentColor"
    >
      <path d="M15 65 Q20 45 35 45 Q45 45 45 55 Q45 65 35 65 Q25 65 20 70 Q15 75 15 80 Q15 85 20 85 L80 85" strokeWidth="4" stroke="currentColor" fill="none" />
      <path d="M50 30 Q60 20 70 30 Q75 35 70 40 Q65 45 60 40 Q55 35 55 30" />
      <circle cx="75" cy="25" r="4" />
      <path d="M70 60 Q75 55 80 60 Q82 65 80 70 Q75 75 70 70 Q68 65 70 60" />
    </svg>
  )
}

export default OmSymbol