import React, { useState, useEffect } from 'react';
import { FaStar, FaTimes, FaCheckCircle, FaStore, FaExclamationTriangle } from 'react-icons/fa';
import api from '../api';
import { Button } from './ui/Button';

const VendorReviewModal = ({ isOpen, onClose, vendorId, orderId, vendorName, onSuccess }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [canReview, setCanReview] = useState(false);

    useEffect(() => {
        if (isOpen && vendorId && orderId) {
            checkEligibility();
        }
    }, [isOpen, vendorId, orderId]);

    const checkEligibility = async () => {
        setLoading(true);
        try {
            const response = await api.get(`vendors/${vendorId}/review/check-eligibility/${orderId}/`);
            setCanReview(response.data.can_review);
            if (response.data.existing_review) {
                setRating(response.data.existing_review.rating);
                setComment(response.data.existing_review.comment);
            } else {
                setRating(0);
                setComment('');
            }
        } catch (err) {
            console.error('Error checking eligibility:', err);
            setError('Failed to verify review eligibility.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            alert('Please select a rating before submitting.');
            return;
        }

        setIsSubmitting(true);
        try {
            await api.post(`vendors/${vendorId}/review/submit/${orderId}/`, {
                rating,
                comment
            });
            if (onSuccess) onSuccess('Vendor review submitted successfully!');
            onClose();
        } catch (err) {
            console.error('Error submitting review:', err);
            alert(err.response?.data?.error || 'Failed to submit review.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            
            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-fade-up border border-gray-100">
                {/* Header */}
                <div className="bg-primary text-white p-8 relative">
                    <button 
                        onClick={onClose}
                        className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
                    >
                        <FaTimes size={20} />
                    </button>
                    
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-xl">
                            <FaStore />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black uppercase tracking-tight">Rate Vendor</h3>
                            <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">{vendorName}</p>
                        </div>
                    </div>
                </div>

                <div className="p-8 sm:p-10">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-10 gap-4">
                            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Verifying Authority...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-10">
                            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaExclamationTriangle size={30} />
                            </div>
                            <p className="text-sm font-bold text-gray-600">{error}</p>
                            <Button variant="secondary" onClick={onClose} className="mt-6">Close</Button>
                        </div>
                    ) : !canReview ? (
                        <div className="text-center py-10">
                            <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaExclamationTriangle size={30} />
                            </div>
                            <h4 className="text-lg font-black text-gray-900 uppercase">Review Pending</h4>
                            <p className="text-sm text-gray-400 mt-2">You can only review vendors for orders that have been successfully delivered.</p>
                            <Button variant="secondary" onClick={onClose} className="mt-8">Understood</Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="text-center">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Vendor Service Experience</label>
                                <div className="flex items-center justify-center gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            type="button"
                                            key={star}
                                            className="transition-all duration-200"
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHover(star)}
                                            onMouseLeave={() => setHover(0)}
                                        >
                                            <FaStar 
                                                size={32}
                                                className={`transition-colors ${
                                                    star <= (hover || rating) ? 'text-amber-400' : 'text-gray-100 hover:text-gray-200'
                                                }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                                <div className="mt-4">
                                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.1em]">
                                        {rating === 1 ? 'Poor Service' : 
                                         rating === 2 ? 'Below Average' : 
                                         rating === 3 ? 'Good Service' : 
                                         rating === 4 ? 'Very Good' : 
                                         rating === 5 ? 'Excellent Experience' : 'Choose Rating'}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">How was your interaction?</label>
                                <textarea 
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Tell us about the seller's communication, shipping speed, and packaging..."
                                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-3xl p-6 text-sm focus:outline-none focus:border-primary/20 focus:bg-white transition-all min-h-[120px] font-medium text-gray-900"
                                ></textarea>
                            </div>

                            <div className="flex gap-4 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onClose}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={isSubmitting || rating === 0}
                                    className="flex-1 bg-primary hover:bg-primary-dark shadow-xl shadow-primary/20"
                                >
                                    {isSubmitting ? 'Submitting...' : 'Post Review'}
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
                
                {/* Footer Tip */}
                <div className="bg-gray-50 p-6 border-t border-gray-100">
                    <p className="flex items-center justify-center gap-2 text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">
                        <FaCheckCircle className="text-emerald-500" /> Your review contributes to the integrity of GearUp Nepal
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VendorReviewModal;
