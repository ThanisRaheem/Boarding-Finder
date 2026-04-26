import React, { useState, useEffect } from 'react';
import { 
  MapPin, DollarSign, Star, Home, Users, 
  TrendingUp, Brain, Filter, ChevronRight 
} from 'lucide-react';

const SmartRecommendations = ({ userPreferences, onBoardingSelect }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    budgetRange: { min: 0, max: 10000 },
    roomType: 'sharing',
    distance: 5
  });

  useEffect(() => {
    fetchRecommendations();
  }, [filters]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        minBudget: filters.budgetRange.min,
        maxBudget: filters.budgetRange.max,
        roomType: filters.roomType,
        distance: filters.distance
      });
      
      const response = await fetch(`/api/bookings/recommendations?${params}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      const data = await response.json();
      setRecommendations(data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 75) return 'text-blue-600 bg-blue-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Brain className="w-8 h-8 text-purple-600" />
          AI-Powered Recommendations
        </h2>
        <p className="text-gray-600">Personalized boarding suggestions based on your preferences and behavior</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Refine Your Search
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-gray-400" />
              <input
                type="number"
                placeholder="Min"
                value={filters.budgetRange.min}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  budgetRange: { ...prev.budgetRange, min: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.budgetRange.max}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  budgetRange: { ...prev.budgetRange, max: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
            <select
              value={filters.roomType}
              onChange={(e) => setFilters(prev => ({ ...prev, roomType: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="sharing">Sharing</option>
              <option value="single">Single</option>
              <option value="both">Both</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Distance from Campus</label>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <input
                type="number"
                value={filters.distance}
                onChange={(e) => setFilters(prev => ({ ...prev, distance: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <span className="text-gray-500">km</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((boarding, index) => (
          <div key={boarding.boardingId} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            {/* AI Score Badge */}
            <div className="absolute top-4 right-4 z-10">
              <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(boarding.score)}`}>
                {boarding.score}% Match
              </div>
            </div>
            
            {/* Image */}
            <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-600">
              <img 
                src={boarding.image || '/api/placeholder/400/300'} 
                alt={boarding.title}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-bold">{boarding.title}</h3>
                <div className="flex items-center gap-1 text-sm">
                  <MapPin className="w-4 h-4" />
                  {boarding.distance}km from campus
                </div>
              </div>
            </div>
            
            <div className="p-6">
              {/* Key Info */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">${boarding.price}/month</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium">{boarding.rating || '4.5'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">{boarding.roomType}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium">{boarding.available} spots</span>
                </div>
              </div>
              
              {/* AI Reasons */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Why this matches:</h4>
                <div className="flex flex-wrap gap-1">
                  {boarding.reasons?.map((reason, idx) => (
                    <span key={idx} className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                      {reason}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Match Score Breakdown */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Match Score</span>
                  <span className="text-sm font-bold text-blue-600">{boarding.matchScore}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                    style={{ width: `${boarding.matchScore}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Action Button */}
              <button
                onClick={() => onBoardingSelect(boarding)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors flex items-center justify-center gap-2"
              >
                View Details
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {recommendations.length === 0 && (
        <div className="text-center py-12">
          <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No recommendations found</h3>
          <p className="text-gray-600">Try adjusting your filters to see more options</p>
        </div>
      )}

      {/* AI Insights Section */}
      <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          AI Insights
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">Your Preferences</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Budget-conscious choices</li>
              <li>• Prefer sharing rooms</li>
              <li>• Close to campus priority</li>
            </ul>
          </div>
          
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">Market Trends</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Prices up 5% this month</li>
              <li>• High demand for sharing</li>
              <li>• Campus area popular</li>
            </ul>
          </div>
          
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">Recommendation Tips</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Book early for best rates</li>
              <li>• Consider nearby areas</li>
              <li>• Check reviews carefully</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartRecommendations;
