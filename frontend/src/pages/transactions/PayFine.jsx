import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'

export default function PayFine() {
  const { state } = useLocation()
  const preview = state?.preview
  const { user } = useAuth()
  const navigate = useNavigate()
  const [finePaid, setFinePaid] = useState(false)
  const [remarks, setRemarks] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  if (!preview) {
    return (
      <div className="container">
        <div className="card">
          <p>No return data found. Please go back and process a return first.</p>
          <button className="btn btn-secondary" onClick={() => navigate('/transactions/return')} style={{ marginTop: '12px' }}>
            Go to Return Book
          </button>
        </div>
      </div>
    )
  }

  async function handleConfirm() {
    if (preview.fine_calculated > 0 && !finePaid) {
      setError('Please check the Fine Paid checkbox before confirming.')
      return
    }
    setError('')
    try {
      await api.post('/transactions/pay-fine', {
        issue_id: preview.issue_id,
        fine_paid: finePaid,
        remarks
      })
      setSuccess('Return completed successfully!')
      setTimeout(() => navigate(user?.isAdmin ? '/admin' : '/home'), 1500)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to complete return')
    }
  }

  return (
    <div className="container">
      <h2>Pay Fine</h2>
      <div className="card">
        <table style={{ marginBottom: '20px' }}>
          <tbody>
            <tr><td><strong>Book Name</strong></td><td>{preview.item_name}</td></tr>
            <tr><td><strong>Author</strong></td><td>{preview.author_name}</td></tr>
            <tr><td><strong>Serial No</strong></td><td>{preview.serial_no}</td></tr>
            <tr><td><strong>Issue Date</strong></td><td>{preview.issue_date}</td></tr>
            <tr><td><strong>Expected Return</strong></td><td>{preview.expected_return_date}</td></tr>
            <tr><td><strong>Actual Return</strong></td><td>{preview.actual_return_date}</td></tr>
            <tr>
              <td><strong>Fine Calculated</strong></td>
              <td style={{ color: preview.fine_calculated > 0 ? '#e74c3c' : '#27ae60', fontWeight: 700 }}>
                ₹{preview.fine_calculated}
              </td>
            </tr>
          </tbody>
        </table>

        {preview.fine_calculated > 0 && (
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input type="checkbox" checked={finePaid} onChange={e => setFinePaid(e.target.checked)} style={{ width: 'auto' }} />
              Fine Paid (₹{preview.fine_calculated})
            </label>
          </div>
        )}

        <div className="form-group">
          <label>Remarks</label>
          <textarea value={remarks} onChange={e => setRemarks(e.target.value)} rows={3} />
        </div>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <div className="btn-group">
          <button className="btn btn-success" onClick={handleConfirm}>Confirm Return</button>
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>Back</button>
        </div>
      </div>
    </div>
  )
}