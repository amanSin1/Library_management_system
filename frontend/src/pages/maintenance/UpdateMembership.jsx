import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../api/axios'

export default function UpdateMembership() {
  const [membershipNumber, setMembershipNumber] = useState('')
  const [extension, setExtension] = useState('6 months')
  const [cancel, setCancel] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    if (!membershipNumber) { setError('Membership number is required'); return }
    setError('')
    try {
      await api.put('/maintenance/membership/update', {
        membership_number: membershipNumber,
        extension: cancel ? null : extension,
        cancel
      })
      setSuccess('Membership updated successfully!')
      setTimeout(() => navigate('/maintenance'), 1500)
    } catch (err) {
      setError(err.response?.data?.detail || 'Update failed')
    }
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2>Update Membership</h2>
        <Link to="/maintenance" className="btn btn-secondary">← Back</Link>
      </div>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Membership Number *</label>
            <input value={membershipNumber} onChange={e => setMembershipNumber(e.target.value)} placeholder="e.g. MEM000001" required />
          </div>
          <div className="form-group">
            <label>Extend Membership By</label>
            <div className="radio-group">
              {['6 months', '1 year', '2 years'].map(d => (
                <label key={d}>
                  <input type="radio" name="ext" value={d} checked={extension === d} onChange={e => setExtension(e.target.value)} disabled={cancel} />
                  {d}
                </label>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input type="checkbox" checked={cancel} onChange={e => setCancel(e.target.checked)} style={{ width: 'auto' }} />
              Cancel / Deactivate Membership
            </label>
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