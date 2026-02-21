import { useState } from 'react'
import { IBAN_COUNTRIES } from './ibanData'
import { generateIban, validateIban } from './ibanUtils'
import './SimulazioneIban.css'

function SimulazioneIban() {
    const [selectedCountry, setSelectedCountry] = useState(IBAN_COUNTRIES[0])
    const [ibanInput, setIbanInput] = useState('')
    const [validationResult, setValidationResult] = useState({ isValid: null, error: null })
    const [showCopyNotification, setShowCopyNotification] = useState(false)

    const copyToClipboard = (text) => {
        const clean = text.replace(/\s+/g, '');
        navigator.clipboard.writeText(clean);
        setShowCopyNotification(true);
        setTimeout(() => setShowCopyNotification(false), 2000);
    };

    const handleGenerate = () => {
        const newIban = generateIban(selectedCountry.code)
        setIbanInput(newIban)
        setValidationResult({ isValid: true, error: null })
        copyToClipboard(newIban)
    }

    const handleCountryChange = (e) => {
        const country = IBAN_COUNTRIES.find(c => c.code === e.target.value)
        setSelectedCountry(country)
        setIbanInput('')
        setValidationResult({ isValid: null, error: null })
    }

    const handleInputChange = (e) => {
        const value = e.target.value.replace(/\s+/g, '').toUpperCase()
        setIbanInput(value)

        // Auto-sync country dropdown if prefix matches a supported country
        if (value.length >= 2) {
            const countryCode = value.substring(0, 2)
            const country = IBAN_COUNTRIES.find(c => c.code === countryCode)
            if (country && country.code !== selectedCountry.code) {
                setSelectedCountry(country)
            }
        }

        if (value.length >= 4) {
            setValidationResult(validateIban(value))
        } else {
            setValidationResult({ isValid: null, error: null })
        }
    }

    return (
        <div className="iban-container">
            <div className="iban-card">
                <header className="iban-card-header">
                    <span className="material-symbols-outlined header-icon">account_balance</span>
                    <div className="header-text">
                        <h2>Simulatore Codici IBAN</h2>
                        <p>Genera e convalida codici IBAN conformi allo standard ISO 13616.</p>
                    </div>
                </header>

                <div className="iban-controls">
                    <div className="control-group">
                        <label htmlFor="country-select">Seleziona Paese</label>
                        <select
                            id="country-select"
                            value={selectedCountry.code}
                            onChange={handleCountryChange}
                            className="iban-select"
                        >
                            {IBAN_COUNTRIES.map(country => (
                                <option key={country.code} value={country.code}>
                                    {country.name} ({country.code})
                                </option>
                            ))}
                        </select>
                    </div>

                    <button className="iban-btn primary" onClick={handleGenerate}>
                        <span className="material-symbols-outlined">autofps_select</span>
                        Genera IBAN Casuale
                    </button>
                </div>

                <div className="iban-input-section">
                    <label htmlFor="iban-input">Codice IBAN (senza spazi)</label>
                    <div className="input-with-status">
                        <input
                            id="iban-input"
                            type="text"
                            value={ibanInput}
                            onChange={handleInputChange}
                            placeholder="ESEMPIO: IT60X0123456789012345678901"
                            className={`iban-text-input ${validationResult.isValid === true ? 'valid' : validationResult.isValid === false ? 'invalid' : ''}`}
                            spellCheck="false"
                            autoComplete="off"
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

                <div className="main-card-footer">
                    <div className="info-badge">
                        <span className="material-symbols-outlined">verified</span>
                        Swift Release 101 (Dicembre 2025)
                    </div>
                </div>
            </div>

            <div className="iban-info-card">
                <h3>Dettagli Struttura</h3>
                {validationResult.isValid === true && ibanInput.length >= 4 ? (
                    <div className="iban-details animate-in">
                        <div className="details-vertical">
                            <div className="detail-item">
                                <span className="detail-label">Codice Paese</span>
                                <span className="detail-value">{ibanInput.substring(0, 2)}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Check Digits</span>
                                <span className="detail-value">{ibanInput.substring(2, 4)}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Paese Rilevato</span>
                                <span className="detail-value">{selectedCountry.name}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Lunghezza Attesa</span>
                                <span className="detail-value">{selectedCountry.length} caratteri</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="info-placeholder">
                        <span className="material-symbols-outlined">info</span>
                        <p>Inserisci o genera un codice IBAN per visualizzarne la scomposizione e i dettagli strutturali.</p>
                    </div>
                )}
            </div>

            {showCopyNotification && (
                <div className="copy-notification">
                    <span className="material-symbols-outlined">content_paste</span>
                    ✓ IBAN copiato negli appunti
                </div>
            )}
        </div>
    )
}

export default SimulazioneIban
