import Booking from "../models/Booking.js";
import Feedback from "../models/Feedback.js";

export class BookingAIEngine {
  static calculatePriorityScore(studentProfile, boardingDetails) {
    let score = 50; // Base score
    
    // Distance preference (closer = higher priority)
    if (studentProfile.preferredDistance && boardingDetails.distance) {
      const distanceDiff = Math.abs(studentProfile.preferredDistance - boardingDetails.distance);
      score += Math.max(0, 20 - distanceDiff * 2);
    }
    
    // Price preference
    if (studentProfile.budgetRange && boardingDetails.price) {
      const withinBudget = boardingDetails.price >= studentProfile.budgetRange.min && 
                           boardingDetails.price <= studentProfile.budgetRange.max;
      if (withinBudget) score += 25;
      else score -= 10;
    }
    
    // Room type preference
    if (studentProfile.preferredRoomType === boardingDetails.roomType) {
      score += 15;
    }
    
    // Gender preference
    if (studentProfile.gender === boardingDetails.genderPreference) {
      score += 10;
    }
    
    // Availability (higher for more available)
    if (boardingDetails.availability > 5) score += 10;
    else if (boardingDetails.availability > 2) score += 5;
    
    return Math.min(100, Math.max(0, score));
  }
  
  static calculateMatchScore(studentId, boardingId) {
    // This would analyze past bookings, feedback patterns, etc.
    // For now, return a random score for demonstration
    return Math.floor(Math.random() * 30) + 70;
  }
  
  static async getSmartRecommendations(studentId, preferences = {}) {
    try {
      // Get student's booking history
      const pastBookings = await Booking.find({ student: studentId })
        .populate('boardingId')
        .sort({ createdAt: -1 });
      
      // Analyze preferences from history
      const analyzedPrefs = this.analyzeStudentPreferences(pastBookings, preferences);
      
      // Get available boardings and score them
      const recommendations = await this.scoreAndRankBoardings(analyzedPrefs);
      
      return recommendations;
    } catch (error) {
      console.error('AI Recommendation Error:', error);
      return [];
    }
  }
  
  static analyzeStudentPreferences(bookings, explicitPrefs) {
    const preferences = {
      ...explicitPrefs,
      budgetRange: explicitPrefs.budgetRange || { min: 0, max: 10000 },
      preferredRoomType: explicitPrefs.preferredRoomType || 'sharing',
      preferredDistance: explicitPrefs.preferredDistance || 5
    };
    
    // Analyze past booking patterns
    if (bookings.length > 0) {
      const roomTypes = bookings.reduce((acc, b) => {
        acc[b.roomType] = (acc[b.roomType] || 0) + 1;
        return acc;
      }, {});
      
      preferences.preferredRoomType = Object.keys(roomTypes).reduce((a, b) => 
        roomTypes[a] > roomTypes[b] ? a : b
      );
    }
    
    return preferences;
  }
  
  static async scoreAndRankBoardings(preferences) {
    // This would integrate with your boarding data source
    // For demo, return mock recommendations
    return [
      {
        boardingId: '1',
        title: 'Campus Heights Hostel',
        score: 92,
        reasons: ['Within budget', 'Preferred room type', 'Close to campus'],
        matchScore: 88
      },
      {
        boardingId: '2', 
        title: 'Student Paradise',
        score: 85,
        reasons: ['Great reviews', 'Facilities match', 'Good location'],
        matchScore: 82
      }
    ];
  }
  
  static async detectBookingAnomalies(bookingData) {
    const anomalies = [];
    
    // Check for unusual booking patterns
    if (bookingData.monthsStay > 12) {
      anomalies.push({
        type: 'unusual_duration',
        severity: 'medium',
        message: 'Booking duration exceeds typical student stay'
      });
    }
    
    if (bookingData.age < 16 || bookingData.age > 35) {
      anomalies.push({
        type: 'age_outside_range',
        severity: 'high',
        message: 'Age outside typical student range'
      });
    }
    
    // Check for duplicate recent bookings
    const recentBookings = await Booking.find({
      student: bookingData.student,
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });
    
    if (recentBookings.length > 2) {
      anomalies.push({
        type: 'multiple_bookings',
        severity: 'high',
        message: 'Multiple bookings in 24 hours'
      });
    }
    
    return anomalies;
  }
  
  static async predictBookingSuccess(bookingData) {
    let successProbability = 0.7; // Base probability
    
    // Factor in student's history
    const studentBookings = await Booking.find({ student: bookingData.student });
    const acceptanceRate = studentBookings.filter(b => b.status === 'accepted').length / studentBookings.length;
    
    if (studentBookings.length > 0) {
      successProbability += (acceptanceRate - 0.5) * 0.3;
    }
    
    // Factor in boarding popularity
    const boardingBookings = await Booking.find({ boardingId: bookingData.boardingId });
    const boardingAcceptanceRate = boardingBookings.filter(b => b.status === 'accepted').length / boardingBookings.length;
    
    if (boardingBookings.length > 0) {
      successProbability += (boardingAcceptanceRate - 0.5) * 0.2;
    }
    
    return Math.min(0.95, Math.max(0.1, successProbability));
  }
}
