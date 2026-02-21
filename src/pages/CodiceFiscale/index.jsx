import { useState } from 'react'
import Form from '../../components/Form'
import History from '../../components/History'
import '../../App.css'

function CodiceFiscale() {
    const [lastCalculation, setLastCalculation] = useState(null)
    const [formDataToEdit, setFormDataToEdit] = useState(null)

    const handleCalcolo = (calcolo) => {
        setLastCalculation(calcolo)
    }

    const handleEditFromHistory = (item) => {
        setFormDataToEdit(item)
    }

    return (
        <div className="content-container">
            <div className="left-panel">
                <Form onCalcolo={handleCalcolo} initialData={formDataToEdit} />
            </div>
            <div className="right-panel">
                <History calculations={lastCalculation} onEdit={handleEditFromHistory} />
            </div>
        </div>
    )
}

export default CodiceFiscale
