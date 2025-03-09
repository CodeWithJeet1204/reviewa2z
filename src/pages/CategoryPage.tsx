
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight, Search, Filter, X } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ReviewCard from '@/components/ReviewCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Helmet } from 'react-helmet-async';

// Categories that have filterable attributes
const FILTERABLE_CATEGORIES = {
  'smartphones': {
    name: 'Smartphones',
    filters: {
      'price': {
        label: 'Price Range',
        options: [
          { value: 'under-200', label: 'Under $200' },
          { value: '200-500', label: '$200 - $500' },
          { value: '500-800', label: '$500 - $800' },
          { value: '800-1200', label: '$800 - $1,200' },
          { value: 'over-1200', label: 'Over $1,200' }
        ]
      },
      'brand': {
        label: 'Brand',
        options: [
          { value: 'apple', label: 'Apple' },
          { value: 'samsung', label: 'Samsung' },
          { value: 'google', label: 'Google' },
          { value: 'oneplus', label: 'OnePlus' },
          { value: 'xiaomi', label: 'Xiaomi' },
          { value: 'nothing', label: 'Nothing' },
          { value: 'motorola', label: 'Motorola' },
          { value: 'huawei', label: 'Huawei' },
          { value: 'oppo', label: 'OPPO' },
          { value: 'vivo', label: 'Vivo' }
        ]
      },
      'screen-size': {
        label: 'Screen Size',
        options: [
          { value: 'under-6', label: 'Under 6"' },
          { value: '6-6.5', label: '6" - 6.5"' },
          { value: '6.5-7', label: '6.5" - 7"' },
          { value: 'over-7', label: 'Over 7"' }
        ]
      },
      'storage': {
        label: 'Storage',
        options: [
          { value: '64gb', label: '64GB' },
          { value: '128gb', label: '128GB' },
          { value: '256gb', label: '256GB' },
          { value: '512gb', label: '512GB' },
          { value: '1tb', label: '1TB' }
        ]
      },
      'ram': {
        label: 'RAM',
        options: [
          { value: '4gb', label: '4GB' },
          { value: '6gb', label: '6GB' },
          { value: '8gb', label: '8GB' },
          { value: '12gb', label: '12GB' },
          { value: '16gb', label: '16GB' }
        ]
      },
      'camera': {
        label: 'Main Camera',
        options: [
          { value: 'under-12mp', label: 'Under 12MP' },
          { value: '12-48mp', label: '12MP - 48MP' },
          { value: '48-108mp', label: '48MP - 108MP' },
          { value: 'over-108mp', label: 'Over 108MP' }
        ]
      },
      'os': {
        label: 'Operating System',
        options: [
          { value: 'android-13', label: 'Android 13' },
          { value: 'android-14', label: 'Android 14' },
          { value: 'ios-16', label: 'iOS 16' },
          { value: 'ios-17', label: 'iOS 17' }
        ]
      }
    }
  },
  'laptops': {
    name: 'Laptops',
    filters: {
      'price': {
        label: 'Price Range',
        options: [
          { value: 'under-500', label: 'Under $500' },
          { value: '500-1000', label: '$500 - $1,000' },
          { value: '1000-1500', label: '$1,000 - $1,500' },
          { value: '1500-2000', label: '$1,500 - $2,000' },
          { value: 'over-2000', label: 'Over $2,000' }
        ]
      },
      'brand': {
        label: 'Brand',
        options: [
          { value: 'apple', label: 'Apple' },
          { value: 'dell', label: 'Dell' },
          { value: 'hp', label: 'HP' },
          { value: 'lenovo', label: 'Lenovo' },
          { value: 'asus', label: 'ASUS' },
          { value: 'acer', label: 'Acer' },
          { value: 'msi', label: 'MSI' },
          { value: 'razer', label: 'Razer' },
          { value: 'microsoft', label: 'Microsoft' },
          { value: 'lg', label: 'LG' }
        ]
      },
      'processor': {
        label: 'Processor',
        options: [
          { value: 'intel-i3', label: 'Intel Core i3' },
          { value: 'intel-i5', label: 'Intel Core i5' },
          { value: 'intel-i7', label: 'Intel Core i7' },
          { value: 'intel-i9', label: 'Intel Core i9' },
          { value: 'amd-ryzen5', label: 'AMD Ryzen 5' },
          { value: 'amd-ryzen7', label: 'AMD Ryzen 7' },
          { value: 'amd-ryzen9', label: 'AMD Ryzen 9' },
          { value: 'apple-m1', label: 'Apple M1' },
          { value: 'apple-m2', label: 'Apple M2' },
          { value: 'apple-m3', label: 'Apple M3' }
        ]
      },
      'ram': {
        label: 'RAM',
        options: [
          { value: '8gb', label: '8GB' },
          { value: '16gb', label: '16GB' },
          { value: '32gb', label: '32GB' },
          { value: '64gb', label: '64GB' },
          { value: 'over-64gb', label: 'Over 64GB' }
        ]
      },
      'storage': {
        label: 'Storage',
        options: [
          { value: '256gb', label: '256GB' },
          { value: '512gb', label: '512GB' },
          { value: '1tb', label: '1TB' },
          { value: '2tb', label: '2TB' },
          { value: 'over-2tb', label: 'Over 2TB' }
        ]
      },
      'screen-size': {
        label: 'Screen Size',
        options: [
          { value: '13-under', label: '13" & Under' },
          { value: '14-15', label: '14" - 15"' },
          { value: '16-17', label: '16" - 17"' },
          { value: '17-over', label: 'Over 17"' }
        ]
      },
      'gpu': {
        label: 'Graphics Card',
        options: [
          { value: 'integrated', label: 'Integrated Graphics' },
          { value: 'nvidia-rtx-3050', label: 'NVIDIA RTX 3050' },
          { value: 'nvidia-rtx-3060', label: 'NVIDIA RTX 3060' },
          { value: 'nvidia-rtx-3070', label: 'NVIDIA RTX 3070' },
          { value: 'nvidia-rtx-3080', label: 'NVIDIA RTX 3080' },
          { value: 'nvidia-rtx-4060', label: 'NVIDIA RTX 4060' },
          { value: 'nvidia-rtx-4070', label: 'NVIDIA RTX 4070' },
          { value: 'nvidia-rtx-4080', label: 'NVIDIA RTX 4080' },
          { value: 'nvidia-rtx-4090', label: 'NVIDIA RTX 4090' },
          { value: 'amd-rx-6600m', label: 'AMD RX 6600M' },
          { value: 'amd-rx-6700m', label: 'AMD RX 6700M' },
          { value: 'amd-rx-6800m', label: 'AMD RX 6800M' }
        ]
      }
    }
  },
  'headphones': {
    name: 'Headphones',
    filters: {
      'price': {
        label: 'Price Range',
        options: [
          { value: 'under-50', label: 'Under $50' },
          { value: '50-100', label: '$50 - $100' },
          { value: '100-200', label: '$100 - $200' },
          { value: '200-300', label: '$200 - $300' },
          { value: 'over-300', label: 'Over $300' }
        ]
      },
      'brand': {
        label: 'Brand',
        options: [
          { value: 'sony', label: 'Sony' },
          { value: 'bose', label: 'Bose' },
          { value: 'apple', label: 'Apple' },
          { value: 'samsung', label: 'Samsung' },
          { value: 'sennheiser', label: 'Sennheiser' },
          { value: 'jabra', label: 'Jabra' },
          { value: 'jbl', label: 'JBL' },
          { value: 'beats', label: 'Beats' },
          { value: 'shure', label: 'Shure' },
          { value: 'audio-technica', label: 'Audio-Technica' }
        ]
      },
      'type': {
        label: 'Type',
        options: [
          { value: 'in-ear', label: 'In-ear' },
          { value: 'on-ear', label: 'On-ear' },
          { value: 'over-ear', label: 'Over-ear' }
        ]
      },
      'connectivity': {
        label: 'Connectivity',
        options: [
          { value: 'wired', label: 'Wired' },
          { value: 'wireless', label: 'Wireless' },
          { value: 'true-wireless', label: 'True Wireless' }
        ]
      },
      'features': {
        label: 'Features',
        options: [
          { value: 'anc', label: 'Active Noise Cancellation' },
          { value: 'water-resistant', label: 'Water Resistant' },
          { value: 'built-in-mic', label: 'Built-in Mic' },
          { value: 'foldable', label: 'Foldable' },
          { value: 'multipoint', label: 'Multipoint Connection' },
          { value: 'aptx', label: 'aptX Support' },
          { value: 'ldac', label: 'LDAC Support' },
          { value: 'spatial-audio', label: 'Spatial Audio' }
        ]
      },
      'battery-life': {
        label: 'Battery Life',
        options: [
          { value: 'under-15', label: 'Under 15 hours' },
          { value: '15-25', label: '15-25 hours' },
          { value: '25-35', label: '25-35 hours' },
          { value: 'over-35', label: 'Over 35 hours' }
        ]
      }
    }
  },
  'cameras': {
    name: 'Cameras',
    filters: {
      'price': {
        label: 'Price Range',
        options: [
          { value: 'under-500', label: 'Under $500' },
          { value: '500-1000', label: '$500 - $1,000' },
          { value: '1000-2000', label: '$1,000 - $2,000' },
          { value: '2000-3000', label: '$2,000 - $3,000' },
          { value: 'over-3000', label: 'Over $3,000' }
        ]
      },
      'brand': {
        label: 'Brand',
        options: [
          { value: 'sony', label: 'Sony' },
          { value: 'canon', label: 'Canon' },
          { value: 'nikon', label: 'Nikon' },
          { value: 'fujifilm', label: 'Fujifilm' },
          { value: 'panasonic', label: 'Panasonic' },
          { value: 'olympus', label: 'Olympus' },
          { value: 'leica', label: 'Leica' },
          { value: 'gopro', label: 'GoPro' }
        ]
      },
      'type': {
        label: 'Type',
        options: [
          { value: 'compact', label: 'Compact' },
          { value: 'mirrorless', label: 'Mirrorless' },
          { value: 'dslr', label: 'DSLR' },
          { value: 'action', label: 'Action Camera' },
          { value: 'medium-format', label: 'Medium Format' }
        ]
      },
      'sensor-size': {
        label: 'Sensor Size',
        options: [
          { value: '1-inch', label: '1-inch' },
          { value: 'micro-4-3', label: 'Micro 4/3' },
          { value: 'aps-c', label: 'APS-C' },
          { value: 'full-frame', label: 'Full Frame' },
          { value: 'medium-format', label: 'Medium Format' }
        ]
      },
      'resolution': {
        label: 'Resolution',
        options: [
          { value: 'under-20mp', label: 'Under 20MP' },
          { value: '20-30mp', label: '20MP - 30MP' },
          { value: '30-50mp', label: '30MP - 50MP' },
          { value: '50-100mp', label: '50MP - 100MP' },
          { value: 'over-100mp', label: 'Over 100MP' }
        ]
      },
      'video': {
        label: 'Video Capabilities',
        options: [
          { value: '1080p', label: '1080p' },
          { value: '4k-30', label: '4K/30fps' },
          { value: '4k-60', label: '4K/60fps' },
          { value: '4k-120', label: '4K/120fps' },
          { value: '8k', label: '8K' }
        ]
      },
      'stabilization': {
        label: 'Stabilization',
        options: [
          { value: 'none', label: 'None' },
          { value: 'lens-only', label: 'Lens Only' },
          { value: 'ibis', label: 'In-Body (IBIS)' },
          { value: 'hybrid', label: 'Hybrid' }
        ]
      }
    }
  },
  'tvs': {
    name: 'TVs',
    filters: {
      'price': {
        label: 'Price Range',
        options: [
          { value: 'under-500', label: 'Under $500' },
          { value: '500-1000', label: '$500 - $1,000' },
          { value: '1000-2000', label: '$1,000 - $2,000' },
          { value: '2000-3000', label: '$2,000 - $3,000' },
          { value: 'over-3000', label: 'Over $3,000' }
        ]
      },
      'brand': {
        label: 'Brand',
        options: [
          { value: 'samsung', label: 'Samsung' },
          { value: 'lg', label: 'LG' },
          { value: 'sony', label: 'Sony' },
          { value: 'tcl', label: 'TCL' },
          { value: 'hisense', label: 'Hisense' },
          { value: 'vizio', label: 'Vizio' },
          { value: 'philips', label: 'Philips' }
        ]
      },
      'screen-size': {
        label: 'Screen Size',
        options: [
          { value: 'under-43', label: 'Under 43"' },
          { value: '43-55', label: '43" - 55"' },
          { value: '55-65', label: '55" - 65"' },
          { value: '65-75', label: '65" - 75"' },
          { value: '75-85', label: '75" - 85"' },
          { value: 'over-85', label: 'Over 85"' }
        ]
      },
      'resolution': {
        label: 'Resolution',
        options: [
          { value: '1080p', label: '1080p Full HD' },
          { value: '4k', label: '4K Ultra HD' },
          { value: '8k', label: '8K' }
        ]
      },
      'panel-type': {
        label: 'Panel Type',
        options: [
          { value: 'led', label: 'LED' },
          { value: 'qled', label: 'QLED' },
          { value: 'oled', label: 'OLED' },
          { value: 'mini-led', label: 'Mini LED' },
          { value: 'micro-led', label: 'Micro LED' }
        ]
      },
      'hdr': {
        label: 'HDR Support',
        options: [
          { value: 'hdr10', label: 'HDR10' },
          { value: 'hdr10-plus', label: 'HDR10+' },
          { value: 'dolby-vision', label: 'Dolby Vision' },
          { value: 'hlg', label: 'HLG' }
        ]
      },
      'refresh-rate': {
        label: 'Refresh Rate',
        options: [
          { value: '60hz', label: '60Hz' },
          { value: '120hz', label: '120Hz' },
          { value: '144hz', label: '144Hz' }
        ]
      },
      'smart-platform': {
        label: 'Smart Platform',
        options: [
          { value: 'android-tv', label: 'Android TV' },
          { value: 'google-tv', label: 'Google TV' },
          { value: 'webos', label: 'webOS' },
          { value: 'tizen', label: 'Tizen' },
          { value: 'roku', label: 'Roku' },
          { value: 'fire-tv', label: 'Fire TV' }
        ]
      }
    }
  },
  'smartwatches': {
    name: 'Smartwatches',
    filters: {
      'price': {
        label: 'Price Range',
        options: [
          { value: 'under-100', label: 'Under $100' },
          { value: '100-200', label: '$100 - $200' },
          { value: '200-400', label: '$200 - $400' },
          { value: '400-600', label: '$400 - $600' },
          { value: 'over-600', label: 'Over $600' }
        ]
      },
      'brand': {
        label: 'Brand',
        options: [
          { value: 'apple', label: 'Apple' },
          { value: 'samsung', label: 'Samsung' },
          { value: 'garmin', label: 'Garmin' },
          { value: 'fitbit', label: 'Fitbit' },
          { value: 'amazfit', label: 'Amazfit' },
          { value: 'huawei', label: 'Huawei' },
          { value: 'fossil', label: 'Fossil' }
        ]
      },
      'os': {
        label: 'Operating System',
        options: [
          { value: 'watchos', label: 'watchOS' },
          { value: 'wear-os', label: 'Wear OS' },
          { value: 'tizen', label: 'Tizen' },
          { value: 'fitbit-os', label: 'Fitbit OS' },
          { value: 'garmin-os', label: 'Garmin OS' }
        ]
      },
      'display': {
        label: 'Display Type',
        options: [
          { value: 'oled', label: 'OLED' },
          { value: 'amoled', label: 'AMOLED' },
          { value: 'retina', label: 'Retina' },
          { value: 'lcd', label: 'LCD' }
        ]
      },
      'size': {
        label: 'Case Size',
        options: [
          { value: 'under-40mm', label: 'Under 40mm' },
          { value: '40-44mm', label: '40-44mm' },
          { value: '45-49mm', label: '45-49mm' },
          { value: 'over-49mm', label: 'Over 49mm' }
        ]
      },
      'features': {
        label: 'Features',
        options: [
          { value: 'ecg', label: 'ECG' },
          { value: 'blood-oxygen', label: 'Blood Oxygen' },
          { value: 'gps', label: 'GPS' },
          { value: 'nfc', label: 'NFC Payments' },
          { value: 'cellular', label: 'Cellular' },
          { value: 'fall-detection', label: 'Fall Detection' }
        ]
      },
      'battery-life': {
        label: 'Battery Life',
        options: [
          { value: '1-day', label: 'Up to 1 day' },
          { value: '2-3-days', label: '2-3 days' },
          { value: '4-7-days', label: '4-7 days' },
          { value: 'over-7-days', label: 'Over 7 days' }
        ]
      },
      'water-resistance': {
        label: 'Water Resistance',
        options: [
          { value: 'splash', label: 'Splash Resistant' },
          { value: 'ip67', label: 'IP67' },
          { value: 'ip68', label: 'IP68' },
          { value: '5atm', label: '5ATM' },
          { value: '10atm', label: '10ATM' }
        ]
      }
    }
  }
};

const CategoryPage = () => {
  const { slug } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});

  // Check if the current category has filters
  const hasFilters = slug ? FILTERABLE_CATEGORIES[slug as keyof typeof FILTERABLE_CATEGORIES] : false;

  // Fetch category
  const { data: category, isLoading: categoryLoading, error: categoryError } = useQuery({
    queryKey: ['category', slug],
    queryFn: async () => {
      if (!slug) throw new Error('Category slug is required');

      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error) throw error;
      if (!data) throw new Error('Category not found');
      
      return data;
    }
  });

  // Fetch reviews with new data structure
  const { data: reviews = [], isLoading: reviewsLoading } = useQuery({
    queryKey: ['categoryReviews', slug, sortBy, searchTerm, selectedTags, selectedFilters],
    queryFn: async () => {
      if (!category?.id) return [];

      let query = supabase
        .from('reviews')
        .select('*')
        .eq('category_id', category.id);
      
      // If status field exists, only get published reviews
      query = query.eq('status', 'published');
      
      // Apply search filter if provided
      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%,brief.ilike.%${searchTerm}%`);
      }
      
      // Apply tag filters if any are selected
      if (selectedTags.length > 0) {
        query = query.contains('tags', selectedTags);
      }

      // Apply category-specific filters if any are selected
      if (hasFilters && Object.keys(selectedFilters).length > 0) {
        Object.entries(selectedFilters).forEach(([filter, value]) => {
          if (value) {
            // Check if we should use the product field or specs field
            if (filter.includes('brand') || filter.includes('price')) {
              query = query.contains('product', { [filter]: value });
            } else {
              query = query.contains('specs', { [filter]: value });
            }
          }
        });
      }
      
      // Apply sorting
      switch (sortBy) {
        case 'highest_rated':
          query = query.order('rating', { ascending: false });
          break;
        case 'most_commented':
          query = query.order('comments_count', { ascending: false });
          break;
        case 'most_liked':
          query = query.order('likes_count', { ascending: false });
          break;
        case 'most_viewed':
          query = query.order('view_count', { ascending: false });
          break;
        case 'latest':
        default:
          query = query.order('published_at', { ascending: false });
          break;
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching reviews:', error);
        throw error;
      }
      
      return data || [];
    },
    enabled: !!category?.id
  });

  // Fetch all tags used in this category
  const { data: allTags = [] } = useQuery({
    queryKey: ['categoryTags', slug],
    queryFn: async () => {
      if (!category?.id) return [];

      const { data, error } = await supabase
        .from('reviews')
        .select('tags')
        .eq('category_id', category.id);
      
      if (error) throw error;
      if (!data) return [];
      
      // Extract and deduplicate tags
      const tagSet = new Set<string>();
      data.forEach(review => {
        if (Array.isArray(review.tags)) {
          review.tags.forEach((tag: string) => tagSet.add(tag));
        }
      });
      
      return Array.from(tagSet);
    },
    enabled: !!category?.id
  });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSortBy('latest');
    setSelectedTags([]);
    setSelectedFilters({});
  };

  if (categoryLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container px-4 md:px-6 mx-auto py-16 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xl font-medium">Loading category...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (categoryError || !category) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container px-4 md:px-6 mx-auto py-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
            <p className="text-lg text-muted-foreground mb-6">
              We couldn't find the category you're looking for.
            </p>
            <Button asChild>
              <Link to="/">Return to Homepage</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Generate category meta title and description for SEO
  const metaTitle = `${category.name} Reviews & Comparisons | Honest & Detailed Analysis`;
  const metaDescription = category.description || 
    `Explore our collection of ${category.name} reviews. Find honest opinions, detailed analysis, and pros & cons for the best products.`;

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={`${category.name},reviews,comparison,analysis,best ${category.name},top ${category.name}`} />
        <link rel="canonical" href={`/category/${category.slug}`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/category/${category.slug}`} />
        
        {/* Twitter */}
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
      </Helmet>
      
      <Navbar />
      <main className="container px-4 md:px-6 mx-auto py-8 mt-24">
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm mb-4 text-muted-foreground">
          <Link to="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span className="text-foreground">{category.name}</span>
        </div>

        {/* Category Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-3xl">{category.icon || '📦'}</div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{category.name}</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            {category.description || `Explore our collection of reviews for ${category.name}.`}
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={`Search ${category.name} reviews...`}
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest</SelectItem>
                  <SelectItem value="highest_rated">Highest Rated</SelectItem>
                  <SelectItem value="most_commented">Most Commented</SelectItem>
                  <SelectItem value="most_liked">Most Liked</SelectItem>
                  <SelectItem value="most_viewed">Most Viewed</SelectItem>
                </SelectContent>
              </Select>
              {hasFilters && (
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2" 
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4" />
                  Filters
                  {(selectedTags.length > 0 || Object.keys(selectedFilters).length > 0) && (
                    <Badge variant="secondary" className="ml-1">
                      {selectedTags.length + Object.keys(selectedFilters).length}
                    </Badge>
                  )}
                </Button>
              )}
              {(searchTerm || sortBy !== 'latest' || selectedTags.length > 0 || Object.keys(selectedFilters).length > 0) && (
                <Button variant="ghost" size="icon" onClick={clearFilters} title="Clear filters">
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Tag Filters */}
          {showFilters && hasFilters && (
            <div className="glass p-6 rounded-xl animate-fade-in space-y-8">
              {/* Category-specific filters */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Filters</h3>
                  {(Object.keys(selectedFilters).length > 0 || selectedTags.length > 0) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Clear all filters
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(hasFilters.filters).map(([key, filter]) => (
                    <div key={key} className="space-y-2">
                      <label className="text-sm font-medium flex items-center justify-between">
                        {filter.label}
                        {selectedFilters[key] && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                            onClick={() => setSelectedFilters(prev => {
                              const newFilters = { ...prev };
                              delete newFilters[key];
                              return newFilters;
                            })}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-between"
                            role="combobox"
                          >
                            {selectedFilters[key] 
                              ? filter.options.find(option => option.value === selectedFilters[key])?.label
                              : `Select ${filter.label}`}
                            <ChevronRight className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0" align="start">
                          <Command>
                            <CommandInput placeholder={`Search ${filter.label.toLowerCase()}...`} />
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup>
                              <ScrollArea className="h-[200px]">
                                <CommandItem
                                  value="any"
                                  onSelect={() => {
                                    setSelectedFilters(prev => {
                                      const newFilters = { ...prev };
                                      delete newFilters[key];
                                      return newFilters;
                                    });
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      !selectedFilters[key] ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  Any
                                </CommandItem>
                                {filter.options.map((option) => (
                                  <CommandItem
                                    key={option.value}
                                    value={option.value}
                                    onSelect={() => {
                                      setSelectedFilters(prev => ({
                                        ...prev,
                                        [key]: option.value
                                      }));
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        selectedFilters[key] === option.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {option.label}
                                  </CommandItem>
                                ))}
                              </ScrollArea>
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Filters */}
              {(Object.keys(selectedFilters).length > 0 || selectedTags.length > 0) && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Active Filters</h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(selectedFilters).map(([key, value]) => {
                      const filter = hasFilters.filters[key];
                      const option = filter.options.find(opt => opt.value === value);
                      return (
                        <Badge
                          key={key}
                          variant="secondary"
                          className="pl-2 pr-1 flex items-center gap-1"
                        >
                          <span className="text-xs font-medium opacity-70">{filter.label}:</span>
                          <span>{option?.label}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 hover:bg-transparent"
                            onClick={() => setSelectedFilters(prev => {
                              const newFilters = { ...prev };
                              delete newFilters[key];
                              return newFilters;
                            })}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      );
                    })}
                    {selectedTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="pl-2 pr-1 flex items-center gap-1"
                      >
                        <span className="text-xs font-medium opacity-70">Tag:</span>
                        <span>{tag}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-transparent"
                          onClick={() => toggleTag(tag)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Tags</h3>
                  {selectedTags.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedTags([])}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Clear tags
                    </Button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {allTags.length > 0 ? (
                    allTags.map((tag) => (
                      <Badge 
                        key={tag} 
                        variant={selectedTags.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer hover:bg-primary/10"
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                        {selectedTags.includes(tag) && (
                          <X className="ml-1 h-3 w-3" />
                        )}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No tags available for this category</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <Separator className="mb-8" />

        {/* Reviews Grid */}
        {reviewsLoading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xl font-medium">Loading reviews...</p>
          </div>
        ) : reviews.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl font-medium mb-2">No reviews found</p>
            <p className="text-muted-foreground">
              {searchTerm || selectedTags.length > 0
                ? "Try adjusting your filters or search terms"
                : `Be the first to review in the ${category.name} category`}
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;
