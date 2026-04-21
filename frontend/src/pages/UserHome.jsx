import { Link } from 'react-router-dom'

const cards = [
  { to: '/transactions/availability', title: 'Check Availability', desc: 'Search if a book is available', color: '#3498db' },
  { to: '/transactions/issue', title: 'Issue Book', desc: 'Issue a book to a member', color: '#2ecc71' },
  { to: '/transactions/return', title: 'Return Book', desc: 'Process a book return', color: '#e67e22' },
  { to: '/transactions/pay-fine', title: 'Pay Fine', desc: 'Process fine payment', color: '#e74c3c' },
  { to: '/reports', title: 'Reports', desc: 'View all reports', color: '#9b59b6' },
]

export default function UserHome() {
  return (
    <div className="container">
      <h2>Welcome to Library Management System</h2>
      <div className="home-grid">
        {cards.map(c => (
          <Link key={c.to} to={c.to} className="home-card" style={{ borderTopColor: c.color }}>
            <h3>{c.title}</h3>
            <p>{c.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}