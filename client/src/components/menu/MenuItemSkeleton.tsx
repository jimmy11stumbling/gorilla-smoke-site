export default function MenuItemSkeleton() {
  return (
    <div className="bg-card/50 rounded-lg shadow-sm p-4 md:p-6 flex flex-col h-full opacity-70 animate-pulse">
      {/* Image placeholder */}
      <div className="w-full h-48 md:h-52 bg-muted rounded-md mb-4"></div>
      
      {/* Title placeholder */}
      <div className="h-7 bg-muted rounded-md w-3/4 mb-2"></div>
      
      {/* Price placeholder */}
      <div className="h-5 bg-muted rounded-md w-1/4 mb-4"></div>
      
      {/* Description placeholder */}
      <div className="flex-1">
        <div className="h-4 bg-muted rounded-md w-full mb-2"></div>
        <div className="h-4 bg-muted rounded-md w-5/6 mb-2"></div>
        <div className="h-4 bg-muted rounded-md w-4/6"></div>
      </div>
      
      {/* Button placeholder */}
      <div className="h-10 bg-muted rounded-md w-full mt-4"></div>
    </div>
  );
}