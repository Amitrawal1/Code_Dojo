import React from 'react'
import QuestionList from './QuestionList'

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
      
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
        <h2 className="text-2xl font-bold text-purple-400 mb-6">Data Structures & Algorithms</h2>
        <QuestionList />
      </div>
    </div>
  )
}