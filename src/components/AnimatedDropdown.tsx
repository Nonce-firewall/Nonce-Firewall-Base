import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

interface AnimatedDropdownProps {
  label: string
  value: string
  options: string[]
  placeholder: string
  onChange: (value: string) => void
  required?: boolean
  name: string
}

const AnimatedDropdown: React.FC<AnimatedDropdownProps> = ({
  label,
  value,
  options,
  placeholder,
  onChange,
  required = false,
  name
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleOptionSelect = (option: string) => {
    onChange(option)
    setIsOpen(false)
    setSearchTerm('')
  }

  const handleInputClick = () => {
    setIsOpen(!isOpen)
    setSearchTerm('')
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && '*'}
      </label>
      
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          name={name}
          value={isOpen ? searchTerm : value}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClick={handleInputClick}
          placeholder={placeholder}
          required={required}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300 cursor-pointer"
          readOnly={!isOpen}
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <ChevronDown 
            size={20} 
            className={`text-gray-400 transition-transform duration-300 ${
              isOpen ? 'rotate-180' : 'rotate-0'
            }`} 
          />
        </div>
      </div>

      {/* Animated Dropdown */}
      <div className={`absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl transition-all duration-300 ease-out transform origin-top ${
        isOpen 
          ? 'opacity-100 scale-y-100 translate-y-0 dropdown-enter' 
          : 'opacity-0 scale-y-95 -translate-y-2 pointer-events-none dropdown-exit'
      }`}>
        <div className="max-h-60 overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <button
                key={option}
                type="button"
                onClick={() => handleOptionSelect(option)}
                className={`w-full text-left px-4 py-3 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 transform hover:scale-[1.01] hover:translate-x-1 ${
                  value === option ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-700'
                }`}
                style={{
                  animationDelay: `${index * 50}ms`
                }}
              >
                {option}
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-gray-500 text-center">
              No options found
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AnimatedDropdown