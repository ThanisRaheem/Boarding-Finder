import React, { useState, useEffect } from 'react';
import { 
  Star, MessageSquare, Camera, ThumbsUp, Filter, 
  Calendar, User, Shield, Eye, MoreHorizontal 
} from 'lucide-react';

const BoardingFeedbackList = ({ boardingId }) => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    rating: '',
    page: 1
  });
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0
  });

  useEffect(() => {
    fetchFeedback();
  }, [boardingId, filters]);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: filters.page,
        ...(filters.rating && { rating: filters.rating })
      });
      
      const response = await fetch(`/api/feedback/boarding/${boardingId}?${params}`);
      const data = await response.json();
      
      setFeedback(data.feedback || []);
      setStats({
        averageRating: data.averageRating || 0,
        totalReviews: data.totalReviews || 0
      });
    } catch (error) {
      console.error('Error fetching feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleHelpful = async (feedbackId) => {
    try {
      await fetch(`/api/feedback/${feedbackId}/helpful`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      setFeedback(prev => prev.map(f => 
        f._id === feedbackId 
          ? { ...f, helpfulCount: f.helpfulCount + 1 }
          : f
      ));
    } catch (error) {
      console.error('Error marking helpful:', error);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">{rating}</span>
      </div>
    );
  };

  const renderDetailedStars = (starRatings) => {
    if (!starRatings || Object.keys(starRatings).length === 0) return null;
    
    const categories = {
      cleanliness: { label: 'Cleanliness', icon: '🧹' },
      staff: { label: 'Staff', icon: '👥' },
      facilities: { label: 'Facilities', icon: '🏢' },
      location: { label: 'Location', icon: '📍' },
      value: { label: 'Value', icon: '💰' },
      safety: { label: 'Safety', icon: '🔒' }
    };

    return (
      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm font-medium text-gray-700 mb-2">Detailed Ratings:</p>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(categories).map(([key, { label, icon }]) => {
            const rating = starRatings[key];
            if (!rating) return null;
            
            return (
              <div key={key} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1">
                  <span>{icon}</span>
                  {label}
                </span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3 h-3 ${
                        star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header with Stats */}
      <div className="mb-6 p-6 bg-white rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Guest Reviews</h2>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">
                {stats.averageRating.toFixed(1)}
              </div>
              <div className="flex items-center gap-1">
                {renderStars(Math.round(stats.averageRating))}
              </div>
              <div className="text-sm text-gray-600">
                {stats.totalReviews} reviews
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium">Filter by rating:</span>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => setFilters(prev => ({ 
                  ...prev, 
                  rating: prev.rating === rating.toString() ? '' : rating.toString() 
                }))}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  filters.rating === rating.toString()
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {rating} ⭐
              </button>
            ))}
            <button
              onClick={() => setFilters(prev => ({ ...prev, rating: '' }))}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                !filters.rating
                  ? 'bg-gray-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </button>
          </div>
        </div>
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {feedback.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews yet</h3>
            <p className="text-gray-600">Be the first to share your experience!</p>
          </div>
        ) : (
          feedback.map((review) => (
            <div key={review._id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center">
                    {review.isAnonymous ? (
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <Shield className="w-5 h-5 text-gray-600" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                          {review.user?.name?.charAt(0).toUpperCase() || 'A'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">
                        {review.isAnonymous ? 'Anonymous' : review.user?.name}
                      </p>
                      {review.verifiedStay && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          ✓ Verified Stay
                        </span>
                      )}
                      {review.isAnonymous && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                          <EyeOff className="w-3 h-3 inline mr-1" />
                          Anonymous
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {renderStars(review.rating)}
                </div>
              </div>

              {/* Comment */}
              <p className="text-gray-900 mb-4">{review.comment}</p>

              {/* Detailed Star Ratings */}
              {renderDetailedStars(review.starRatings)}

              {/* Categories */}
              {review.categories && review.categories.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {review.categories.map((category, idx) => (
                      <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Would Recommend */}
              {review.wouldRecommend !== null && (
                <div className="mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    review.wouldRecommend 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {review.wouldRecommend ? '👍 Would recommend' : '👎 Would not recommend'}
                  </span>
                </div>
              )}

              {/* Photos */}
              {review.photos && review.photos.length > 0 && (
                <div className="mb-4">
                  <div className="flex gap-2">
                    {review.photos.map((photo, idx) => (
                      <img
                        key={idx}
                        src={photo}
                        alt={`Review photo ${idx + 1}`}
                        className="w-20 h-20 object-cover rounded cursor-pointer hover:opacity-80"
                        onClick={() => window.open(photo, '_blank')}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Responses */}
              {review.responses && review.responses.length > 0 && (
                <div className="mb-4 pl-4 border-l-2 border-blue-200">
                  {review.responses.map((response, idx) => (
                    <div key={idx} className="mb-3">
                      <p className="text-sm font-medium text-blue-600 mb-1">
                        {response.user?.name} (Owner) responded:
                      </p>
                      <p className="text-sm text-gray-700">{response.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(response.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleHelpful(review._id)}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    Helpful ({review.helpfulCount})
                  </button>
                  <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    <MessageSquare className="w-4 h-4" />
                    Reply
                  </button>
                </div>
                
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Load More */}
      {feedback.length > 0 && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Load More Reviews
          </button>
        </div>
      )}
    </div>
  );
};

export default BoardingFeedbackList;
