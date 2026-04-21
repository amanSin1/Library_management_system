import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'

export default function UserManagement() {
  const [tab, setTab] = useState('new')
  const [users, setUsers] = useState([])
  const [newUser, setNewUser] = useState({ name: '', username: '', password: '', is_active: true, is_admin: false })
  const [updateUser, setUpdateUser] = useState({ username: '', name: '', is_active: true, is_admin: false })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => { api.get('/maintenance/users').then(r => setUsers(r.data)) }, [])

  async function handleAdd(e) {
    e.preventDefault()
    setError(''); setSuccess('')
    try {
      await api.post('/maintenance/user/add', newUser)
      setSuccess('User created successfully!')
      const res = await api.get('/maintenance/users')
      setUsers(res.data)
      setNewUser({ name: '', username: '', password: '', is_active: true, is_admin: false })
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create user')
    }
  }

  async function handleUpdate(e) {
    e.preventDefault()
    setError(''); setSuccess('')
    try {
      await api.put('/maintenance/user/update', updateUser)
      setSuccess('User updated successfully!')
      const res = await api.get('/maintenance/users')
      setUsers(res.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update user')
    }
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2>User Management</h2>
        <Link to="/maintenance" className="btn btn-secondary">← Back</Link>
      </div>

      <div className="card" style={{ marginBottom: '16px' }}>
        <div className="radio-group" style={{ marginBottom: '20px' }}>
          <label>
            <input type="radio" checked={tab === 'new'} onChange={() => setTab('new')} style={{ width: 'auto' }} />
            New User
          </label>
          <label>
            <input type="radio" checked={tab === 'existing'} onChange={() => setTab('existing')} style={{ width: 'auto' }} />
            Existing User
          </label>
        </div>

        {tab === 'new' ? (
          <form onSubmit={handleAdd}>
            <div className="form-group">
              <label>Name *</label>
              <input value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Username *</label>
              <input value={newUser.username} onChange={e => setNewUser({ ...newUser, username: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Password *</label>
              <input type="password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} required />
            </div>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="checkbox" checked={newUser.is_active} onChange={e => setNewUser({ ...newUser, is_active: e.target.checked })} style={{ width: 'auto' }} />
                Active
              </label>
            </div>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="checkbox" checked={newUser.is_admin} onChange={e => setNewUser({ ...newUser, is_admin: e.target.checked })} style={{ width: 'auto' }} />
                Admin
              </label>
            </div>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            <button type="submit" className="btn btn-primary">Create User</button>
          </form>
        ) : (
          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <label>Username *</label>
              <select value={updateUser.username} onChange={e => {
                const u = users.find(x => x.username === e.target.value)
                if (u) setUpdateUser({ username: u.username, name: u.name, is_active: u.is_active, is_admin: u.is_admin })
              }} required>
                <option value="">-- Select User --</option>
                {users.map(u => <option key={u.id} value={u.username}>{u.username} ({u.name})</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Name</label>
              <input value={updateUser.name} onChange={e => setUpdateUser({ ...updateUser, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="checkbox" checked={updateUser.is_active} onChange={e => setUpdateUser({ ...updateUser, is_active: e.target.checked })} style={{ width: 'auto' }} />
                Active
              </label>
            </div>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="checkbox" checked={updateUser.is_admin} onChange={e => setUpdateUser({ ...updateUser, is_admin: e.target.checked })} style={{ width: 'auto' }} />
                Admin
              </label>
            </div>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            <button type="submit" className="btn btn-primary">Update User</button>
          </form>
        )}
      </div>

      <div className="card">
        <h3>All Users</h3>
        <table>
          <thead>
            <tr><th>Name</th><th>Username</th><th>Active</th><th>Admin</th></tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.name}</td><td>{u.username}</td>
                <td><span className={`badge ${u.is_active ? 'badge-green' : 'badge-red'}`}>{u.is_active ? 'Yes' : 'No'}</span></td>
                <td><span className={`badge ${u.is_admin ? 'badge-yellow' : 'badge-green'}`}>{u.is_admin ? 'Admin' : 'User'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}