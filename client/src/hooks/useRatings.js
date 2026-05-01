import { useState, useEffect } from 'react';
import * as ratingApi from '../api/ratingApi';
import toast from 'react-hot-toast';

export const useRatings = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAllReviews = async () => {
    setLoading(true);
    try {
      const res = await ratingApi.getAllReviews();
      setReviews(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const createRating = async (data) => {
    try {
      await ratingApi.createRating(data);
      toast.success('Review submitted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
      throw err;
    }
  };

  useEffect(() => {
    fetchAllReviews();
  }, []);

  return { reviews, loading, createRating, refetch: fetchAllReviews };
};
