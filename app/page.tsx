'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Home() {
  const [connectionStatus, setConnectionStatus] = useState<string>('Testing...')
  const [testData, setTestData] = useState<any[]>([])

  useEffect(() => {
    testSupabaseConnection()
  }, [])

  const testSupabaseConnection = async () => {
    try {
      // Test Supabase connection with a simple query
      const { data, error } = await supabase
        .from('airdrops')
        .select('*')
        .limit(3)

      if (error) {
        setConnectionStatus(`Connection Error: ${error.message}`)
      } else {
        setConnectionStatus('✅ Connected to Supabase successfully!')
        setTestData(data || [])
      }
    } catch (err) {
      setConnectionStatus(`Connection Failed: ${err}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <h1 className="text-2xl font-bold text-gradient">Claimex</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-600 hover:text-primary transition-colors">Home</a>
              <a href="#" className="text-gray-600 hover:text-primary transition-colors">Airdrops</a>
              <a href="#" className="text-gray-600 hover:text-primary transition-colors">Community</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Claim smarter. <span className="text-gradient">Earn faster.</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover the latest crypto airdrops and testnet opportunities. 
            Join thousands of users claiming rewards daily.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors">
              Explore Airdrops
            </button>
            <button className="border border-primary text-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors">
              Learn More
            </button>
          </div>
        </div>

        {/* Supabase Connection Test */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-2xl font-bold mb-4">🔗 Supabase Connection Test</h3>
          <div className="mb-4">
            <p className="text-lg font-medium">Status:</p>
            <p className={`text-sm ${connectionStatus.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
              {connectionStatus}
            </p>
          </div>
          
          {testData.length > 0 && (
            <div>
              <p className="text-lg font-medium mb-2">Sample Data from Airdrops Table:</p>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {testData.map((item, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-primary">{item.title || 'No Title'}</h4>
                    <p className="text-sm text-gray-600">{item.chain || 'No Chain'}</p>
                    <p className="text-sm text-gray-500">{item.reward || 'No Reward'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-primary text-2xl">🎯</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Verified Airdrops</h3>
            <p className="text-gray-600">All airdrops are carefully vetted and verified by our team.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-accent text-2xl">⚡</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Real-time Updates</h3>
            <p className="text-gray-600">Get instant notifications about new airdrops and deadlines.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-green-600 text-2xl">📈</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Higher Success Rate</h3>
            <p className="text-gray-600">Our detailed guides help you maximize your airdrop success.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 Claimex. Built with Next.js 14, Tailwind CSS, and Supabase.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}