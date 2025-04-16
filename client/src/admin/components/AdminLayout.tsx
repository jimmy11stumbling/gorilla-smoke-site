import { ReactNode } from 'react';
import { Link } from 'wouter';
import { 
  Home, 
  Menu,
  Users, 
  Mail, 
  UserCog,
  Settings,
  LogOut,
  ArrowLeft,
  ChevronDown
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AdminLayoutProps {
  children: ReactNode;
  user: any;
  onLogout: () => void;
  onReturnToWebsite: () => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
  hasPermission: (section: string) => boolean;
}

export default function AdminLayout({
  children,
  user,
  onLogout,
  onReturnToWebsite,
  activeSection,
  setActiveSection,
  hasPermission
}: AdminLayoutProps) {
  // Get user's initials for avatar
  const getInitials = () => {
    if (!user || !user.name) return 'U';
    return user.name.split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Get role display name
  const getRoleDisplay = () => {
    if (!user || !user.role) return 'User';
    
    const roleMap: Record<string, string> = {
      'admin': 'Administrator',
      'manager': 'Manager',
      'staff': 'Staff Member'
    };
    
    return roleMap[user.role] || 'User';
  };

  // Define navigation items
  const navItems = [
    {
      name: 'Dashboard',
      icon: <Home className="h-5 w-5" />,
      section: 'dashboard',
      permission: 'dashboard'
    },
    {
      name: 'Menu Management',
      icon: <Menu className="h-5 w-5" />,
      section: 'menu',
      permission: 'menu'
    },
    {
      name: 'Lead Management',
      icon: <Users className="h-5 w-5" />,
      section: 'leads',
      permission: 'leads'
    },
    {
      name: 'Contact Messages',
      icon: <Mail className="h-5 w-5" />,
      section: 'contacts',
      permission: 'contacts'
    },
    {
      name: 'User Management',
      icon: <UserCog className="h-5 w-5" />,
      section: 'users',
      permission: 'users'
    },
    {
      name: 'Settings',
      icon: <Settings className="h-5 w-5" />,
      section: 'settings',
      permission: 'settings'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and title */}
            <div className="flex items-center">
              {/* Mobile menu button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="mr-2 lg:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="lg:hidden">
                  <div className="flex flex-col h-full py-6">
                    <div className="px-4 mb-8">
                      <h2 className="text-lg font-semibold">Gorilla Grill</h2>
                      <p className="text-sm text-gray-500">Admin Panel</p>
                    </div>
                    
                    <div className="px-4 py-2">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={onReturnToWebsite}
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Return to Website
                      </Button>
                    </div>
                    
                    <nav className="flex-1 px-2 mt-6">
                      <div className="space-y-1">
                        {navItems.map((item) => 
                          hasPermission(item.permission) && (
                            <Button
                              key={item.section}
                              variant={activeSection === item.section ? "default" : "ghost"}
                              className={`w-full justify-start`}
                              onClick={() => {
                                setActiveSection(item.section);
                              }}
                            >
                              {item.icon}
                              <span className="ml-3">{item.name}</span>
                            </Button>
                          )
                        )}
                      </div>
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
              
              <div className="flex-shrink-0 flex items-center">
                <Link href="/">
                  <h1 className="text-xl font-bold cursor-pointer">
                    Gorilla Grill <span className="text-primary">Admin</span>
                  </h1>
                </Link>
              </div>
            </div>
            
            {/* User dropdown */}
            <div className="flex items-center">
              <Button
                variant="outline"
                className="hidden md:flex mr-4"
                onClick={onReturnToWebsite}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Website
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 px-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar || ''} alt={user?.name || 'User'} />
                      <AvatarFallback>{getInitials()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start text-sm hidden sm:flex">
                      <span className="font-medium">{user?.name || user?.username}</span>
                      <span className="text-xs text-muted-foreground">{getRoleDisplay()}</span>
                    </div>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setActiveSection('settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>
      
      <div className="flex">
        {/* Sidebar - desktop */}
        <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:pt-16 lg:z-10">
          <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <nav className="mt-5 flex-1 px-3 space-y-1">
                {navItems.map((item) => 
                  hasPermission(item.permission) && (
                    <Button
                      key={item.section}
                      variant={activeSection === item.section ? "default" : "ghost"}
                      className={`w-full justify-start mb-1`}
                      onClick={() => setActiveSection(item.section)}
                    >
                      {item.icon}
                      <span className="ml-3">{item.name}</span>
                    </Button>
                  )
                )}
              </nav>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <main className="flex-1 lg:pl-64 pt-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}