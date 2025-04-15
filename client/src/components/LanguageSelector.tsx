import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Helmet } from 'react-helmet';
import { Globe, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const SUPPORTED_LANGUAGES = [
  { code: 'en-US', label: 'English', flag: '🇺🇸' },
  { code: 'es-MX', label: 'Español', flag: '🇲🇽' }
];

export default function LanguageSelector() {
  const [location, setLocation] = useLocation();
  const [currentLanguage, setCurrentLanguage] = useState(SUPPORTED_LANGUAGES[0]);
  
  // Detect language from URL path
  useEffect(() => {
    if (location.startsWith('/es')) {
      setCurrentLanguage(SUPPORTED_LANGUAGES[1]);
    } else {
      setCurrentLanguage(SUPPORTED_LANGUAGES[0]);
    }
  }, [location]);
  
  // Switch language
  const handleLanguageChange = (langCode: string) => {
    const newLang = SUPPORTED_LANGUAGES.find(lang => lang.code === langCode) || SUPPORTED_LANGUAGES[0];
    setCurrentLanguage(newLang);
    
    // Change URL path to reflect language
    if (langCode === 'es-MX') {
      // Current path is in English, switch to Spanish
      if (!location.startsWith('/es')) {
        setLocation(`/es${location}`);
      }
    } else {
      // Current path is in Spanish, switch to English
      if (location.startsWith('/es')) {
        setLocation(location.replace(/^\/es/, ''));
      }
    }
  };
  
  // Generate alternate URLs for hreflang tags
  const baseUrl = 'https://gorillasmokegrill.com';
  const currentPath = location.startsWith('/es') ? location.replace(/^\/es/, '') : location;
  const alternateUrls = [
    { hreflang: 'en-us', href: `${baseUrl}${currentPath}` },
    { hreflang: 'es-mx', href: `${baseUrl}/es${currentPath}` },
    { hreflang: 'x-default', href: `${baseUrl}${currentPath}` }
  ];
  
  return (
    <>
      <Helmet>
        {alternateUrls.map((url, index) => (
          <link 
            key={index}
            rel="alternate" 
            hrefLang={url.hreflang} 
            href={url.href} 
          />
        ))}
      </Helmet>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center space-x-1 px-2 py-1 rounded-full hover:bg-primary/10 focus-visible:ring-1 focus-visible:ring-primary"
            aria-label="Select language"
          >
            <Globe className="h-4 w-4 mr-1" />
            <span className="text-sm font-medium">{currentLanguage.flag}</span>
            <span className="hidden md:inline text-sm font-medium">{currentLanguage.label}</span>
            <ChevronDown className="h-3 w-3 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          {SUPPORTED_LANGUAGES.map((language) => (
            <DropdownMenuItem
              key={language.code}
              className={`text-sm cursor-pointer ${
                currentLanguage.code === language.code ? 'bg-primary/10 font-medium' : ''
              }`}
              onClick={() => handleLanguageChange(language.code)}
            >
              <span className="mr-2">{language.flag}</span>
              {language.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}