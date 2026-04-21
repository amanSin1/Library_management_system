import { useState } from 'react'
import api from '../../api/axios'

export default function BookAvailability() {
  const [form, setForm] = useState({ name: '', author: '' })
  const [results, setResults] = useState([])
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState('')

  async function handleSearch(e) {
    e.preventDefault()
    if (!form.name && !form.author) {
      setError('Please enter a book name or author to search')
      return
    }
    setError('')
    try {
      const res = await api.get('/books/search', { params: { name: form.name, author: form.author } })
      setResults(res.data)
      setSearched(true)
    } catch {
      setError('Search failed')
    }
  }

  return (
    <div className="container">
      <h2>Book Availability</h2>
      <div className="card">
        <form onSubmit={handleSearch}>
          <div className="form-group">
            <label>Book Name</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Enter book name" />
          </div>
          <div className="form-group">
            <label>Author Name</label>
            <input value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} placeholder="Enter author name" />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="btn btn-primary">Search</button>
        </form>
      </div>

      {searched && (
        <div className="card">
          <h3>Search Results</h3>
          {results.length === 0 ? (
            <p>No books found.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Serial No</th>
                  <th>Book Name</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Available</th>
                </tr>
              </thead>
              <tbody>
                {results.map(r => (
                  <tr key={r.id}>
                    <td>{r.serial_no}</td>
                    <td>{r.name}</td>
                    <td>{r.author_name}</td>
                    <td>{r.category}</td>
                    <td>{r.item_type}</td>
                    <td>
                      <span className={`badge ${r.available ? 'badge-green' : 'badge-red'}`}>
                        {r.available ? 'Yes' : 'No'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}