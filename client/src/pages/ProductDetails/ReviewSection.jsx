import React, { useState } from 'react';
import { Star, Edit, Trash2, MessageCircle, ThumbsUp } from 'lucide-react';

const ReviewSection = ({ reviews, onAddReview, onEditReview, onDeleteReview }) => {
  const [newReview, setNewReview] = useState({ rating: 0, comment: '', userName: '' });
  const [editingId, setEditingId] = useState(null);
  const [editingReview, setEditingReview] = useState({ rating: 0, comment: '' });

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (newReview.rating > 0 && newReview.comment.trim() && newReview.userName.trim()) {
      onAddReview({
        userId: 'current-user',
        userName: newReview.userName,
        rating: newReview.rating,
        comment: newReview.comment,
        isUserReview: true,
      });
      setNewReview({ rating: 0, comment: '', userName: '' });
    }
  };

  const handleEditSubmit = (reviewId) => {
    onEditReview(reviewId, editingReview);
    setEditingId(null);
  };

  const StarRating = ({ rating, onRatingChange, readonly = false }) => (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onRatingChange?.(star)}
          className={`${readonly ? 'cursor-default' : 'cursor-pointer'} transition-colors`}
        >
          <Star
            className={`w-5 h-5 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  );

  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  return (
    <div className="space-y-8">
      {/* Reviews Summary */}
      <div className="bg-green-50 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-gray-900">Customer Reviews</h3>
          <div className="flex items-center space-x-2">
            <StarRating rating={Math.round(averageRating)} readonly />
            <span className="text-lg font-semibold text-gray-700">
              {averageRating.toFixed(1)} ({reviews.length} reviews)
            </span>
          </div>
        </div>
      </div>

      {/* Add Review Form */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <MessageCircle className="w-5 h-5 mr-2 text-green-600" />
          Write a Review
        </h4>
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
            <input
              type="text"
              value={newReview.userName}
              onChange={(e) => setNewReview({ ...newReview, userName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              placeholder="Enter your name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <StarRating
              rating={newReview.rating}
              onRatingChange={(rating) => setNewReview({ ...newReview, rating })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
              placeholder="Share your experience with this product..."
              required
            />
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Submit Review
          </button>
        </form>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            {editingId === review.id ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <StarRating
                    rating={editingReview.rating}
                    onRatingChange={(rating) => setEditingReview({ ...editingReview, rating })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Review</label>
                  <textarea
                    value={editingReview.comment}
                    onChange={(e) => setEditingReview({ ...editingReview, comment: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditSubmit(review.id)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h5 className="font-semibold text-gray-900">{review.userName}</h5>
                    <div className="flex items-center space-x-2 mt-1">
                      <StarRating rating={review.rating} readonly />
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                  </div>
                  {review.isUserReview && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingId(review.id);
                          setEditingReview({ rating: review.rating, comment: review.comment });
                        }}
                        className="text-green-600 hover:text-green-700 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteReview(review.id)}
                        className="text-red-600 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-gray-700 mb-3">{review.comment}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <button className="flex items-center space-x-1 hover:text-green-600 transition-colors">
                    <ThumbsUp className="w-4 h-4" />
                    <span>{review.likes}</span>
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewSection;
