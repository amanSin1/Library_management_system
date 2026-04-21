import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../api/axios'

export default function AddMembership() {
  const [form, setForm] = useState({
    first_name: '', last_name: '', contact_number: '',
    contact_address: '', aadhar_card_no: '', start_date: '', duration: '6 months'
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      const res = await api.post('/maintenance/membership/add', form)
      setSuccess(`Membership added! Number: ${res.data.membership_number}`)
      setTimeout(() => navigate('/maintenance'), 2000)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to add membership')
    }
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2>Add Membership</h2>
        <Link to="/maintenance" className="btn btn-secondary">← Back</Link>
      </div>
      <div className="card">
        <form onSubmit={handleSubmit}>
          {[['first_name','First Name'],['last_name','Last Name'],['contact_number','Contact Number (10 digits)'],['contact_address','Contact Address'],['aadhar_card_no','Aadhar Card No']].map(([k, l]) => (
            <div className="form-group" key={k}>
              <label>{l} *</label>
              <input value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} required />
            </div>
          ))}
          <div className="form-group">
            <label>Start Date *</label>
            <input type="date" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Membership Duration *</label>
            <div className="radio-group">
              {['6 months', '1 year', '2 years'].map(d => (
                <label key={d}>
                  <input type="radio" name="duration" value={d} checked={form.duration === d} onChange={e => setForm({ ...form, duration: e.target.value })} />
                  {d}
                </label>
              ))}
            </div>
          </div>
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
          <div className="btn-group">
            <button type="submit" className="btn btn-primary">Add Membership</button>
          </div>
        </form>
      </div>
    </div>
  )
}