import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav style={{
      background: '#1a1a2e', color: 'white', padding: '0 24px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      height: '56px', boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
    }}>
      <Link to={user?.isAdmin ? '/admin' : '/home'}
        style={{ color: 'white', textDecoration: 'none', fontWeight: 700, fontSize: '18px' }}>
        📚 Library MS
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <span style={{ fontSize: '14px', color: '#aaa' }}>
          {user?.name} {user?.isAdmin && <span style={{ color: '#4a90d9' }}>(Admin)</span>}
        </span>
        <button onClick={handleLogout} className="btn btn-danger" style={{ padding: '6px 16px' }}>
          Logout
        </button>
      </div>
    </nav>
  )
}