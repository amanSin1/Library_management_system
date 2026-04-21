import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'

export default function BooksList() {
  const [data, setData] = useState([])

  useEffect(() => { api.get('/reports/books').then(r => setData(r.data)) }, [])

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2>Master List of Books</h2>
        <Link to="/reports" className="btn btn-secondary">← Back</Link>
      </div>
      <div className="card">
        <table>
          <thead>
            <tr><th>Serial No</th><th>Name</th><th>Author</th><th>Category</th><th>Status</th><th>Cost</th><th>Procurement Date</th></tr>
          </thead>
          <tbody>
            {data.map(r => (
              <tr key={r.serial_no}>
                <td>{r.serial_no}</td><td>{r.name}</td><td>{r.author_name}</td>
                <td>{r.category}</td>
                <td><span className={`badge ${r.status === 'Available' ? 'badge-green' : 'badge-red'}`}>{r.status}</span></td>
                <td>₹{r.cost}</td><td>{r.procurement_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}