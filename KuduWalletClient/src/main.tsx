import { StrictMode } from 'react'

import { createRoot } from 'react-dom/client'
import './index.css'
import App from "./App"
import { GoogleOAuthProvider } from '@react-oauth/google'
const clientId =import.meta.env.VITE_Google_Client_ID
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
    <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)
