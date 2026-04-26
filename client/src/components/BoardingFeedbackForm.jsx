import React, { useState } from 'react';
import { 
  Star, MessageSquare, Camera, Shield, Upload, 
  Send, Eye, EyeOff, ThumbsUp, MapPin 
} from 'lucide-react';

const BoardingFeedbackForm = ({ boarding, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    rating: 5,
    comment: '',
    isAnonymous: false,
    verifiedStay: false,
    wouldRecommend: null,
    categories: [],
    starRatings: {
      cleanliness: 5,
      staff: 5,
      facilities: 5,
      location: 5,
      value: 5,
      safety: 5
    }
  });

  const [photos, setPhotos] = useState([]);
  const [hoveredStar, setHoveredStar] = useState(0);

  const categoryOptions = [
    { value: 'cleanliness', label: 'Cleanliness', icon: '🧹' },
    { value: 'staff', label: 'Staff', icon: '👥' },
    { value: 'facilities', label: 'Facilities', icon: '🏢' },
    { value: 'location', label: 'Location', icon: '📍' },
    { value: 'value', label: 'Value for Money', icon: '💰' },
    { value: 'safety', label: 'Safety', icon: '🔒' },
    { value: 'noise', label: 'Noise Level', icon: '🔊' },
    { value: 'other', label: 'Other', icon: '📝' }
  ];

  const handleStarRating = (category, rating) => {
    setFormData(prev => ({
      ...prev,
      starRatings: {
        ...prev.starRatings,
        [category]: rating
      }
    }));
  };

  const handleOverallRating = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleCategoryToggle = (category) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      boardingId: boarding.id,
      boardingTitle: boarding.title
    });
  };

  const StarRating = ({ category, rating, onRate, size = 'medium' }) => {
    const starSize = size === 'small' ? 'w-4 h-4' : size === 'large' ? 'w-6 h-6' : 'w-5 h-5';
    
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRate(category, star)}
            onMouseEnter={() => setHoveredStar(star)}
            onMouseLeave={() => setHoveredStar(0)}
            className={`${starSize} transition-colors ${
              star <= (hoveredStar || rating)
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          >
            <Star />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">{rating}/5</span>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Share Your Experience</h2>
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{boarding.title}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Overall Rating */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Overall Rating
          </h3>
          <div className="flex justify-center">
            <StarRating
              category="overall"
              rating={formData.rating}
              onRate={(cat, rating) => handleOverallRating(rating)}
              size="large"
            />
          </div>
        </div>

        {/* Detailed Star Ratings */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Rate Specific Aspects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categoryOptions.slice(0, 6).map((category) => (
              <div key={category.value} className="flex items-center justify-between">
                <span className="text-sm font-medium flex items-center gap-2">
                  <span>{category.icon}</span>
                  {category.label}
                </span>
                <StarRating
                  category={category.value}
                  rating={formData.starRatings[category.value]}
                  onRate={handleStarRating}
                  size="small"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Your Review
          </label>
          <textarea
            value={formData.comment}
            onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
            rows={4}
            placeholder="Share your experience at this boarding..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.comment.length}/2000 characters
          </p>
        </div>

        {/* Categories */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categories (select all that apply)
          </label>
          <div className="flex flex-wrap gap-2">
            {categoryOptions.map((category) => (
              <button
                key={category.value}
                type="button"
                onClick={() => handleCategoryToggle(category.value)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  formData.categories.includes(category.value)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category.icon} {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Additional Options */}
        <div className="space-y-4">
          {/* Anonymous Option */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium">Post Anonymously</p>
                <p className="text-sm text-gray-600">Your identity will be hidden</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, isAnonymous: !prev.isAnonymous }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                formData.isAnonymous ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.isAnonymous ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Verified Stay */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium">Verified Stay</p>
                <p className="text-sm text-gray-600">I actually stayed here</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, verifiedStay: !prev.verifiedStay }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                formData.verifiedStay ? 'bg-green-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.verifiedStay ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Would Recommend */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="font-medium mb-3">Would you recommend this boarding?</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, wouldRecommend: true }))}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  formData.wouldRecommend === true
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                👍 Yes
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, wouldRecommend: false }))}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  formData.wouldRecommend === false
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                👎 No
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, wouldRecommend: null }))}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  formData.wouldRecommend === null
                    ? 'bg-gray-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                🤷 Maybe
              </button>
            </div>
          </div>
        </div>

        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Camera className="w-4 h-4" />
            Add Photos (optional)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setPhotos(Array.from(e.target.files))}
              className="hidden"
              id="photo-upload"
            />
            <label htmlFor="photo-upload" className="cursor-pointer">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Click to upload photos</p>
              <p className="text-xs text-gray-500">PNG, JPG up to 5MB each</p>
            </label>
            {photos.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`Upload ${index + 1}`}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => setPhotos(prev => prev.filter((_, i) => i !== index))}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading || !formData.comment.trim()}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit Review
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BoardingFeedbackForm;
