import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AliveScope } from 'react-activation'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AliveScope>
      <App />
    </AliveScope>
  </StrictMode>,
)
