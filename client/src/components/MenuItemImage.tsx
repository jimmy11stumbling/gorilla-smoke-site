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
    // If the menuItem already has a valid image path from the database, use it
    if (menuItem.image && (menuItem.image.startsWith('/images') || menuItem.image.startsWith('http'))) {
      setImageSrc(menuItem.image);
    } 
    // Otherwise try to get a specific image for this menu item by ID
    else {
      const specificImage = getMenuImageById(menuItem.id);
      if (specificImage) {
        setImageSrc(specificImage);
      } else {
        setImageSrc(getDefaultImageForCategory(menuItem.category));
      }
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