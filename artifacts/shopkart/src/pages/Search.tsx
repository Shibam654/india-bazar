import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useListProducts, useListCategories, ListProductsSortBy } from "@workspace/api-client-react";
import { ProductCard } from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocation, useSearch } from "wouter";
import { Filter, SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export default function Search() {
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const [_, setLocation] = useLocation();

  const q = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") || "";
  const sortParam = (searchParams.get("sort") as ListProductsSortBy) || ListProductsSortBy.popular;
  
  const [showFilters, setShowFilters] = useState(false);

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(categoryParam ? [categoryParam] : []);
  const [minRating, setMinRating] = useState<number>(0);

  // Parse filters
  const { data: productsData, isLoading } = useListProducts({
    search: q || undefined,
    category: selectedCategories.length > 0 ? selectedCategories[0] : undefined,
    sortBy: sortParam,
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
    minRating: minRating > 0 ? minRating : undefined,
    limit: 20
  });

  const { data: categories } = useListCategories();

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchString);
    params.set("sort", value);
    setLocation(`/search?${params.toString()}`);
  };

  const handleCategoryToggle = (slug: string) => {
    setSelectedCategories(prev => {
      const newCats = prev.includes(slug) ? prev.filter(c => c !== slug) : [...prev, slug];
      
      const params = new URLSearchParams(searchString);
      if (newCats.length > 0) {
        params.set("category", newCats[0]); // API currently supports 1 category filter
      } else {
        params.delete("category");
      }
      setLocation(`/search?${params.toString()}`, { replace: true });
      return newCats;
    });
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb & Title */}
        <div className="mb-6">
          <div className="text-sm text-muted-foreground mb-2">Home / Search Results</div>
          <h1 className="text-2xl font-bold">
            {q ? `Search results for "${q}"` : categoryParam ? `Category: ${categoryParam}` : "All Products"}
            <span className="text-muted-foreground text-sm font-normal ml-2">
              ({productsData?.total || 0} items)
            </span>
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden flex justify-between items-center bg-white p-3 border rounded-md shadow-sm">
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2">
              <Filter className="h-4 w-4" /> Filters
            </Button>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort:</span>
              <Select value={sortParam} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[140px] h-9 border-none bg-transparent font-medium">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ListProductsSortBy.popular}>Popularity</SelectItem>
                  <SelectItem value={ListProductsSortBy.price_asc}>Price: Low to High</SelectItem>
                  <SelectItem value={ListProductsSortBy.price_desc}>Price: High to Low</SelectItem>
                  <SelectItem value={ListProductsSortBy.newest}>Newest First</SelectItem>
                  <SelectItem value={ListProductsSortBy.rating}>Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Left Sidebar - Filters */}
          <aside className={`lg:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg border shadow-sm sticky top-24">
              <div className="p-4 border-b flex items-center justify-between">
                <h2 className="font-bold flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" /> Filters
                </h2>
                {(selectedCategories.length > 0 || minRating > 0 || priceRange[0] > 0 || priceRange[1] < 100000) && (
                  <Button variant="link" className="h-auto p-0 text-primary text-xs uppercase" onClick={() => {
                    setSelectedCategories([]);
                    setMinRating(0);
                    setPriceRange([0, 100000]);
                    setLocation('/search');
                  }}>
                    Clear All
                  </Button>
                )}
              </div>

              {/* Category Filter */}
              <div className="p-4 border-b">
                <h3 className="font-semibold text-sm mb-3 uppercase text-muted-foreground">Categories</h3>
                <div className="space-y-2.5 max-h-48 overflow-y-auto">
                  {categories?.map((cat) => (
                    <div key={cat.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`cat-${cat.id}`} 
                        checked={selectedCategories.includes(cat.slug)}
                        onCheckedChange={() => handleCategoryToggle(cat.slug)}
                      />
                      <Label htmlFor={`cat-${cat.id}`} className="text-sm font-medium leading-none cursor-pointer">
                        {cat.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="p-4 border-b">
                <h3 className="font-semibold text-sm mb-4 uppercase text-muted-foreground">Price (₹)</h3>
                <Slider
                  defaultValue={[0, 100000]}
                  max={100000}
                  step={100}
                  value={priceRange}
                  onValueChange={(val) => setPriceRange(val as [number, number])}
                  className="mb-6"
                />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>₹{priceRange[0]}</span>
                  <span>₹{priceRange[1]}+</span>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="p-4">
                <h3 className="font-semibold text-sm mb-3 uppercase text-muted-foreground">Customer Ratings</h3>
                <div className="space-y-2.5">
                  {[4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`rating-${rating}`} 
                        checked={minRating === rating}
                        onCheckedChange={(checked) => setMinRating(checked ? rating : 0)}
                      />
                      <Label htmlFor={`rating-${rating}`} className="text-sm font-medium leading-none cursor-pointer flex items-center gap-1">
                        {rating}&starf; & above
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content - Products */}
          <div className="flex-1">
            <div className="hidden lg:flex justify-between items-center bg-white p-3 border rounded-md shadow-sm mb-6">
              <span className="text-sm font-medium">Showing {productsData?.products?.length || 0} results</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <Select value={sortParam} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-[180px] h-9 font-medium border-gray-200">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ListProductsSortBy.popular}>Popularity</SelectItem>
                    <SelectItem value={ListProductsSortBy.price_asc}>Price: Low to High</SelectItem>
                    <SelectItem value={ListProductsSortBy.price_desc}>Price: High to Low</SelectItem>
                    <SelectItem value={ListProductsSortBy.newest}>Newest First</SelectItem>
                    <SelectItem value={ListProductsSortBy.rating}>Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array(12).fill(0).map((_, i) => <Skeleton key={i} className="h-80 rounded-lg" />)}
              </div>
            ) : productsData?.products?.length === 0 ? (
              <div className="bg-white p-12 flex flex-col items-center justify-center text-center rounded-lg border">
                <img src="https://placehold.co/200x200/transparent/gray?text=No+Results" alt="No Results" className="w-48 h-48 mb-6" />
                <h3 className="text-xl font-bold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-6">Try searching for something else or clear your filters.</p>
                <Button onClick={() => setLocation('/search')}>Clear Filters</Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {productsData?.products?.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}