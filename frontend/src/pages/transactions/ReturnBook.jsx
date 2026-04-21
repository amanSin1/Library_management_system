import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

export default function ReturnBook() {
  const [form, setForm] = useState({ serial_no: '', actual_return_date: '', remarks: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const today = new Date().toISOString().split('T')[0]

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.serial_no || !form.actual_return_date) {
      setError('Serial number and return date are required')
      return
    }
    setError('')
    try {
      const res = await api.post('/transactions/return', form)
      navigate('/transactions/pay-fine', { state: { preview: res.data } })
    } catch (err) {
      setError(err.response?.data?.detail || 'Return failed')
    }
  }

  return (
    <div className="container">
      <h2>Return Book</h2>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Serial Number *</label>
            <input value={form.serial_no} onChange={e => setForm({ ...form, serial_no: e.target.value })} placeholder="e.g. SC(B)000001" required />
          </div>
          <div className="form-group">
            <label>Actual Return Date *</label>
            <input type="date" value={form.actual_return_date} onChange={e => setForm({ ...form, actual_return_date: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Remarks</label>
            <textarea value={form.remarks} onChange={e => setForm({ ...form, remarks: e.target.value })} rows={3} />
          </div>
          {error && <p className="error">{error}</p>}
          <div className="btn-group">
            <button type="submit" className="btn btn-primary">Proceed to Pay Fine</button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}