import React, { useEffect, useState } from 'react'
import axios from 'axios'
import config from './config'

const API = `${config.url}/api/expenses`

// Expense fields: id, title, amount (number), category, date (ISO), note
export default function ExpenseManager() {
  const [expenses, setExpenses] = useState([])
  const [form, setForm] = useState({
    id: '',
    title: '',
    amount: '',
    category: '',
    date: '',
    note: ''
  })
  const [editing, setEditing] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchAll()
    // eslint-disable-next-line
  }, [])

  async function fetchAll() {
    try {
      const res = await axios.get(API)
      setExpenses(res.data || [])
      setMessage('')
    } catch (e) {
      console.error('fetchAll error', e)
      setMessage('Failed to fetch expenses.')
    }
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function validate() {
    if (!form.title || form.title.trim() === '') {
      setMessage('Title required.')
      return false
    }
    if (!form.amount || isNaN(Number(form.amount))) {
      setMessage('Amount must be a number.')
      return false
    }
    return true
  }

  async function createExpense() {
    if (!validate()) return
    try {
      const payload = {
        title: form.title,
        amount: Number(form.amount),
        category: form.category,
        date: form.date || new Date().toISOString().split('T')[0],
        note: form.note
      }
      await axios.post(API, payload)
      setMessage('Expense created.')
      fetchAll()
      reset()
    } catch (err) {
      console.error('create error', err)
      setMessage('Error creating expense.')
    }
  }

  async function updateExpense() {
    if (!validate()) return
    if (!form.id) { setMessage('No expense selected to update.'); return }
    try {
      const payload = {
        title: form.title,
        amount: Number(form.amount),
        category: form.category,
        date: form.date,
        note: form.note
      }
      await axios.put(`${API}/${form.id}`, payload)
      setMessage('Expense updated.')
      fetchAll()
      reset()
    } catch (err) {
      console.error('update error', err)
      setMessage('Error updating expense.')
    }
  }

  async function deleteExpense(id) {
    try {
      await axios.delete(`${API}/${id}`)
      setMessage('Expense deleted.')
      fetchAll()
    } catch (err) {
      console.error('delete error', err)
      setMessage('Error deleting expense.')
    }
  }

  function editExpense(eObj) {
    setForm({
      id: eObj.id,
      title: eObj.title,
      amount: String(eObj.amount),
      category: eObj.category || '',
      date: eObj.date ? eObj.date.split('T')[0] : '',
      note: eObj.note || ''
    })
    setEditing(true)
    setMessage('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function reset() {
    setForm({ id: '', title: '', amount: '', category: '', date: '', note: '' })
    setEditing(false)
    setMessage('')
  }

  const total = expenses.reduce((s, e) => s + (Number(e.amount) || 0), 0)

  return (
    <div className="todo-container">
      {message && (
        <div className={`message-banner ${message.toLowerCase().includes('error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>{editing ? 'Edit Expense' : 'Add Expense'}</h2>
        <div style={{ fontSize: 14, color: '#0b3b66' }}>
          Total: <strong>₹{total.toFixed(2)}</strong>
        </div>
      </div>

      <div className="form-grid">
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} />
        <input name="amount" placeholder="Amount" value={form.amount} onChange={handleChange} inputMode="decimal" />
        <input name="category" placeholder="Category (e.g., Food, Transport)" value={form.category} onChange={handleChange} />
        <input name="date" type="date" value={form.date} onChange={handleChange} />
        <input name="note" placeholder="Note (optional)" value={form.note} onChange={handleChange} />
      </div>

      <div className="btn-group">
        {!editing ? (
          <button className="btn-blue" onClick={createExpense}>Add Expense</button>
        ) : (
          <>
            <button className="btn-green" onClick={updateExpense}>Update</button>
            <button className="btn-gray" onClick={reset}>Cancel</button>
          </>
        )}
      </div>

      <h3 style={{ marginTop: 20 }}>Expenses</h3>

      {expenses.length === 0 ? (
        <p>No expenses found.</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th style={{ width: 60 }}>ID</th>
                <th>Title</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Date</th>
                <th>Note</th>
                <th style={{ width: 160 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((e) => (
                <tr key={e.id}>
                  <td>{e.id}</td>
                  <td>{e.title}</td>
                  <td>₹{Number(e.amount).toFixed(2)}</td>
                  <td>{e.category ?? ''}</td>
                  <td>{e.date ? e.date.split('T')[0] : ''}</td>
                  <td>{e.note ?? ''}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-green" onClick={() => editExpense(e)}>Edit</button>
                      <button className="btn-red" onClick={() => deleteExpense(e.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
