import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { applyRandomTheme } from './utils/theme'
import App from './App.jsx'

// Initialize random theme
applyRandomTheme();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
