import { lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import './App.css'

const CodiceFiscale = lazy(() => import('./pages/CodiceFiscale'))
const DecodificaCodiceFiscale = lazy(() => import('./pages/DecodificaCodiceFiscale'))
const SimulazioneIban = lazy(() => import('./pages/SimulazioneIban'))
const SimulazionePartitaIva = lazy(() => import('./pages/SimulazionePartitaIva'))

const PAGE_TITLES = {
  '/': 'Simulatore Calcolo Codice Fiscale',
  '/decodifica': 'Decodifica Codice Fiscale',
  '/iban': 'Simulatore Calcolo IBAN',
  '/partita-iva': 'Simulatore Calcolo Partita IVA',
}

function App() {
  const { pathname } = useLocation()
  const title = PAGE_TITLES[pathname] ?? 'Simulatori Fiscali'

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <h1>{title}</h1>
        <Navbar />
      </header>

      <main className="app-main">
        <Suspense fallback={<div className="page-loading">Caricamento...</div>}>
          <Routes>
            <Route path="/" element={<CodiceFiscale />} />
            <Route path="/decodifica" element={<DecodificaCodiceFiscale />} />
            <Route path="/iban" element={<SimulazioneIban />} />
            <Route path="/partita-iva" element={<SimulazionePartitaIva />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  )
}

export default App
