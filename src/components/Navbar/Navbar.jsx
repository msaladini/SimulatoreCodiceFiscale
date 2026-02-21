import { NavLink } from 'react-router-dom'
import './Navbar.css'

const navItems = [
    {
        to: '/',
        end: true,
        icon: 'badge',
        label: 'Codice Fiscale',
    },
    {
        to: '/decodifica',
        icon: 'manage_search',
        label: 'Decodifica CF',
    },
    {
        to: '/iban',
        icon: 'account_balance',
        label: 'Calcolo IBAN',
    },
    {
        to: '/partita-iva',
        icon: 'receipt_long',
        label: 'Partita IVA',
    },
]

function Navbar() {
    return (
        <nav className="app-navbar" aria-label="Navigazione principale">
            <ul className="navbar-list">
                {navItems.map(({ to, end, icon, label }) => (
                    <li key={to} className="navbar-item">
                        <NavLink
                            to={to}
                            end={end}
                            className={({ isActive }) =>
                                'navbar-link' + (isActive ? ' navbar-link--active' : '')
                            }
                        >
                            <span className="material-symbols-outlined navbar-icon">{icon}</span>
                            <span className="navbar-label">{label}</span>
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    )
}

export default Navbar
