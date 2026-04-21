import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../api/axios'

export default function UpdateBook() {
  const [form, setForm] = useState({ serial_no: '', item_type: 'Book', name: '', status: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.serial_no) { setError('Serial number is required'); return }
    setError('')
    try {
      await api.put('/maintenance/item/update', form)
      setSuccess('Item updated successfully!')
      setTimeout(() => navigate('/maintenance'), 1500)
    } catch (err) {
      setError(err.response?.data?.detail || 'Update failed')
    }
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2>Update Book / Movie</h2>
        <Link to="/maintenance" className="btn btn-secondary">← Back</Link>
      </div>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Type</label>
            <div className="radio-group">
              {['Book', 'Movie'].map(t => (
                <label key={t}>
                  <input type="radio" name="item_type" value={t} checked={form.item_type === t} onChange={e => setForm({ ...form, item_type: e.target.value })} />
                  {t}
                </label>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label>Serial Number *</label>
            <input value={form.serial_no} onChange={e => setForm({ ...form, serial_no: e.target.value })} placeholder="e.g. SC(B)000001" required />
          </div>
          <div className="form-group">
            <label>Update Name</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Leave blank to keep existing" />
          </div>
          <div className="form-group">
            <label>Update Status</label>
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
              <option value="">-- No change --</option>
              <option>Available</option>
              <option>Issued</option>
              <option>Lost</option>
            </select>
          </div>
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
          <div className="btn-group">
            <button type="submit" className="btn btn-primary">Update</button>
          </div>
        </form>
      </div>
    </div>
  )
}