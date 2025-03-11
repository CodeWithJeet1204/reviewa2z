import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';

const SearchSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="container px-4 md:px-6 mx-auto py-12">
      <div className="glass mx-auto max-w-4xl p-8 rounded-xl shadow-sm">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold">Find the Perfect Product</h2>
            <p className="text-muted-foreground">Search for AI-generated reviews across all categories</p>
          </div>
          
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search for reviews..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          
          <div>
            <p className="mb-3 text-sm text-muted-foreground">Popular searches:</p>
            <div className="flex flex-wrap gap-2">
              {["Smartphones", "Laptops", "Headphones", "Smart Home", "Gaming", "Fitness Trackers"].map((term, i) => (
                <Badge 
                  key={i} 
                  variant="secondary" 
                  className="cursor-pointer hover:bg-secondary/80 transition-colors"
                  onClick={() => navigate(`/search?q=${encodeURIComponent(term)}`)}
                >
                  {term}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchSection;
