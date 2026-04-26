// Simple sentiment analysis utility
const positiveWords = [
  'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'perfect',
  'clean', 'comfortable', 'friendly', 'helpful', 'nice', 'beautiful', 'awesome',
  'love', 'liked', 'recommend', 'best', 'superb', 'outstanding', 'brilliant'
];

const negativeWords = [
  'bad', 'terrible', 'awful', 'horrible', 'worst', 'disgusting', 'dirty',
  'uncomfortable', 'rude', 'unhelpful', 'noisy', 'unsafe', 'poor', 'expensive',
  'hate', 'disliked', 'avoid', 'never', 'disappointing', 'shocking', 'unacceptable'
];

export function analyzeSentiment(text) {
  const words = text.toLowerCase().split(/\s+/);
  let positiveCount = 0;
  let negativeCount = 0;
  
  words.forEach(word => {
    if (positiveWords.includes(word)) positiveCount++;
    if (negativeWords.includes(word)) negativeCount++;
  });
  
  const totalSentimentWords = positiveCount + negativeCount;
  if (totalSentimentWords === 0) {
    return { sentiment: 'neutral', score: 0 };
  }
  
  const score = (positiveCount - negativeCount) / words.length;
  let sentiment = 'neutral';
  
  if (score > 0.05) sentiment = 'positive';
  else if (score < -0.05) sentiment = 'negative';
  
  return { sentiment, score };
}

export function categorizeFeedback(text) {
  const categories = [];
  const lowerText = text.toLowerCase();
  
  const categoryKeywords = {
    'cleanliness': ['clean', 'dirty', 'messy', 'hygiene', 'bathroom', 'toilet', 'shower'],
    'staff': ['staff', 'owner', 'manager', 'reception', 'service', 'helpful', 'rude'],
    'facilities': ['wifi', 'internet', 'kitchen', 'parking', 'gym', 'pool', 'furniture'],
    'location': ['location', 'area', 'neighborhood', 'transport', 'bus', 'train', 'walk'],
    'value': ['price', 'cost', 'expensive', 'cheap', 'value', 'money', 'worth'],
    'safety': ['safe', 'security', 'lock', 'dangerous', 'unsafe', 'gated'],
    'noise': ['noisy', 'quiet', 'loud', 'music', 'party', 'neighbors']
  };
  
  Object.entries(categoryKeywords).forEach(([category, keywords]) => {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      categories.push(category);
    }
  });
  
  return categories.length > 0 ? categories : ['other'];
}
