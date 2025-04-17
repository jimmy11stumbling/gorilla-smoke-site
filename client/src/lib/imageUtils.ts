import { useEffect, useState } from 'react';

import { MENU_IMAGES, getDefaultImageForCategory } from './imagePaths';

// Default placeholder images by category
const DEFAULT_IMAGES = {
  appetizer: MENU_IMAGES.DEFAULT_APPETIZER,
  entree: MENU_IMAGES.DEFAULT_ENTREE,
  dessert: MENU_IMAGES.DEFAULT_DESSERT,
  beverage: MENU_IMAGES.DEFAULT_BEVERAGE,
  special: MENU_IMAGES.DEFAULT_SPECIAL,
  default: MENU_IMAGES.DEFAULT_ITEM,
};

// Check if an image URL is an external URL
export const isExternalUrl = (url: string): boolean => {
  if (!url) return false;
  return url.startsWith('http://') || url.startsWith('https://');
};

// Get image via our optimized image service
export const getOptimizedImageUrl = (
  imageUrl: string,
  width?: number,
  height?: number,
  quality: number = 90
): string => {
  // Skip processing for SVGs, GIFs, and other special formats
  if (imageUrl?.endsWith('.svg') || imageUrl?.endsWith('.gif')) {
    return imageUrl;
  }

  // If it's an external URL, process through our proxy
  if (isExternalUrl(imageUrl)) {
    let url = `/api/image?url=${encodeURIComponent(imageUrl)}`;
    if (width) url += `&w=${width}`;
    if (height) url += `&h=${height}`;
    url += `&q=${quality}`;
    return url;
  }

  // If it's an internal URL, apply width/height if specified
  if (imageUrl && (width || height)) {
    let url = imageUrl;
    const hasParams = url.includes('?');
    const prefix = hasParams ? '&' : '?';
    
    if (width) url += `${prefix}w=${width}`;
    if (height) url += `${hasParams || width ? '&' : '?'}h=${height}`;
    url += `${hasParams || width || height ? '&' : '?'}q=${quality}`;
    
    return url;
  }

  return imageUrl;
};

// Get appropriate fallback image by category
export const getFallbackImage = (category?: string): string => {
  return getDefaultImageForCategory(category);
};

// React hook for handling images with fallbacks and loading states
export const useImage = (
  src: string | undefined, 
  category?: string,
  width?: number,
  height?: number
) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>('');
  
  useEffect(() => {
    if (!src) {
      setImgSrc(getFallbackImage(category));
      setLoading(false);
      setError(true);
      return;
    }
    
    setLoading(true);
    setError(false);
    setImgSrc(getOptimizedImageUrl(src, width, height));
    
    // Reset if src changes
    return () => {
      setLoading(true);
      setError(false);
    };
  }, [src, category, width, height]);
  
  const handleError = () => {
    setError(true);
    setLoading(false);
    setImgSrc(getFallbackImage(category));
  };
  
  const handleLoad = () => {
    setLoading(false);
    setError(false);
  };
  
  return { imgSrc, loading, error, handleError, handleLoad };
};

// Base64 encoded tiny placeholder for progressive loading
export const TINY_PLACEHOLDER = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';

// Progressive image component props
export interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  category?: string;
}