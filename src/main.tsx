import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { preloadCriticalResources, measurePerformance } from './utils/performance'
import { registerSW } from './utils/pwa'

// Initialize performance monitoring and optimizations
preloadCriticalResources()
measurePerformance()
registerSW()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)