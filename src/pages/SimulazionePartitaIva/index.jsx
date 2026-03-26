import { useState } from 'react'
import { generatePartitaIva, validatePartitaIva } from './partitaIvaUtils'
import './SimulazionePartitaIva.css'

function SimulazionePartitaIva() {
    const [piInput, setPiInput] = useState('')
    const [validationResult, setValidationResult] = useState({ isValid: null, error: null })
    const [showCopyNotification, setShowCopyNotification] = useState(false)

    const copyToClipboard = (text) => {
        const clean = text.replace(/\s+/g, '');
        navigator.clipboard.writeText(clean);
        setShowCopyNotification(true);
        setTimeout(() => setShowCopyNotification(false), 2000);
    };

    const handleGenerate = () => {
        const newPi = generatePartitaIva()
        setPiInput(newPi)
        setValidationResult({ isValid: true, error: null })
        copyToClipboard(newPi)
    }

    const handleInputChange = (e) => {
        const value = e.target.value.replace(/\s+/g, '') // Keep spaces removed
        
        // Prevent typing non-numeric characters if desired, but validation handles it too
        // It's a good user experience to just type the value and see validation
        setPiInput(value)

        if (value.length >= 11) {
            setValidationResult(validatePartitaIva(value))
        } else if (value.length > 0) {
            // Technically invalid when length > 0 and < 11, but maybe we just show empty check until 11 characters,
            // or we show error if it contains non-numeric. Let's use the explicit validatePartitaIva result or show partial text.
            const result = validatePartitaIva(value)
            setValidationResult(result)
        } else {
            setValidationResult({ isValid: null, error: null })
        }
    }

    return (
        <div className="piva-container">
            <div className="piva-card">
                <header className="piva-card-header">
                    <span className="material-symbols-outlined header-icon">receipt_long</span>
                    <div className="header-text">
                        <h2>Simulatore Partita IVA</h2>
                        <p>Genera e convalida Partite IVA italiane basate sull'algoritmo ufficiale (Formula di Luhn).</p>
                    </div>
                </header>

                <div className="piva-controls">
                    <button className="piva-btn primary" onClick={handleGenerate}>
                        <span className="material-symbols-outlined">autofps_select</span>
                        Genera Partita IVA Casuale
                    </button>
                </div>

                <div className="piva-input-section">
                    <div className="input-header-row">
                        <label htmlFor="piva-input">Partita IVA (11 cifre)</label>
                        {validationResult.isValid === true && piInput && (
                            <button
                                className="copy-label-btn"
                                onClick={() => copyToClipboard(piInput)}
                                type="button"
                            >
                                COPIA
                                <span className="material-symbols-outlined label-icon">content_copy</span>
                            </button>
                        )}
                    </div>
                    <div className="input-with-status">
                        <input
                            id="piva-input"
                            type="text"
                            value={piInput}
                            onChange={handleInputChange}
                            onFocus={(e) => e.target.select()}
                            placeholder="ESEMPIO: 04674670966"
                            className={`piva-text-input ${validationResult.isValid === true ? 'valid' : validationResult.isValid === false ? 'invalid' : ''}`}
                            spellCheck="false"
                            autoComplete="off"
                            maxLength={11}
                        />
                        {validationResult.isValid !== null && (
                            <span className={`status-icon material-symbols-outlined ${validationResult.isValid ? 'valid' : 'invalid'}`}>
                                {validationResult.isValid ? 'check_circle' : 'error'}
                            </span>
                        )}
                    </div>
                    {validationResult.error && (
                        <p className="error-message">{validationResult.error}</p>
                    )}
                </div>


            </div>

            <div className="piva-info-card">
                <h3>Dettagli Struttura</h3>
                {validationResult.isValid === true && piInput.length === 11 ? (
                    <div className="piva-details animate-in">
                        <div className="details-vertical">
                            <div className="detail-item">
                                <span className="detail-label">Matricola (Id Contribuente)</span>
                                <span className="detail-value">{piInput.substring(0, 7)}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Codice Ufficio (Provincia)</span>
                                <span className="detail-value">{piInput.substring(7, 10)}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Carattere di Controllo (Luhn)</span>
                                <span className="detail-value">{piInput.substring(10, 11)}</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="info-placeholder">
                        <span className="material-symbols-outlined">info</span>
                        <p>Inserisci o genera una Partita IVA per visualizzarne la scomposizione e i dettagli strutturali.</p>
                    </div>
                )}
            </div>

            {showCopyNotification && (
                <div className="copy-notification">
                    <span className="material-symbols-outlined">content_paste</span>
                    ✓ Partita IVA copiata negli appunti
                </div>
            )}
        </div>
    )
}

export default SimulazionePartitaIva
