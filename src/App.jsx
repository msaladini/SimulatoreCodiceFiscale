import { useState } from 'react'
import './App.css'
import Form from './components/Form'
import History from './components/History'

function App() {
  const [lastCalculation, setLastCalculation] = useState(null)
  const [formDataToEdit, setFormDataToEdit] = useState(null)

  const handleCalcolo = (calcolo) => {
    setLastCalculation(calcolo)
  }

  const handleEditFromHistory = (item) => {
    setFormDataToEdit(item)
  }

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <h1>Simulatore Calcolo Codice Fiscale</h1>
      </header>

      <main className="app-main">
        <div className="content-container">
          <div className="left-panel">
            <Form onCalcolo={handleCalcolo} initialData={formDataToEdit} />
          </div>

          <div className="right-panel">
            <History calculations={lastCalculation} onEdit={handleEditFromHistory} />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
