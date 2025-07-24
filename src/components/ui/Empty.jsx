import React from "react"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const Empty = ({ 
  title = "Nothing here yet", 
  description = "Start exploring to see content here",
  actionText = "Get Started",
  onAction,
  icon = "Smile"
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] text-center p-6">
      <div className="mb-8">
        <div className="w-20 h-20 bg-gradient-saffron rounded-full flex items-center justify-center mb-6 mx-auto">
          <ApperIcon name={icon} className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-3">{title}</h3>
        <p className="text-gray-600 max-w-md mx-auto text-lg">{description}</p>
      </div>
      
      {onAction && (
        <Button onClick={onAction} size="lg" className="shadow-lg">
          {actionText}
        </Button>
      )}
    </div>
  )
}

export default Empty