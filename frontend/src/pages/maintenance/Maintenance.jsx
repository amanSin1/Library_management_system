import { Link } from 'react-router-dom'

const items = [
  { to: '/maintenance/membership/add', title: 'Add Membership' },
  { to: '/maintenance/membership/update', title: 'Update Membership' },
  { to: '/maintenance/item/add', title: 'Add Book / Movie' },
  { to: '/maintenance/item/update', title: 'Update Book / Movie' },
  { to: '/maintenance/users', title: 'User Management' },
]

export default function Maintenance() {
  return (
    <div className="container">
      <h2>Maintenance</h2>
      <div className="card">
        {items.map(r => (
          <Link key={r.to} to={r.to} style={{
            display: 'block', padding: '14px 16px', borderBottom: '1px solid #eee',
            color: '#4a90d9', textDecoration: 'none', fontSize: '15px'
          }}>
            → {r.title}
          </Link>
        ))}
      </div>
    </div>
  )
}