import { useState } from 'react';
import * as sectionApi from '../api/sectionApi';
import * as subSectionApi from '../api/subSectionApi';
import toast from 'react-hot-toast';

export const useCourseBuilder = () => {
  const [loading, setLoading] = useState(false);

  const addSection = async (data) => {
    setLoading(true);
    try {
      const res = await sectionApi.addSection(data);
      toast.success('Section added!');
      return res.data.updatedCourseDetails;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add section');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateSection = async (data) => {
    setLoading(true);
    try {
      await sectionApi.updateSection(data);
      toast.success('Section updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update section');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteSection = async (data) => {
    setLoading(true);
    try {
      await sectionApi.deleteSection(data);
      toast.success('Section deleted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete section');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addSubSection = async (formData) => {
    setLoading(true);
    try {
      const res = await subSectionApi.addSubSection(formData);
      toast.success('Lecture added!');
      return res.data.updatedSection;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add lecture');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateSubSection = async (formData) => {
    setLoading(true);
    try {
      await subSectionApi.updateSubSection(formData);
      toast.success('Lecture updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update lecture');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteSubSection = async (data) => {
    setLoading(true);
    try {
      await subSectionApi.deleteSubSection(data);
      toast.success('Lecture deleted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete lecture');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, addSection, updateSection, deleteSection, addSubSection, updateSubSection, deleteSubSection };
};
