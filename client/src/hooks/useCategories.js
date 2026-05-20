import { useState, useEffect } from 'react';
import * as categoryApi from '../api/categoryApi';
import toast from 'react-hot-toast';

/* ── Fallback categories when backend is unreachable ── */
const FALLBACK_CATEGORIES = [
  { _id: 'cat_web',      name: 'Web Development',     description: 'Learn to build modern web applications.' },
  { _id: 'cat_mobile',   name: 'Mobile Development',  description: 'Build apps for iOS and Android.' },
  { _id: 'cat_ds',       name: 'Data Science',         description: 'Analyze data and build machine learning models.' },
  { _id: 'cat_ml',       name: 'Machine Learning',     description: 'Deep learning, neural networks, and AI.' },
  { _id: 'cat_devops',   name: 'DevOps',               description: 'CI/CD, Docker, Kubernetes, and cloud infrastructure.' },
  { _id: 'cat_design',   name: 'Design',               description: 'Master UI/UX and graphic design.' },
  { _id: 'cat_business', name: 'Business',             description: 'Learn entrepreneurship and management.' },
  { _id: 'cat_blockchain', name: 'Blockchain',         description: 'Smart contracts, DeFi, and Web3 development.' },
];

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryData, setCategoryData] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await categoryApi.showAllCategories();
      const categoriesList = res.data.data || res.data.allCategories || [];
      // Use API data if available, otherwise fall back to hardcoded list
      setCategories(categoriesList.length > 0 ? categoriesList : FALLBACK_CATEGORIES);
    } catch (err) {
      console.warn('API unreachable — using fallback categories');
      setCategories(FALLBACK_CATEGORIES);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryPage = async (categoryId) => {
    setLoading(true);
    try {
      const res = await categoryApi.getCategoryPageDetails(categoryId);
      setCategoryData(res.data.data);
    } catch (err) {
      toast.error('Failed to load category');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return { categories, loading, categoryData, setCategoryData, fetchCategories, fetchCategoryPage };
};
