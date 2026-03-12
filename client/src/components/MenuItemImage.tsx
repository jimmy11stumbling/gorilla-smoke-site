import { getMenuImageById, getDefaultImageForCategory } from '@/lib/imagePaths';
import type { MenuItem } from '@shared/schema';

interface MenuItemImageProps {
  menuItem: MenuItem;
  className?: string;
}

function getImageSrc(menuItem: MenuItem): string {
  if (menuItem.image && (menuItem.image.startsWith('/images') || menuItem.image.startsWith('http'))) {
    return menuItem.image;
  }
  const specific = getMenuImageById(menuItem.id);
  if (specific) return specific;
  return getDefaultImageForCategory(menuItem.category);
}

export default function MenuItemImage({ menuItem, className = '' }: MenuItemImageProps) {
  const src = getImageSrc(menuItem);

  return (
    <img
      src={src}
      alt={menuItem.name}
      className={`w-full h-full object-cover ${className}`}
      loading="lazy"
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        const fallback = getDefaultImageForCategory(menuItem.category);
        if (target.src !== fallback) {
          target.src = fallback;
        }
      }}
    />
  );
}
