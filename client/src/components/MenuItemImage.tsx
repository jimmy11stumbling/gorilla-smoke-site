import { useState, useEffect } from 'react';
import { getMenuImageById, getDefaultImageForCategory } from '@/lib/imagePaths';
import ProgressiveImage from './ui/ProgressiveImage';
import type { MenuItem } from '@shared/schema';

interface MenuItemImageProps {
  menuItem: MenuItem;
  className?: string;
}

export default function MenuItemImage({ menuItem, className = '' }: MenuItemImageProps) {
  const [imageSrc, setImageSrc] = useState<string>('');
  
  useEffect(() => {
    // Try to get a specific image for this menu item by ID
    const specificImage = getMenuImageById(menuItem.id);
    
    // If we have a specific image mapped to this ID, use it
    if (specificImage) {
      setImageSrc(specificImage);
    } 
    // Otherwise use the image path from the database if it exists
    else if (menuItem.image) {
      setImageSrc(menuItem.image);
    } 
    // Fall back to category default as last resort
    else {
      setImageSrc(getDefaultImageForCategory(menuItem.category));
    }
  }, [menuItem.id, menuItem.image, menuItem.category]);
  
  return (
    <ProgressiveImage 
      src={imageSrc} 
      alt={menuItem.name}
      className={className}
      width={400}
      height={300}
      category={menuItem.category}
    />
  );
}