import React from "react"
import Label from "@/components/atoms/Label"
import Input from "@/components/atoms/Input"
import { cn } from "@/utils/cn"

const FormField = ({ 
  label, 
  error, 
  className,
  required = false,
  ...inputProps 
}) => {
  return (
    <div className={cn("mb-4", className)}>
      {label && (
        <Label className={cn(required && "after:content-['*'] after:text-red-500 after:ml-1")}>
          {label}
        </Label>
      )}
      <Input 
        className={cn(error && "border-red-500 focus:border-red-500")}
        {...inputProps} 
      />
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  )
}

export default FormField