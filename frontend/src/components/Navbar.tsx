import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/Button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Activity,
  Dumbbell, 
  User, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X,
  Flame,
  Heart,
  Brain
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils";

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const navItemsAuth = [
    { path: '/dashboard', label: 'Dashboard', icon: <BarChart3 className="w-4 h-4 mr-2" /> },
    { path: '/training', label: 'Training', icon: <Dumbbell className="w-4 h-4 mr-2" /> },
    { path: '/meal-generator', label: 'Meal Plans', icon: <Flame className="w-4 h-4 mr-2" /> },
    { path: '/workout-generator', label: 'Workout Builder', icon: <Activity className="w-4 h-4 mr-2" /> },
    {path:'ai-assistant', label:'AI Assistant', icon:<Brain className="w-4 h-4 mr-2" />}
  ];

  const navItems = [
    { path: '#features', label: 'Features', icon: <Activity className="w-4 h-4 mr-2" /> },
    { path: '#pricing', label: 'Pricing', icon: <BarChart3 className="w-4 h-4 mr-2" /> },
    { path: '#about', label: 'About', icon: <Heart className="w-4 h-4 mr-2" /> },
  ];

  // Check if a nav item is active
  const isActive = (path: string) => {
    // For hash links on landing page
    if (path.startsWith('#')) {
      return location.pathname === '/' && location.hash === path;
    }
    // For home path match
    if (path === '/') {
      return location.pathname === '/';
    }
    // For other paths
    return location.pathname === path;
  };

  // Handle profile navigation
  const handleProfileClick = () => {
    navigate("/profile");
    setShowDropdown(false);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };
  
  // Handle clicking outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className={cn(
      "sticky top-0 z-10 w-full transition-all duration-300",
      scrolled 
        ? "bg-background/95 backdrop-blur-md shadow-sm border-b" 
        : "bg-background/50 backdrop-blur-sm"
    )}>
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="flex h-16 md:h-20 items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 shrink-0 transition-all hover:scale-105"
          >
            <div className="w-9 h-9 flex items-center justify-center bg-primary rounded-lg text-primary-foreground">
              <Dumbbell className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">BodyMind AI</span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex mx-6">
            <NavigationMenuList className="gap-1">
              {(isAuthenticated ? navItemsAuth : navItems).map((item) => (
                <NavigationMenuItem key={item.path}>
                  <Link 
                    to={item.path} 
                    className={cn(
                      "group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                      isActive(item.path) && "bg-primary/15 text-primary font-semibold"
                    )}
                  >
                    <span className="hidden sm:inline-flex items-center">
                      {item.icon}
                      {item.label}
                    </span>
                    <span className="sm:hidden">{item.icon}</span>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right side items */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Theme Toggle - Hidden on Mobile */}
            <div className="hidden md:block">
              <ThemeToggle />
            </div>
            
            {/* Auth Buttons / User Menu */}
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative rounded-full h-9 w-9 md:h-10 md:w-10 overflow-hidden ring-2 ring-primary/10 hover:ring-primary/30 transition-all"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <Avatar className="h-9 w-9 md:h-10 md:w-10">
                    <AvatarImage src={user?.avatar} alt={user?.name || 'User'}/>
                    <AvatarFallback className="bg-primary/10">
                      {user?.name?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-56 z-50">
                    <div className="py-1 rounded-md bg-popover shadow-md border">
                      <div className="flex items-center gap-2 p-2 border-b">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user?.avatar} alt={user?.name || 'User'}/>
                          <AvatarFallback className="bg-primary/10">
                            {user?.name?.[0]?.toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col space-y-0.5">
                          <p className="text-sm font-medium line-clamp-1">{user?.name || 'User'}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">{user?.email || ''}</p>
                        </div>
                      </div>
                      <div 
                        className={cn(
                          "block px-4 py-2 text-sm hover:bg-accent cursor-pointer",
                          isActive('/profile') && "bg-accent/50"
                        )}
                        onClick={handleProfileClick}
                      >
                        <div className="flex items-center">
                          <User className="mr-2 w-4 h-4" />
                          Profile
                        </div>
                      </div>
                      <div 
                        className="block px-4 py-2 text-sm text-destructive hover:bg-destructive/10 cursor-pointer"
                        onClick={handleLogout}
                      >
                        <div className="flex items-center">
                          <LogOut className="mr-2 w-4 h-4" />
                          Logout
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login">
                  <Button 
                    variant={isActive('/login') ? "default" : "ghost"} 
                    size="sm" 
                    className={cn(
                      "font-medium",
                      isActive('/login') && "bg-primary"
                    )}
                  >
                    Log in
                  </Button>
                </Link>
                <Link to="/register">
                  <Button 
                    size="sm" 
                    className={cn(
                      "font-medium",
                      isActive('/register') && "bg-primary/90"
                    )}
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden h-9 w-9">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[350px] pr-0">
                <SheetHeader className="pb-4 border-b">
                  <SheetTitle className="flex items-center">
                    <div className="w-8 h-8 flex items-center justify-center bg-primary rounded-md text-primary-foreground mr-2">
                      <Dumbbell className="w-4 h-4" />
                    </div>
                    Freaky Fit
                  </SheetTitle>
                </SheetHeader>
                
                <div className="flex flex-col justify-between h-[calc(100vh-8rem)]">
                  <nav className="py-6">
                    <div className="flex flex-col gap-2">
                      {(isAuthenticated ? navItemsAuth : navItems).map((item) => (
                        <SheetClose asChild key={item.path}>
                          <Link
                            to={item.path}
                            className={cn(
                              "flex items-center py-3 px-4 rounded-l-md hover:bg-muted text-base",
                              isActive(item.path) && "bg-muted text-primary font-medium border-l-2 border-primary"
                            )}
                          >
                            {item.icon}
                            {item.label}
                          </Link>
                        </SheetClose>
                      ))}
                      
                      {isAuthenticated && (
                        <SheetClose asChild>
                          <Link
                            to="/profile"
                            className={cn(
                              "flex items-center py-3 px-4 rounded-l-md hover:bg-muted text-base",
                              isActive('/profile') && "bg-muted text-primary font-medium border-l-2 border-primary"
                            )}
                          >
                            <User className="w-4 h-4 mr-2" />
                            Profile
                          </Link>
                        </SheetClose>
                      )}
                    </div>
                    
                    {!isAuthenticated && (
                      <div className="mt-6 space-y-2">
                        <SheetClose asChild>
                          <Link to="/login" className="w-full">
                            <Button 
                              variant={isActive('/login') ? "default" : "outline"} 
                              className="w-full justify-center"
                            >
                              Log in
                            </Button>
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link to="/register" className="w-full">
                            <Button 
                              className={cn(
                                "w-full justify-center",
                                isActive('/register') && "bg-primary/90"
                              )}
                            >
                              Sign Up
                            </Button>
                          </Link>
                        </SheetClose>
                      </div>
                    )}
                  </nav>
                  
                  {isAuthenticated && (
                    <div className="py-6 border-t">
                      <SheetClose asChild>
                        <Button 
                          onClick={logout} 
                          variant="ghost" 
                          className="w-full justify-start text-destructive hover:text-destructive/90"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Logout
                        </Button>
                      </SheetClose>
                    </div>
                  )}
                </div>

                <SheetFooter className="absolute bottom-4 right-4">
                  <div className="flex items-center gap-2">
                    <ThemeToggle />
                  </div>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
