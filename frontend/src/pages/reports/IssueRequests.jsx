import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'

export default function IssueRequests() {
  const [data, setData] = useState([])

  useEffect(() => { api.get('/reports/issue-requests').then(r => setData(r.data)) }, [])

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2>Pending Issue Requests</h2>
        <Link to="/reports" className="btn btn-secondary">← Back</Link>
      </div>
      <div className="card">
        <table>
          <thead>
            <tr><th>Membership No</th><th>Book/Movie</th><th>Requested Date</th><th>Fulfilled Date</th><th>Status</th></tr>
          </thead>
          <tbody>
            {data.map(r => (
              <tr key={r.id}>
                <td>{r.membership_number}</td><td>{r.item_name}</td>
                <td>{r.requested_date}</td><td>{r.fulfilled_date || '—'}</td>
                <td><span className={`badge ${r.is_fulfilled ? 'badge-green' : 'badge-yellow'}`}>{r.is_fulfilled ? 'Fulfilled' : 'Pending'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}