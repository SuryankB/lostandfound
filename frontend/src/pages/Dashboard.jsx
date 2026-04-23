import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Dashboard() {
  const [items, setItems] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [itemName, setItemName] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('Lost')
  const [location, setLocation] = useState('')
  const [date, setDate] = useState('')
  const [contactInfo, setContactInfo] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const token = localStorage.getItem('token')
  const userId = localStorage.getItem('userId')
  const userName = localStorage.getItem('userName')

  const config = {
    headers: { Authorization: `Bearer ${token}` }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/items`, config)
    setItems(res.data)
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return fetchItems()

    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/items/search?name=${searchQuery}`, config
    )
    setItems(res.data)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const itemData = { itemName, description, type, location, date, contactInfo }

    if (editingId) {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/items/${editingId}`, itemData, config)
      setEditingId(null)
    } else {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/items`, itemData, config)
    }

    clearForm()
    fetchItems()
  }

  const clearForm = () => {
    setItemName('')
    setDescription('')
    setType('Lost')
    setLocation('')
    setDate('')
    setContactInfo('')
    setEditingId(null)
  }

  const handleEdit = (item) => {
    setEditingId(item._id)
    setItemName(item.itemName)
    setDescription(item.description)
    setType(item.type)
    setLocation(item.location)
    setDate(item.date)
    setContactInfo(item.contactInfo)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this item?')) {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/items/${id}`, config)
      fetchItems()
    }
  }

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <div className="bg-light min-vh-100">

      {/* 🔹 NAVBAR */}
      <nav className="navbar navbar-dark bg-dark px-4">
        <h4 className="text-white m-0"> Lost & Found</h4>
        <div>
          <span className="text-white me-3">Hi, {userName}</span>
          <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="container py-4">

        {/* 🔹 FORM */}
        <div className="card shadow-lg mb-4 p-4 rounded-3">
          <h5 className="mb-3">{editingId ? "Edit Item" : "Report Item"}</h5>

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <input className="form-control" placeholder="Item Name"
                  value={itemName} onChange={(e)=>setItemName(e.target.value)} required />
              </div>

              <div className="col-md-6 mb-3">
                <select className="form-select" value={type}
                  onChange={(e)=>setType(e.target.value)}>
                  <option>Lost</option>
                  <option>Found</option>
                </select>
              </div>
            </div>

            <textarea className="form-control mb-3" placeholder="Description"
              value={description} onChange={(e)=>setDescription(e.target.value)} />

            <div className="row">
              <div className="col-md-4 mb-3">
                <input className="form-control" placeholder="Location"
                  value={location} onChange={(e)=>setLocation(e.target.value)} />
              </div>

              <div className="col-md-4 mb-3">
                <input type="date" className="form-control"
                  value={date} onChange={(e)=>setDate(e.target.value)} />
              </div>

              <div className="col-md-4 mb-3">
                <input className="form-control" placeholder="Contact"
                  value={contactInfo} onChange={(e)=>setContactInfo(e.target.value)} />
              </div>
            </div>

            <button className="btn btn-success me-2">
              {editingId ? "Update" : "Submit"}
            </button>

            {editingId && (
              <button type="button" className="btn btn-secondary" onClick={clearForm}>
                Cancel
              </button>
            )}
          </form>
        </div>

        {/* 🔹 SEARCH */}
        <div className="input-group mb-4 shadow-sm">
          <input className="form-control" placeholder="Search items..."
            value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} />
          <button className="btn btn-primary" onClick={handleSearch}>Search</button>
          <button className="btn btn-outline-secondary"
            onClick={()=>{setSearchQuery(''); fetchItems()}}>Clear</button>
        </div>

        {/* 🔹 ITEMS */}
        <div className="row">
          {items.length === 0 && (
            <p className="text-center text-muted">No items found</p>
          )}

          {items.map(item => (
            <div className="col-md-4 mb-4" key={item._id}>
              <div className="card shadow-sm h-100 border-0">

                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <h5>{item.itemName}</h5>
                    <span className={`badge ${item.type === 'Lost' ? 'bg-danger' : 'bg-success'}`}>
                      {item.type}
                    </span>
                  </div>

                  <p className="text-muted">{item.description}</p>

                  <p className="mb-1"><b>📍</b> {item.location}</p>
                  <p className="mb-1"><b>📅</b> {item.date}</p>
                  <p className="mb-1"><b>📞</b> {item.contactInfo}</p>

                  <small className="text-muted">
                    Posted by {item.user?.name || 'Unknown'}
                  </small>

                  {item.user?._id === userId && (
                    <div className="mt-3">
                      <button className="btn btn-warning btn-sm me-2"
                        onClick={()=>handleEdit(item)}>Edit</button>
                      <button className="btn btn-danger btn-sm"
                        onClick={()=>handleDelete(item._id)}>Delete</button>
                    </div>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default Dashboard