import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/utils/cn"

const QuizOption = ({ 
  option, 
  index, 
  selected, 
  onClick, 
  showResult = false, 
  isCorrect = false 
}) => {
  const getOptionStyles = () => {
    if (showResult) {
      if (isCorrect) {
        return "bg-green-50 border-green-500 text-green-800"
      } else if (selected) {
        return "bg-red-50 border-red-500 text-red-800"
      }
      return "bg-gray-50 border-gray-300 text-gray-600"
    }
    
    if (selected) {
      return "bg-saffron-50 border-saffron-500 text-saffron-800"
    }
    
    return "bg-white border-gray-300 text-gray-700 hover:bg-saffron-50 hover:border-saffron-300"
  }

  return (
    <motion.button
      whileHover={{ scale: showResult ? 1 : 1.02 }}
      whileTap={{ scale: showResult ? 1 : 0.98 }}
      onClick={onClick}
      disabled={showResult}
      className={cn(
        "w-full p-4 text-left border-2 rounded-lg transition-all duration-200 font-medium",
        getOptionStyles()
      )}
    >
      <span className="font-semibold mr-3">
        {String.fromCharCode(65 + index)}.
      </span>
      {option}
    </motion.button>
  )
}

export default QuizOption