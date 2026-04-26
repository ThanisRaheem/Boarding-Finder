import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import BoardingFeedbackForm from '../components/BoardingFeedbackForm';
import BoardingFeedbackList from '../components/BoardingFeedbackList';
import { Star, MessageSquare, Plus } from 'lucide-react';

const BoardingDetailPage = () => {
  const { boardingId } = useParams();
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [activeTab, setActiveTab] = useState('reviews');
  
  // Mock boarding data - in real app, this would come from API
  const boarding = {
    id: boardingId,
    title: 'Campus Heights Hostel',
    description: 'Modern boarding house near campus with excellent facilities',
    price: 8000,
    rating: 4.5,
    reviews: 23
  };

  const handleFeedbackSubmit = async (feedbackData) => {
    try {
      const formData = new FormData();
      
      // Add all feedback data
      Object.keys(feedbackData).forEach(key => {
        if (key === 'starRatings') {
          formData.append(key, JSON.stringify(feedbackData[key]));
        } else {
          formData.append(key, feedbackData[key]);
        }
      });

      // Add photos if any
      // In the actual component, photos would be handled separately
      
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData
      });

      if (response.ok) {
        setShowFeedbackForm(false);
        // Refresh feedback list
        window.location.reload();
      } else {
        console.error('Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Boarding Header */}
      <div className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{boarding.title}</h1>
              <p className="text-gray-600 mb-4">{boarding.description}</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-semibold">{boarding.rating}</span>
                  <span className="text-gray-600">({boarding.reviews} reviews)</span>
                </div>
                <div className="text-lg font-bold text-blue-600">
                  ${boarding.price}/month
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setShowFeedbackForm(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Write Review
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-6 mt-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'reviews'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Reviews
              </div>
            </button>
            <button
              onClick={() => setActiveTab('info')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'info'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Information
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'contact'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Contact
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {activeTab === 'reviews' && (
          <div>
            {showFeedbackForm ? (
              <BoardingFeedbackForm
                boarding={boarding}
                onSubmit={handleFeedbackSubmit}
                loading={false}
              />
            ) : (
              <BoardingFeedbackList boardingId={boardingId} />
            )}
          </div>
        )}
        
        {activeTab === 'info' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Boarding Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Facilities</h3>
                <ul className="space-y-1 text-gray-600">
                  <li>• Free WiFi</li>
                  <li>• Study Rooms</li>
                  <li>• Kitchen Access</li>
                  <li>• Laundry Service</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Rules</h3>
                <ul className="space-y-1 text-gray-600">
                  <li>• No smoking indoors</li>
                  <li>• Quiet hours after 10 PM</li>
                  <li>• Visitors must register</li>
                  <li>• Monthly rent due on 1st</li>
                </ul>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'contact' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div>
                <p className="font-semibold">Phone:</p>
                <p className="text-gray-600">077-123-4567</p>
              </div>
              <div>
                <p className="font-semibold">Email:</p>
                <p className="text-gray-600">campusheights@example.com</p>
              </div>
              <div>
                <p className="font-semibold">Address:</p>
                <p className="text-gray-600">123 Campus Road, Colombo 04</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BoardingDetailPage;
