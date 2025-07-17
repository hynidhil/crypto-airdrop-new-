import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Airdrops = () => {
  const [airdrops, setAirdrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    chain: 'All',
    difficulty: 'All',
    featured: false
  });

  const chains = ['All', 'Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'StarkNet'];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  useEffect(() => {
    fetchAirdrops();
  }, [filters]);

  const fetchAirdrops = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.chain !== 'All') params.append('chain', filters.chain);
      if (filters.difficulty !== 'All') params.append('difficulty', filters.difficulty);
      if (filters.featured) params.append('featured', 'true');

      const response = await axios.get(`/api/airdrops?${params.toString()}`);
      setAirdrops(response.data.airdrops);
    } catch (error) {
      console.error('Failed to fetch airdrops:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Discover Airdrops</h1>
          <p className="text-xl text-gray-600">
            Find and claim the latest crypto airdrops and testnet opportunities
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Chain</label>
              <select
                value={filters.chain}
                onChange={(e) => handleFilterChange('chain', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                {chains.map(chain => (
                  <option key={chain} value={chain}>{chain}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <select
                value={filters.difficulty}
                onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>{difficulty}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.featured}
                  onChange={(e) => handleFilterChange('featured', e.target.checked)}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Featured Only</span>
              </label>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => setFilters({ chain: 'All', difficulty: 'All', featured: false })}
                className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Airdrops Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading airdrops...</p>
          </div>
        ) : airdrops.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {airdrops.map((airdrop) => (
              <div key={airdrop._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">{airdrop.title}</h3>
                    {airdrop.featured && (
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {airdrop.chain}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      airdrop.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                      airdrop.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {airdrop.difficulty}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">{airdrop.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-green-600 font-medium">{airdrop.reward}</span>
                    <span className="text-sm text-gray-500">{airdrop.participants} participants</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Link
                      to={`/airdrop/${airdrop._id}`}
                      className="flex-1 bg-blue-600 text-white text-center px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                    >
                      View Details
                    </Link>
                    <a
                      href={airdrop.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
                    >
                      Visit
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold mb-2">No airdrops found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your filters or check back later for new opportunities
            </p>
            <button
              onClick={() => setFilters({ chain: 'All', difficulty: 'All', featured: false })}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Airdrops;