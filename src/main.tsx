import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
// import Apptest from './apptest.tsx'
// import Gun from './gun.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <Apptest /> */}
    {/* <Gun /> */}
    <App />
  </StrictMode>,
)
