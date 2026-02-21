import { Link } from 'react-router-dom'
import './Home.css'

const tools = [
    {
        to: '/calcolo-codice-fiscale',
        icon: 'badge',
        label: 'Codice Fiscale',
        description: 'Crea codici fiscali di test',
    },
    {
        to: '/decodifica-codice-fiscale',
        icon: 'manage_search',
        label: 'Decodifica CF',
        description: 'Estrai i dati da un codice fiscale',
    },
    {
        to: '/partita-iva',
        icon: 'receipt_long',
        label: 'Partita IVA',
        description: 'Crea Partite IVA di test',
    },
    {
        to: '/iban',
        icon: 'account_balance',
        label: 'Calcolo IBAN',
        description: 'Crea IBAN di test',
    },
]

function Home() {
    return (
        <div className="home-container">
            <div className="tools-grid">
                {tools.map((tool) => (
                    <Link to={tool.to} key={tool.to} className="tool-card">
                        <span className="material-symbols-outlined tool-icon">{tool.icon}</span>
                        <h3 className="tool-label">{tool.label}</h3>
                        <p className="tool-description">{tool.description}</p>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default Home
