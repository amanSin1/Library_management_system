import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'

export default function MembershipsList() {
  const [data, setData] = useState([])

  useEffect(() => { api.get('/reports/memberships').then(r => setData(r.data)) }, [])

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2>Master List of Memberships</h2>
        <Link to="/reports" className="btn btn-secondary">← Back</Link>
      </div>
      <div className="card">
        <table>
          <thead>
            <tr><th>Membership No</th><th>Name</th><th>Contact</th><th>Address</th><th>Aadhar</th><th>Start</th><th>End</th><th>Status</th><th>Fine Pending</th></tr>
          </thead>
          <tbody>
            {data.map(r => (
              <tr key={r.membership_number}>
                <td>{r.membership_number}</td><td>{r.name}</td><td>{r.contact_number}</td>
                <td>{r.contact_address}</td><td>{r.aadhar_card_no}</td>
                <td>{r.start_date}</td><td>{r.end_date}</td>
                <td><span className={`badge ${r.status === 'Active' ? 'badge-green' : 'badge-red'}`}>{r.status}</span></td>
                <td>₹{r.fine_pending}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}