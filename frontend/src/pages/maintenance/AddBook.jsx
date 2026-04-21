import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../api/axios'

const CATEGORIES = ['Science', 'Economics', 'Fiction', 'Children', 'Personal Development']

export default function AddBook() {
  const [form, setForm] = useState({
    name: '', author_name: '', category: 'Science',
    item_type: 'Book', cost: '', procurement_date: '', quantity: 1
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      const res = await api.post('/maintenance/item/add', { ...form, cost: parseFloat(form.cost), quantity: parseInt(form.quantity) })
      setSuccess(`Added! Serial numbers: ${res.data.serial_numbers.join(', ')}`)
      setTimeout(() => navigate('/maintenance'), 2000)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to add item')
    }
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2>Add Book / Movie</h2>
        <Link to="/maintenance" className="btn btn-secondary">← Back</Link>
      </div>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Type *</label>
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
            <label>Name *</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Author / Director *</label>
            <input value={form.author_name} onChange={e => setForm({ ...form, author_name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Category *</label>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Cost (₹) *</label>
            <input type="number" value={form.cost} onChange={e => setForm({ ...form, cost: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Procurement Date *</label>
            <input type="date" value={form.procurement_date} onChange={e => setForm({ ...form, procurement_date: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Quantity / Copies</label>
            <input type="number" min="1" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} />
          </div>
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
          <div className="btn-group">
            <button type="submit" className="btn btn-primary">Add</button>
          </div>
        </form>
      </div>
    </div>
  )
}