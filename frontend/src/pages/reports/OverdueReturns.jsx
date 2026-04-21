import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'

export default function OverdueReturns() {
  const [data, setData] = useState([])

  useEffect(() => { api.get('/reports/overdue').then(r => setData(r.data)) }, [])

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2>Overdue Returns</h2>
        <Link to="/reports" className="btn btn-secondary">← Back</Link>
      </div>
      <div className="card">
        <table>
          <thead>
            <tr><th>Serial No</th><th>Book</th><th>Membership No</th><th>Issue Date</th><th>Due Date</th><th>Fine</th></tr>
          </thead>
          <tbody>
            {data.map((r, i) => (
              <tr key={i}>
                <td>{r.serial_no}</td><td>{r.name}</td><td>{r.membership_number}</td>
                <td>{r.issue_date}</td><td>{r.expected_return_date}</td>
                <td style={{ color: '#e74c3c', fontWeight: 700 }}>₹{r.fine_calculated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}