import React from 'react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

interface AnimatedSkillBarProps {
  name: string
  proficiency: number
  delay?: number
}

const AnimatedSkillBar: React.FC<AnimatedSkillBarProps> = ({ 
  name, 
  proficiency, 
  delay = 0 
}) => {
  const { isVisible, elementRef } = useScrollAnimation(0.3)

  return (
    <div ref={elementRef}>
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-gray-700 font-medium">{name}</h4>
        <span className="text-sm text-gray-500">{proficiency}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000 ease-out"
          style={{ 
            width: isVisible ? `${proficiency}%` : '0%',
            transitionDelay: `${delay}ms`
          }}
          role="progressbar"
          aria-valuenow={isVisible ? proficiency : 0}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${name} proficiency: ${proficiency}%`}
        ></div>
      </div>
    </div>
  )
}

export default AnimatedSkillBar