import { useState, useEffect } from 'react';
import * as categoryApi from '../api/categoryApi';
import toast from 'react-hot-toast';

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryData, setCategoryData] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await categoryApi.showAllCategories();
      const categoriesList = res.data.data || res.data.allCategories || [];
      setCategories(categoriesList);
    } catch (err) {
      toast.error('Failed to load categories');
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

  return { categories, loading, categoryData, fetchCategories, fetchCategoryPage };
};
