import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [featuredAirdrops, setFeaturedAirdrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState('Testing...');

  useEffect(() => {
    fetchFeaturedAirdrops();
    testApiConnection();
  }, []);

  const fetchFeaturedAirdrops = async () => {
    try {
      const response = await axios.get('/api/airdrops?featured=true&limit=3');
      setFeaturedAirdrops(response.data.airdrops);
    } catch (error) {
      console.error('Failed to fetch featured airdrops:', error);
    } finally {
      setLoading(false);
    }
  };

  const testApiConnection = async () => {
    try {
      const response = await axios.get('/api/health');
      setApiStatus(`✅ ${response.data.message}`);
    } catch (error) {
      setApiStatus(`❌ API Connection Failed: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Claim smarter. <span className="text-gradient">Earn faster.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover the latest crypto airdrops and testnet opportunities. 
            Join thousands of users claiming rewards daily.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/airdrops"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Explore Airdrops
            </Link>
            <Link
              to="/community"
              className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Join Community
            </Link>
          </div>
        </div>

        {/* API Status */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-12">
          <h3 className="text-2xl font-bold mb-4">🔗 MERN Stack API Status</h3>
          <div className="mb-4">
            <p className="text-lg font-medium">Backend Connection:</p>
            <p className={`text-sm ${apiStatus.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
              {apiStatus}
            </p>
          </div>
          <div className="grid gap-4 text-sm">
            <div className="flex justify-between">
              <span>Database:</span>
              <span className="font-medium">MongoDB</span>
            </div>
            <div className="flex justify-between">
              <span>Backend:</span>
              <span className="font-medium">Express.js + Node.js</span>
            </div>
            <div className="flex justify-between">
              <span>Frontend:</span>
              <span className="font-medium">React.js</span>
            </div>
          </div>
        </div>

        {/* Featured Airdrops */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Featured Airdrops</h2>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading featured airdrops...</p>
            </div>
          ) : featuredAirdrops.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {featuredAirdrops.map((airdrop) => (
                <div key={airdrop._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">{airdrop.title}</h3>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {airdrop.chain}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-3">{airdrop.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-green-600 font-medium">{airdrop.reward}</span>
                    <Link
                      to={`/airdrop/${airdrop._id}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No featured airdrops available at the moment.</p>
              <Link
                to="/airdrops"
                className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Browse All Airdrops
              </Link>
            </div>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-blue-600 text-2xl">🎯</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Verified Airdrops</h3>
            <p className="text-gray-600">All airdrops are carefully vetted and verified by our team.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-purple-600 text-2xl">⚡</span>
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
      </div>
    </div>
  );
};

export default Home;