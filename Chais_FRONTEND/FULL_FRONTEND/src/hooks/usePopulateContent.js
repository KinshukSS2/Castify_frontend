// usePopulateContent.js - Hook to integrate meme API with existing components
import { useState, useEffect } from 'react';
import memeApiService from '../services/memeApi.js';

export const usePopulateContent = (category = 'trending', count = 10) => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchContent = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const videos = await memeApiService.getVideosByCategory(category, count);
      setContent(videos);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch content:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [category, count]);

  return {
    content,
    loading,
    error,
    refetch: fetchContent
  };
};

// Hook to search content
export const useSearchContent = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = async (keyword, count = 10) => {
    if (!keyword.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const videos = await memeApiService.searchVideos(keyword, count);
      setResults(videos);
    } catch (err) {
      setError(err.message);
      console.error('Failed to search content:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    results,
    loading,
    error,
    search
  };
};

export default usePopulateContent;
