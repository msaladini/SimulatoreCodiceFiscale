import { useState, useEffect } from 'react';
import { calcolaCodiceFiscale } from '../utils/codiceFiscaleCalculator';
import { getLocations } from '../data/locations';
import { elencoNomiMaschili, elencoNomiFemminili } from '../data/nomi';
import { elencoCognomi } from '../data/cognomi';
import './Form.css';

export default function Form({ onCalcolo, recentCalculations, initialData }) {
  const [formData, setFormData] = useState({
    cognome: '',
    nome: '',
    sesso: 'M',
    dataNascita: '',
    estero: false,
    codicePaese: ''
  });

  const [risultato, setRisultato] = useState('');
  const [errore, setErrore] = useState('');
  const [showCopyNotification, setShowCopyNotification] = useState(false);

  const locations = getLocations(formData.estero);

  useEffect(() => {
    if (initialData) {
      setFormData({
        cognome: initialData.cognome,
        nome: initialData.nome,
        sesso: initialData.sesso,
        dataNascita: initialData.dataNascita,
        estero: false,
        codicePaese: initialData.codicePaese || ''
      });
      setRisultato('');
      setErrore('');
    }
  }, [initialData]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setShowCopyNotification(true);
    setTimeout(() => setShowCopyNotification(false), 2000);
  };

  const isFormValid = () => {
    return (
      formData.cognome.trim() !== '' &&
      formData.nome.trim() !== '' &&
      formData.dataNascita !== '' &&
      formData.codicePaese !== ''
    );
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (name === 'estero') {
      setFormData(prev => ({ ...prev, codicePaese: '' }));
    }
  };

  const handleCalcola = () => {
    setErrore('');
    setRisultato('');

    try {
      if (!formData.cognome.trim()) {
        throw new Error('Cognome è obbligatorio');
      }
      if (!formData.nome.trim()) {
        throw new Error('Nome è obbligatorio');
      }
      if (!formData.dataNascita) {
        throw new Error('Data di nascita è obbligatoria');
      }
      if (!formData.codicePaese) {
        throw new Error('Comune/Stato di nascita è obbligatorio');
      }

      const dataNascita = new Date(formData.dataNascita);
      const cf = calcolaCodiceFiscale({
        cognome: formData.cognome,
        nome: formData.nome,
        dataNascita: dataNascita,
        sesso: formData.sesso,
        codicePaese: formData.codicePaese
      });

      setRisultato(cf);
      // Copia il codice fiscale nella clipboard
      copyToClipboard(cf);
      
      // Aggiorna lo storico
      const luogoNascita = locations.find(l => l.value === formData.codicePaese)?.label || formData.codicePaese;
      onCalcolo({
        codiceFiscale: cf,
        cognome: formData.cognome,
        nome: formData.nome,
        dataNascita: formData.dataNascita,
        luogoNascita: luogoNascita,
        sesso: formData.sesso,
        codicePaese: formData.codicePaese
      });
    } catch (err) {
      setErrore(err.message);
    }
  };

  const handleCodiceCasuale = () => {
    // Genera dati casuali per test
    const cognomeCasuale = elencoCognomi[Math.floor(Math.random() * elencoCognomi.length)];
    const sessoCasuale = Math.random() > 0.5 ? 'M' : 'F';
    const nomeCasuale = sessoCasuale === 'M' ? elencoNomiMaschili[Math.floor(Math.random() * elencoNomiMaschili.length)] : elencoNomiFemminili[Math.floor(Math.random() * elencoNomiFemminili.length)];
    
    const year = Math.floor(Math.random() * 60) + 1960;
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;
    const data = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    const comuni = getLocations(false);
    const comuneCasuale = comuni[Math.floor(Math.random() * comuni.length)];

    const nuoviDati = {
      cognome: cognomeCasuale,
      nome: nomeCasuale,
      sesso: sessoCasuale,
      dataNascita: data,
      estero: false,
      codicePaese: comuneCasuale.value
    };

    setFormData(nuoviDati);
    setErrore('');

    // Calcola il codice fiscale con i dati casuali generati
    try {
      const dataNascita = new Date(data);
      const cf = calcolaCodiceFiscale({
        cognome: cognomeCasuale,
        nome: nomeCasuale,
        dataNascita: dataNascita,
        sesso: sessoCasuale,
        codicePaese: comuneCasuale.value
      });

      setRisultato(cf);
      // Copia il codice fiscale nella clipboard
      copyToClipboard(cf);
      
      // Aggiorna lo storico
      onCalcolo({
        codiceFiscale: cf,
        cognome: cognomeCasuale,
        nome: nomeCasuale,
        dataNascita: data,
        luogoNascita: comuneCasuale.label,
        sesso: sessoCasuale,
        codicePaese: comuneCasuale.value
      });
    } catch (err) {
      setErrore(err.message);
    }
  };

  return (
    <div className="form-container">
      <h2>Dati per il calcolo</h2>

      <div className="form-group">
        <label htmlFor="cognome">Cognome</label>
        <input
          type="text"
          id="cognome"
          name="cognome"
          value={formData.cognome}
          onChange={handleInputChange}
          placeholder="Inserisci cognome"
        />
      </div>

      <div className="form-group">
        <label htmlFor="nome">Nome</label>
        <input
          type="text"
          id="nome"
          name="nome"
          value={formData.nome}
          onChange={handleInputChange}
          placeholder="Inserisci nome"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="sesso">Sesso</label>
          <select
            id="sesso"
            name="sesso"
            value={formData.sesso}
            onChange={handleInputChange}
          >
            <option value="M">Maschile</option>
            <option value="F">Femminile</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="dataNascita">Data di nascita</label>
          <input
            type="date"
            id="dataNascita"
            name="dataNascita"
            value={formData.dataNascita}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="form-group checkbox-group">
        <input
          type="checkbox"
          id="estero"
          name="estero"
          checked={formData.estero}
          onChange={handleInputChange}
        />
        <label htmlFor="estero">Estero</label>
      </div>

      <div className="form-group">
        <label htmlFor="codicePaese">
          {formData.estero ? 'Stato di nascita' : 'Comune di nascita'}
        </label>
        <select
          id="codicePaese"
          name="codicePaese"
          value={formData.codicePaese}
          onChange={handleInputChange}
        >
          <option value="">-- Seleziona --</option>
          {locations.map(loc => (
            <option key={loc.value} value={loc.value}>
              {loc.label}
            </option>
          ))}
        </select>
      </div>

      <div className="button-group">
        <button className="btn btn-secondary" onClick={handleCalcola} disabled={!isFormValid()}>
          CALCOLA CODICE FISCALE
        </button>
        <button className="btn btn-primary" onClick={handleCodiceCasuale}>
          CODICE CASUALE
        </button>
      </div>

      {errore && (
        <div className="error-message">
          {errore}
        </div>
      )}

      {risultato && (
        <div className="result-box">
          <div className="result-code">
            <span className="code-part">{risultato.substring(0, 3)}</span>
            <span className="code-part">{risultato.substring(3, 6)}</span>
            <span className="code-part">{risultato.substring(6, 8)}</span>
            <span className="code-part">{risultato.substring(8, 9)}</span>
            <span className="code-part">{risultato.substring(9, 11)}</span>
            <span className="code-part">{risultato.substring(11, 15)}</span>
            <span className="code-part">{risultato.substring(15, 16)}</span>
          </div>
        </div>
      )}

      {showCopyNotification && (
        <div className="copy-notification">
          ✓ Codice copiato negli appunti!
        </div>
      )}
    </div>
  );
}
