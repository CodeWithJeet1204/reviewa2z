import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import ReviewPage from '@/pages/ReviewPage';
import CategoryPage from '@/pages/CategoryPage';
import CategoriesPage from '@/pages/CategoriesPage';
import SearchPage from '@/pages/SearchPage';
import AboutPage from '@/pages/AboutPage';
import NotFound from '@/pages/NotFound';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/review/:slug" element={<ReviewPage />} />
      <Route path="/category/:slug" element={<CategoryPage />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes; 