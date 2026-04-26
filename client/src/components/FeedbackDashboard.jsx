import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, TrendingDown, MessageSquare, Star, AlertCircle, 
  Filter, Download, Calendar, Eye, ThumbsUp, Users 
} from 'lucide-react';

const FeedbackDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [feedbackList, setFeedbackList] = useState([]);
  const [filters, setFilters] = useState({
    sentiment: '',
    category: '',
    dateRange: '7d'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
    fetchFeedback();
  }, [filters]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/dashboard/feedback-stats', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeedback = async () => {
    try {
      const params = new URLSearchParams(filters);
      const response = await fetch(`/api/feedback/home?${params}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setFeedbackList(data);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    }
  };

  const sentimentColors = {
    positive: '#10b981',
    neutral: '#f59e0b',
    negative: '#ef4444'
  };

  const categoryColors = [
    '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', 
    '#10b981', '#06b6d4', '#f97316', '#6b7280'
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Feedback Analytics Dashboard</h1>
          <p className="text-gray-600">Real-time insights and sentiment analysis</p>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            
            <select
              value={filters.sentiment}
              onChange={(e) => setFilters(prev => ({ ...prev, sentiment: e.target.value }))}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">All Sentiments</option>
              <option value="positive">Positive</option>
              <option value="neutral">Neutral</option>
              <option value="negative">Negative</option>
            </select>

            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">All Categories</option>
              <option value="cleanliness">Cleanliness</option>
              <option value="staff">Staff</option>
              <option value="facilities">Facilities</option>
              <option value="location">Location</option>
              <option value="value">Value</option>
              <option value="safety">Safety</option>
            </select>

            <select
              value={filters.dateRange}
              onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>

            <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
              <Download className="w-4 h-4 inline mr-1" />
              Export
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Feedback</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.totalFeedback}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Average Rating</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.avgRating?.toFixed(1) || '0.0'}</p>
                </div>
                <Star className="w-8 h-8 text-yellow-500" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Positive Feedback</p>
                  <p className="text-2xl font-bold text-green-600">{analytics.positiveCount}</p>
                  <p className="text-xs text-gray-500">
                    {analytics.totalFeedback > 0 ? 
                      `${((analytics.positiveCount / analytics.totalFeedback) * 100).toFixed(1)}%` : '0%'
                    }
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Negative Feedback</p>
                  <p className="text-2xl font-bold text-red-600">{analytics.negativeCount}</p>
                  <p className="text-xs text-gray-500">
                    {analytics.totalFeedback > 0 ? 
                      `${((analytics.negativeCount / analytics.totalFeedback) * 100).toFixed(1)}%` : '0%'
                    }
                  </p>
                </div>
                <TrendingDown className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Sentiment Distribution */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Sentiment Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Positive', value: analytics?.positiveCount || 0, color: '#10b981' },
                    { name: 'Neutral', value: analytics?.neutralCount || 0, color: '#f59e0b' },
                    { name: 'Negative', value: analytics?.negativeCount || 0, color: '#ef4444' }
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {[
                    { name: 'Positive', value: analytics?.positiveCount || 0, color: '#10b981' },
                    { name: 'Neutral', value: analytics?.neutralCount || 0, color: '#f59e0b' },
                    { name: 'Negative', value: analytics?.negativeCount || 0, color: '#ef4444' }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Feedback by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics?.categoryStats || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Feedback */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Recent Feedback</h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {feedbackList.map((feedback) => (
              <div key={feedback._id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < feedback.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        feedback.sentiment === 'positive' ? 'bg-green-100 text-green-700' :
                        feedback.sentiment === 'negative' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {feedback.sentiment}
                      </span>
                      
                      {feedback.categories?.map((category, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                          {category}
                        </span>
                      ))}
                      
                      {feedback.isAnonymous && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                          Anonymous
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-900 mb-2">{feedback.comment}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {feedback.user?.name || 'Anonymous'}
                      </span>
                      
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(feedback.createdAt).toLocaleDateString()}
                      </span>
                      
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-4 h-4" />
                        {feedback.helpfulCount} helpful
                      </span>
                    </div>
                    
                    {feedback.photos && feedback.photos.length > 0 && (
                      <div className="flex gap-2 mt-3">
                        {feedback.photos.map((photo, idx) => (
                          <img
                            key={idx}
                            src={photo}
                            alt={`Feedback photo ${idx + 1}`}
                            className="w-16 h-16 object-cover rounded cursor-pointer hover:opacity-80"
                            onClick={() => window.open(photo, '_blank')}
                          />
                        ))}
                      </div>
                    )}
                    
                    {feedback.responses && feedback.responses.length > 0 && (
                      <div className="mt-3 pl-4 border-l-2 border-blue-200">
                        {feedback.responses.map((response, idx) => (
                          <div key={idx} className="mb-2">
                            <p className="text-sm font-medium text-blue-600">
                              {response.user?.name} responded:
                            </p>
                            <p className="text-sm text-gray-700">{response.message}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-green-600">
                      <ThumbsUp className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackDashboard;
