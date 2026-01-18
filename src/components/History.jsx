import { useState, useEffect, useRef } from 'react';
import './History.css';

export default function History({ calculations, onEdit }) {
  const [history, setHistory] = useState([]);
  const [showCopyNotification, setShowCopyNotification] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Al primo render: carica da localStorage
    // Nei render successivi: salva nel localStorage
    if (isFirstRender.current) {
      isFirstRender.current = false;
      const savedHistory = localStorage.getItem('codiciFiscaliHistory');
      if (savedHistory) {
        try {
          setHistory(JSON.parse(savedHistory));
        } catch (err) {
          console.error('Errore caricamento storico:', err);
        }
      }
    } else {
      // Salva lo storico nel localStorage quando cambia (dopo il primo render)
      localStorage.setItem('codiciFiscaliHistory', JSON.stringify(history));
    }
  }, [history]);

  useEffect(() => {
    // Aggiunge un nuovo calcolo allo storico
    if (calculations) {
      setHistory(prev => {
        const newHistory = [
          {
            id: Date.now(),
            ...calculations,
            timestamp: new Date().toLocaleString()
          },
          ...prev
        ];
        return newHistory.slice(0, 50); // Mantiene solo gli ultimi 50
      });
    }
  }, [calculations]);

  const handleDelete = (id) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const handleClearAll = () => {
    if (window.confirm('Sei sicuro di voler cancellare tutto lo storico?')) {
      setHistory([]);
      localStorage.removeItem('codiciFiscaliHistory');
    }
  };

  const calculateAge = (dataNascita) => {
    if (!dataNascita) return '-';
    const birthDate = new Date(dataNascita);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleCopyToClipboard = (codiceFiscale) => {
    navigator.clipboard.writeText(codiceFiscale);
    setShowCopyNotification(true);
    setTimeout(() => setShowCopyNotification(false), 2000);
  };

  const handleEdit = (item) => {
    onEdit({
      cognome: item.cognome,
      nome: item.nome,
      sesso: item.sesso,
      dataNascita: item.dataNascita,
      codicePaese: item.codicePaese
    });
  };

  return (
    <div className="history-container">
      <div className="history-header">
        <h2>Storico</h2>
        {history.length > 0 && (
          <button className="btn-clear" onClick={handleClearAll}>
            AZZERA LO STORICO
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="empty-state">
          <p>Nessun codice fiscale calcolato ancora.</p>
          <p className="text-small">I calcoli verranno memorizzati qui.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="history-table">
            <thead>
              <tr>
                <th>Codice fiscale</th>
                <th>Cognome</th>
                <th>Nome</th>
                <th>Luogo di nascita</th>
                <th>Età</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {history.map(item => (
                <tr key={item.id}>
                  <td className="code-cell">
                    <code>{item.codiceFiscale}</code>
                  </td>
                  <td>{item.cognome}</td>
                  <td>{item.nome}</td>
                  <td>{item.luogoNascita}</td>
                  <td className="age-cell">{calculateAge(item.dataNascita)}</td>
                  <td className="actions-cell">
                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(item)}
                      title="Modifica"
                    >
                      ✎
                    </button>
                    <button
                      className="btn-copy"
                      onClick={() => handleCopyToClipboard(item.codiceFiscale)}
                      title="Copia codice fiscale"
                    >
                      📋
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(item.id)}
                      title="Elimina"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
