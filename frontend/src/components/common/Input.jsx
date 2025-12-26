import React from 'react'

function Input({ label, type = "text", className = "", ...props }) {
  return (
    <div className="flex flex-col gap-2 w-70">
      {/* 1. The Label (Optional) - Small, crisp text */}
      {label && (
        <label className="text-sm font-medium text-gray-700">
            {label}
        </label>
      )}

      {/* 2. The Input Field */}
      <input
        type={type}
        className={`
            px-4 py-2 
            bg-white 
            border border-gray-300 
            rounded-lg 
            text-gray-900 
            placeholder-gray-400 
            focus:outline-none 
            focus:border-blue-500 
            focus:ring-2 focus:ring-blue-200 
            transition-all duration-200
            ${className}
        `}
        {...props} // Spreads other props like onChange, value, placeholder
      />
    </div>
  )
}

export default Input