import { lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import './App.css'

const Home = lazy(() => import('./pages/Home'))
const CodiceFiscale = lazy(() => import('./pages/CodiceFiscale'))
const DecodificaCodiceFiscale = lazy(() => import('./pages/DecodificaCodiceFiscale'))
const SimulazioneIban = lazy(() => import('./pages/SimulazioneIban'))
const SimulazionePartitaIva = lazy(() => import('./pages/SimulazionePartitaIva'))

const PAGE_TITLES = {
  '/': 'Seleziona lo strumento',
  '/calcolo-codice-fiscale': 'Simulatore Calcolo Codice Fiscale',
  '/decodifica-codice-fiscale': 'Decodifica Codice Fiscale',
  '/iban': 'Simulatore Calcolo IBAN',
  '/partita-iva': 'Simulatore Calcolo Partita IVA',
}

function App() {
  const { pathname } = useLocation()
  const title = PAGE_TITLES[pathname] ?? PAGE_TITLES['/'];

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <h1>{title}</h1>
        <Navbar />
      </header>

      <main className="app-main">
        <div className="main-content">
          <Suspense fallback={<div className="page-loading">Caricamento...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/calcolo-codice-fiscale" element={<CodiceFiscale />} />
              <Route path="/decodifica-codice-fiscale" element={<DecodificaCodiceFiscale />} />
              <Route path="/iban" element={<SimulazioneIban />} />
              <Route path="/partita-iva" element={<SimulazionePartitaIva />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </Suspense>
        </div>
      </main>
    </div>
  )
}

export default App
