import { Fragment, ReactNode } from 'react';
import { Link } from 'wouter';
import { Helmet } from 'react-helmet';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: ReactNode;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  separator?: ReactNode;
  homeHref?: string;
}

export function Breadcrumb({
  items,
  className,
  separator = <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />,
  homeHref = '/',
}: BreadcrumbProps) {
  // Build schema.org breadcrumb list data
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': `https://gorillasmokegrill.com${homeHref}`
      },
      ...items.map((item, index) => ({
        '@type': 'ListItem',
        'position': index + 2,
        'name': item.label,
        'item': item.href ? `https://gorillasmokegrill.com${item.href}` : undefined
      }))
    ]
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>
      
      <nav className={cn('flex items-center text-sm', className)} aria-label="Breadcrumb">
        <ol className="flex items-center space-x-1">
          <li className="flex items-center">
            <Link href={homeHref} className="flex items-center text-muted-foreground hover:text-primary transition-colors">
              <Home className="h-4 w-4" />
              <span className="sr-only">Home</span>
            </Link>
          </li>
          
          {items.map((item, index) => (
            <Fragment key={index}>
              <li className="flex items-center">{separator}</li>
              <li className="flex items-center">
                {item.href ? (
                  <Link 
                    href={item.href} 
                    className="flex items-center text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.icon && <span className="mr-1">{item.icon}</span>}
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <span className="flex items-center text-foreground font-medium">
                    {item.icon && <span className="mr-1">{item.icon}</span>}
                    <span>{item.label}</span>
                  </span>
                )}
              </li>
            </Fragment>
          ))}
        </ol>
      </nav>
    </>
  );
}