import { Link } from 'react-router-dom'

const reports = [
  { to: '/reports/books', title: 'Master List of Books' },
  { to: '/reports/movies', title: 'Master List of Movies' },
  { to: '/reports/memberships', title: 'Master List of Memberships' },
  { to: '/reports/active-issues', title: 'Active Issues' },
  { to: '/reports/overdue', title: 'Overdue Returns' },
  { to: '/reports/issue-requests', title: 'Pending Issue Requests' },
]

export default function Reports() {
  return (
    <div className="container">
      <h2>Reports</h2>
      <div className="card">
        {reports.map(r => (
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