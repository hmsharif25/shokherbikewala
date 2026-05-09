import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { initCacheManagement } from './lib/cache'
import App from './App.tsx'

initCacheManagement()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
