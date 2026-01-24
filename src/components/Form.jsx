import { useState, useEffect } from 'react';
import { calcolaCodiceFiscale } from '../utils/codiceFiscaleCalculator';
import { getLocations } from '../data/locations';
import { getRandomNameAndGender } from '../utils/nameLoader';
import { elencoCognomi } from '../data/cognomi';
import './Form.css';

export default function Form({ onCalcolo, recentCalculations, initialData }) {
  const [formData, setFormData] = useState({
    cognome: '',
    nome: '',
    sesso: '',
    dataNascita: '',
    estero: false,
    codicePaese: ''
  });

  const [showAgeCalculator, setShowAgeCalculator] = useState(false);
  const [ageInput, setAgeInput] = useState({
    years: 18,
    relativeTo: 'oggi' // 'ieri', 'oggi', 'domani'
  });

  const [risultato, setRisultato] = useState('');
  const [errore, setErrore] = useState('');
  const [showCopyNotification, setShowCopyNotification] = useState(false);
  const [searchText, setSearchText] = useState(null);
  const [showLocationList, setShowLocationList] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const locations = getLocations(formData.estero);

  const handleFocus = (e) => {
    e.target.select();
  };

  useEffect(() => {
    if (initialData) {
      const isEstero = initialData.codicePaese?.startsWith('Z') || false;
      const formattedDataNascita = initialData.dataNascita ? initialData.dataNascita.split('-').reverse().join('/') : '';
      setFormData({
        cognome: initialData.cognome,
        nome: initialData.nome,
        sesso: initialData.sesso,
        dataNascita: formattedDataNascita,
        estero: isEstero,
        codicePaese: initialData.codicePaese || ''
      });
      setSearchText(null);
      setRisultato('');
      setErrore('');
      setIsDirty(false);
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
      formData.sesso !== '' &&
      formData.dataNascita !== '' &&
      formData.codicePaese !== ''
    );
  };

  const filteredLocations = (locations.filter(loc =>
    searchText && loc.label.toLowerCase().includes(searchText.toLowerCase())
  )).slice(0, 50);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : value;

    if (name === 'nome' || name === 'cognome') {
      newValue = newValue.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
    }

    if (name === 'dataNascita') {
      // Auto-format DD/MM/YYYY
      newValue = newValue.replace(/\D/g, '');
      if (newValue.length > 2) newValue = newValue.slice(0, 2) + '/' + newValue.slice(2);
      if (newValue.length > 5) newValue = newValue.slice(0, 5) + '/' + newValue.slice(5, 9);
      newValue = newValue.slice(0, 10);
    }

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    if (name === 'estero') {
      setFormData(prev => ({ ...prev, codicePaese: '' }));
      setSearchText(null);
    }
    setIsDirty(true);
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
      if (!formData.sesso) {
        throw new Error('Sesso è obbligatorio');
      }
      if (!formData.dataNascita) {
        throw new Error('Data di nascita è obbligatoria');
      }

      const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
      const match = formData.dataNascita.match(dateRegex);
      if (!match) {
        throw new Error('Formato data non valido (richiesto GG/MM/AAAA)');
      }

      const day = parseInt(match[1]);
      const month = parseInt(match[2]);
      const year = parseInt(match[3]);
      const dataNascita = new Date(year, month - 1, day);

      if (dataNascita.getFullYear() !== year || dataNascita.getMonth() !== month - 1 || dataNascita.getDate() !== day) {
        throw new Error('Data di nascita non valida');
      }

      if (!formData.codicePaese) {
        throw new Error('Comune/Stato di nascita è obbligatorio');
      }
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
      setIsDirty(false);
    } catch (err) {
      setErrore(err.message);
    }
  };

  const handleRandomField = (field) => {
    let newValue = '';

    switch (field) {
      case 'cognome':
        newValue = elencoCognomi[Math.floor(Math.random() * elencoCognomi.length)];
        setFormData(prev => ({ ...prev, cognome: newValue }));
        break;
      case 'nome':
        const { name, gender } = getRandomNameAndGender();
        setFormData(prev => ({
          ...prev,
          nome: name,
          sesso: gender
        }));
        break;
      case 'dataNascita':
        const year = Math.floor(Math.random() * 60) + 1960;
        const month = Math.floor(Math.random() * 12) + 1;
        const day = Math.floor(Math.random() * 28) + 1;
        newValue = `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
        setFormData(prev => ({ ...prev, dataNascita: newValue }));
        break;
      case 'codicePaese':
        const comuni = getLocations(formData.estero);
        const randomLoc = comuni[Math.floor(Math.random() * comuni.length)];
        setFormData(prev => ({ ...prev, codicePaese: randomLoc.value }));
        setSearchText(null);
        break;
      default:
        break;
    }
    setIsDirty(true);
  };

  const handleApplyAge = () => {
    const today = new Date();
    let targetBaseDate = new Date(today);

    if (ageInput.relativeTo === 'ieri') {
      targetBaseDate.setDate(today.getDate() - 1);
    } else if (ageInput.relativeTo === 'domani') {
      targetBaseDate.setDate(today.getDate() + 1);
    }

    const birthYear = targetBaseDate.getFullYear() - ageInput.years;
    const birthMonth = targetBaseDate.getMonth();
    const birthDay = targetBaseDate.getDate();

    const birthDate = new Date(birthYear, birthMonth, birthDay);
    const dateString = `${String(birthDate.getDate()).padStart(2, '0')}/${String(birthDate.getMonth() + 1).padStart(2, '0')}/${birthDate.getFullYear()}`;

    setFormData(prev => ({ ...prev, dataNascita: dateString }));
    setShowAgeCalculator(false);
    setIsDirty(true);
  };

  const handleCodiceCasuale = () => {

    // Genera dati casuali per test
    const cognomeCasuale = elencoCognomi[Math.floor(Math.random() * elencoCognomi.length)];
    const { name: nomeCasuale, gender: sessoCasuale } = getRandomNameAndGender();

    const year = Math.floor(Math.random() * 60) + 1960;
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;
    const data = `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;

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
    setSearchText(null);
    setErrore('');

    // Calcola il codice fiscale con i dati casuali generati
    try {
      const parts = data.split('/');
      const dataNascita = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
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
      setIsDirty(false);
    } catch (err) {
      setErrore(err.message);
    }
  };

  return (
    <div className="form-container">
      <h2>Dati per il calcolo</h2>

      <div className="form-group">
        <label htmlFor="cognome">Cognome</label>
        <div className="input-with-icon">
          <input
            type="text"
            id="cognome"
            name="cognome"
            value={formData.cognome}
            onChange={handleInputChange}
            onFocus={handleFocus}
            placeholder="Inserisci cognome"
          />
          <span className="material-symbols-outlined input-icon" onClick={() => handleRandomField('cognome')}>
            auto_fix_high
          </span>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="nome">Nome</label>
        <div className="input-with-icon">
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleInputChange}
            onFocus={handleFocus}
            placeholder="Inserisci nome"
          />
          <span className="material-symbols-outlined input-icon" onClick={() => handleRandomField('nome')}>
            auto_fix_high
          </span>
        </div>
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
            <option value="" disabled>Seleziona...</option>
            <option value="M">Maschile</option>
            <option value="F">Femminile</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="dataNascita">Data di nascita</label>
          <div className="input-with-icon">
            <input
              type="text"
              id="dataNascita"
              name="dataNascita"
              value={formData.dataNascita}
              onChange={handleInputChange}
              placeholder="GG/MM/AAAA"
            />
            <span className="material-symbols-outlined input-icon random-date" onClick={() => handleRandomField('dataNascita')}>
              auto_fix_high
            </span>
            <span className="material-symbols-outlined input-icon calendar-btn" onClick={() => setShowAgeCalculator(!showAgeCalculator)}>
              cake
            </span>
            {showAgeCalculator && (
              <div className="age-calculator-popover">
                <div className="calculator-header">Calcola data di nascita</div>
                <div className="calculator-body">
                  <div className="calc-row">
                    <label>Età (anni):</label>
                    <input
                      type="number"
                      min="0"
                      max="150"
                      value={ageInput.years}
                      onChange={(e) => setAgeInput(prev => ({ ...prev, years: parseInt(e.target.value) || 0 }))}
                      onFocus={handleFocus}
                    />
                  </div>
                  <div className="calc-row">
                    <label>In data:</label>
                    <select
                      value={ageInput.relativeTo}
                      onChange={(e) => setAgeInput(prev => ({ ...prev, relativeTo: e.target.value }))}
                    >
                      <option value="ieri">Ieri</option>
                      <option value="oggi">Oggi</option>
                      <option value="domani">Domani</option>
                    </select>
                  </div>
                </div>
                <div className="calculator-footer">
                  <button className="btn-small btn-cancel" onClick={() => setShowAgeCalculator(false)}>Annulla</button>
                  <button className="btn-small btn-confirm" onClick={handleApplyAge}>Conferma</button>
                </div>
              </div>
            )}
          </div>
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
        <label htmlFor="searchLocation">
          {formData.estero ? 'Stato di nascita' : 'Comune di nascita'}
        </label>
        <div className="input-with-icon">
          <input
            type="text"
            id="searchLocation"
            placeholder="Cerca comune o stato..."
            value={searchText !== null ? searchText : (formData.codicePaese ? locations.find(l => l.value === formData.codicePaese)?.label : '')}
            onChange={(e) => {
              const formattedValue = e.target.value.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
              setSearchText(formattedValue);
              setShowLocationList(true);
              setActiveIndex(0);
            }}
            onKeyDown={(e) => {
              if (!showLocationList || filteredLocations.length === 0) return;

              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActiveIndex(prev => (prev < filteredLocations.length - 1 ? prev + 1 : prev));
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActiveIndex(prev => (prev > 0 ? prev - 1 : prev));
              } else if (e.key === 'Enter' && activeIndex >= 0) {
                e.preventDefault();
                const selected = filteredLocations[activeIndex];
                if (selected) {
                  setFormData(prev => ({ ...prev, codicePaese: selected.value }));
                  setSearchText(null);
                  setShowLocationList(false);
                  setIsDirty(true);
                }
              } else if (e.key === 'Escape') {
                setShowLocationList(false);
                setSearchText(null);
              }
            }}
            onFocus={(e) => {
              const currentLabel = locations.find(l => l.value === formData.codicePaese)?.label || '';
              setSearchText(currentLabel);
              setShowLocationList(true);
              setActiveIndex(0);
              handleFocus(e);
            }}
            onBlur={() => {
              setTimeout(() => {
                if (searchText === '') {
                  setFormData(prev => ({ ...prev, codicePaese: '' }));
                }
                setShowLocationList(false);
                setSearchText(null);
              }, 200);
            }}
            className="search-input"
          />
          <span className="material-symbols-outlined input-icon" onClick={() => handleRandomField('codicePaese')}>
            auto_fix_high
          </span>
        </div>
        {showLocationList && searchText && (
          <div className="location-list">
            {filteredLocations.length > 0 ? (
              filteredLocations.map((loc, index) => (
                <div
                  key={loc.value}
                  className={`location-item ${index === activeIndex ? 'active' : ''}`}
                  onClick={() => {
                    setFormData(prev => ({ ...prev, codicePaese: loc.value }));
                    setSearchText(null);
                    setShowLocationList(false);
                    setIsDirty(true);
                  }}
                >
                  {loc.label}
                </div>
              ))
            ) : (
              <div className="location-item no-results">Nessun risultato trovato</div>
            )}
          </div>
        )}
      </div>

      <div className="button-group">
        <button className="btn btn-secondary" onClick={handleCalcola} disabled={!isFormValid() || !isDirty}>
          CALCOLA CODICE FISCALE
        </button>
        <button className="btn btn-primary" onClick={handleCodiceCasuale}>
          CODICE CASUALE
        </button>
      </div>

      {
        errore && (
          <div className="error-message">
            {errore}
          </div>
        )
      }

      {
        risultato && (
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
        )
      }

      {
        showCopyNotification && (
          <div className="copy-notification">
            ✓ Codice copiato negli appunti!
          </div>
        )
      }
    </div >
  );
}
