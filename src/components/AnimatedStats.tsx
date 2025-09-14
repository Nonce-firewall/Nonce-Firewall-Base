import React from 'react'
import { useCountAnimation } from '../hooks/useCountAnimation'

interface AnimatedStatsProps {
  yearsExperience: number
  projectsCompleted: number
  happyClients: number
  commitsCount: number
}

const AnimatedStats: React.FC<AnimatedStatsProps> = ({
  yearsExperience,
  projectsCompleted,
  happyClients,
  commitsCount
}) => {
  const { count: yearsCount, elementRef: yearsRef } = useCountAnimation(yearsExperience, 2000)
  const { count: projectsCount, elementRef: projectsRef } = useCountAnimation(projectsCompleted, 2500)
  const { count: clientsCount, elementRef: clientsRef } = useCountAnimation(happyClients, 2200)
  const { count: coffeeCount, elementRef: coffeeRef } = useCountAnimation(commitsCount, 2800)

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto animate-slide-up" style={{ animationDelay: '0.6s' }}>
      <div className="text-center" ref={yearsRef}>
        <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">{yearsCount}+</div>
        <div className="text-gray-600 text-sm md:text-base">Years Experience</div>
      </div>
      <div className="text-center" ref={projectsRef}>
        <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">{projectsCount}+</div>
        <div className="text-gray-600 text-sm md:text-base">Projects Completed</div>
      </div>
      <div className="text-center" ref={clientsRef}>
        <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">{clientsCount}+</div>
        <div className="text-gray-600 text-sm md:text-base">Happy Clients</div>
      </div>
      <div className="text-center" ref={coffeeRef}>
        <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">{coffeeCount}+</div>
        <div className="text-gray-600 text-sm md:text-base">Commits</div>
      </div>
    </div>
  )
}

export default AnimatedStats