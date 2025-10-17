import React from 'react'
import ExpenseManager from './components/ExpenseManager'

export default function App() {
  return (
    <div style={{ padding: 20, fontFamily: 'Inter, Arial, sans-serif' }}>
      <h1>Expense Tracker</h1>
      <ExpenseManager />
    </div>
  )
}
