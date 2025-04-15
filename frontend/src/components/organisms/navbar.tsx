import { useState } from 'react';
import { Bell, Users, Search, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="fixed top-0 left-0 right-0 w-full border-b bg-background z-50">
      <div className="container mx-auto flex h-16 items-center px-4 justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-normal font-productsans">
            Aucti<span className="text-orange-500">X</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center justify-center">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/">
                  <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Explore</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-48 p-2">
                    <Link to="/categories">
                      <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        Categories
                      </NavigationMenuLink>
                    </Link>
                    <Link to="/featured">
                      <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        Featured
                      </NavigationMenuLink>
                    </Link>
                    <Link to="/new-arrivals">
                      <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        New Arrivals
                      </NavigationMenuLink>
                    </Link>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/dashboard">
                  <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                    Dashboard
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/about">
                  <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                    About us
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Search bar */}
        <div className="hidden lg:block w-full max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search auctions"
              className="w-full pl-10"
            />
          </div>
        </div>

        {/* Auth buttons or user controls */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="hidden md:inline-flex"
              >
                <Bell className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hidden md:inline-flex"
              >
                <Users className="h-5 w-5" />
              </Button>
              <Avatar className="hidden md:inline-flex h-8 w-8">
                <AvatarImage src="/api/placeholder/32/32" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" className="hidden md:inline-flex">
                  Log in
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="hidden md:inline-flex">Sign up</Button>
              </Link>
            </>
          )}

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-4 mt-6">
                <div className="flex items-center mb-4">
                  <span className="text-4xl font-normal font-productsans">
                    Aucti<span className="text-orange-500">X</span>
                  </span>
                </div>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Type a command or search..."
                    className="pl-10"
                  />
                </div>
                <nav className="flex flex-col gap-4">
                  <Link to="/">
                    <Button variant="ghost" className="justify-start w-full">
                      Home
                    </Button>
                  </Link>
                  <Link to="/explore">
                    <Button variant="ghost" className="justify-start w-full">
                      Explore
                    </Button>
                  </Link>
                  <Link to="/dashboard">
                    <Button variant="ghost" className="justify-start w-full">
                      Dashboard
                    </Button>
                  </Link>
                  <Link to="/about">
                    <Button variant="ghost" className="justify-start w-full">
                      About us
                    </Button>
                  </Link>
                </nav>
                <div className="mt-auto flex flex-col gap-2">
                  {isLoggedIn ? (
                    <>
                      <div className="flex items-center gap-2 p-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src="/api/placeholder/32/32"
                            alt="User"
                          />
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <span>User Account</span>
                      </div>
                      <Button variant="ghost" className="flex gap-2">
                        <Bell className="h-5 w-5" />
                        Notifications
                      </Button>
                      <Button variant="ghost" className="flex gap-2">
                        <Users className="h-5 w-5" />
                        Friends
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsLoggedIn(false)}
                      >
                        Log out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className="w-full">
                        <Button variant="outline" className="w-full">
                          Log in
                        </Button>
                      </Link>
                      <Link to="/signup" className="w-full">
                        <Button
                          onClick={() => setIsLoggedIn(true)}
                          className="w-full"
                        >
                          Sign up
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}
