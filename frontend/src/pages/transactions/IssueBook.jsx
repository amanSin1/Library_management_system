import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

export default function IssueBook() {
  const [bookNames, setBookNames] = useState([])
  const [form, setForm] = useState({
    book_name: '', item_id: '', author_name: '',
    membership_number: '', issue_date: '', return_date: '', remarks: ''
  })
  const [copies, setCopies] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    api.get('/books/names').then(r => setBookNames(r.data))
  }, [])

  async function handleBookChange(e) {
    const name = e.target.value
    setForm({ ...form, book_name: name, item_id: '', author_name: '' })
    if (name) {
      const res = await api.get(`/books/by-name/${encodeURIComponent(name)}`)
      setCopies(res.data)
    }
  }

  function handleCopyChange(e) {
    const copy = copies.find(c => c.id === parseInt(e.target.value))
    setForm({ ...form, item_id: copy?.id || '', author_name: copy?.author_name || '' })
  }

  function handleIssueDateChange(e) {
    const d = e.target.value
    const ret = new Date(d)
    ret.setDate(ret.getDate() + 15)
    setForm({ ...form, issue_date: d, return_date: ret.toISOString().split('T')[0] })
  }

  function handleReturnDateChange(e) {
    const ret = e.target.value
    const max = new Date(form.issue_date)
    max.setDate(max.getDate() + 15)
    if (new Date(ret) > max) {
      setError('Return date cannot exceed 15 days from issue date')
      return
    }
    setError('')
    setForm({ ...form, return_date: ret })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.item_id || !form.membership_number || !form.issue_date || !form.return_date) {
      setError('Please fill all required fields')
      return
    }
    setError('')
    try {
      await api.post('/transactions/issue', {
        item_id: form.item_id,
        membership_number: form.membership_number,
        issue_date: form.issue_date,
        return_date: form.return_date,
        remarks: form.remarks
      })
      setSuccess('Book issued successfully!')
      setTimeout(() => navigate(location.state?.isAdmin ? '/admin' : '/home'), 1500)
    } catch (err) {
      setError(err.response?.data?.detail || 'Issue failed')
    }
  }

  return (
    <div className="container">
      <h2>Issue Book</h2>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Book Name *</label>
            <select value={form.book_name} onChange={handleBookChange} required>
              <option value="">-- Select Book --</option>
              {bookNames.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Select Copy (Serial No) *</label>
            <select value={form.item_id} onChange={handleCopyChange} required disabled={!form.book_name}>
              <option value="">-- Select Copy --</option>
              {copies.map(c => (
                <option key={c.id} value={c.id} disabled={!c.available}>
                  {c.serial_no} — {c.available ? 'Available' : 'Not Available'}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Author Name</label>
            <input value={form.author_name} readOnly />
          </div>
          <div className="form-group">
            <label>Membership Number *</label>
            <input value={form.membership_number} onChange={e => setForm({ ...form, membership_number: e.target.value })} placeholder="e.g. MEM000001" required />
          </div>
          <div className="form-group">
            <label>Issue Date *</label>
            <input type="date" value={form.issue_date} min={today} onChange={handleIssueDateChange} required />
          </div>
          <div className="form-group">
            <label>Return Date * (max 15 days)</label>
            <input type="date" value={form.return_date} onChange={handleReturnDateChange} required />
          </div>
          <div className="form-group">
            <label>Remarks</label>
            <textarea value={form.remarks} onChange={e => setForm({ ...form, remarks: e.target.value })} rows={3} />
          </div>
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
          <div className="btn-group">
            <button type="submit" className="btn btn-primary">Issue Book</button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}