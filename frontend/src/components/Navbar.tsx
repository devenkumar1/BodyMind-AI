import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
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
  Heart
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils";

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  
  // Track scroll position to change navbar appearance
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
    { path: '/profile', label: 'Profile', icon: <User className="w-4 h-4 mr-2" /> },
  ];

  const navItems = [
    { path: '#features', label: 'Features', icon: <Activity className="w-4 h-4 mr-2" /> },
    { path: '#pricing', label: 'Pricing', icon: <BarChart3 className="w-4 h-4 mr-2" /> },
    { path: '#about', label: 'About', icon: <Heart className="w-4 h-4 mr-2" /> },
  ];

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
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
            <span className="text-xl font-bold tracking-tight">Freaky Fit</span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex mx-6">
            <NavigationMenuList className="gap-1">
              {(isAuthenticated ? navItemsAuth : navItems).map((item) => (
                <NavigationMenuItem key={item.path}>
                  <Link 
                    to={item.path} 
                    className="group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary focus:outline-none disabled:pointer-events-none disabled:opacity-50"
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
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Auth Buttons / User Menu */}
            {isAuthenticated ? (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={logout}
                  className="hidden md:flex items-center gap-2 text-destructive hover:text-destructive/90"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative rounded-full h-9 w-9 md:h-10 md:w-10 overflow-hidden ring-2 ring-primary/10 hover:ring-primary/30 transition-all">
                      <Avatar className="h-9 w-9 md:h-10 md:w-10">
                        <AvatarImage src={user?.avatar} alt={user?.name || 'User'}/>
                        <AvatarFallback className="bg-primary/10">
                          {user?.name?.[0]?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <div className="flex items-center gap-2 p-2">
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
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="flex items-center cursor-pointer">
                        <BarChart3 className="mr-2 w-4 h-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center cursor-pointer">
                        <User className="mr-2 w-4 h-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="flex items-center cursor-pointer">
                        <Settings className="mr-2 w-4 h-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="flex items-center text-destructive hover:text-destructive/90 cursor-pointer">
                      <LogOut className="mr-2 w-4 h-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="font-medium">
                    Log in
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="font-medium">
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
                            className="flex items-center py-3 px-4 rounded-l-md hover:bg-muted text-base"
                          >
                            {item.icon}
                            {item.label}
                          </Link>
                        </SheetClose>
                      ))}
                    </div>
                    
                    {!isAuthenticated && (
                      <div className="mt-6 space-y-2">
                        <SheetClose asChild>
                          <Link to="/login" className="w-full">
                            <Button variant="outline" className="w-full justify-center">
                              Log in
                            </Button>
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link to="/register" className="w-full">
                            <Button className="w-full justify-center">
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
