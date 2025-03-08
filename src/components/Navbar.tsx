import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/providers/ThemeProvider';
import { ModeToggle } from '@/components/ModeToggle';

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-transparent pointer-events-none" />
      
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between relative">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-bold text-xl">ReviewA2Z</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/categories" className="text-muted-foreground hover:text-foreground transition-colors">
            Categories
          </Link>
          <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
            About
          </Link>
          <Link to="/search">
            <Button variant="outline" size="icon" className="bg-background/50 backdrop-blur-sm">
              <Search className="h-4 w-4" />
            </Button>
          </Link>
          <ModeToggle />
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center space-x-4">
          <Link to="/search">
            <Button variant="outline" size="icon" className="bg-background/50 backdrop-blur-sm">
              <Search className="h-4 w-4" />
            </Button>
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="bg-background/50 backdrop-blur-sm">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4">
                <Link to="/categories" className="text-lg font-medium">
                  Categories
                </Link>
                <Link to="/about" className="text-lg font-medium">
                  About
                </Link>
                <div className="mt-2">
                  <ModeToggle />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
