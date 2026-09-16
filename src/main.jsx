import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import FloatingToTop from './components/FloatingToTop.jsx'
import FloatingWhatsApp from './components/FloatingWhatsApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Navbar />
      <App />
      <Footer />
      <FloatingToTop/>
      <FloatingWhatsApp/>
    </BrowserRouter>
  </StrictMode>,
)
