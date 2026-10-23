import { Link, useLocation } from "wouter";
import { Search, ShoppingCart, Heart, User, Menu, ChevronRight } from "lucide-react";
import { useGetDashboardSummary } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function Navbar() {
  const [_, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const { data: summary } = useGetDashboardSummary();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-blue-900 via-indigo-900 to-amber-950 text-primary-foreground shadow-md">
      {/* Festive Diwali Top Announcement Bar */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 text-white text-xs font-semibold py-1.5 px-4 text-center tracking-wide flex items-center justify-center gap-2 shadow-inner">
        <span>✨ 🪔</span>
        <span><strong>SHUBH DIWALI DHAMAKA:</strong> Up to 80% Off Across India Bazaar + Free Express Delivery! Use Code: <strong>DIWALI2026</strong></span>
        <span>🪔 ✨</span>
      </div>

      <div className="container mx-auto px-4">
        {/* Top Navbar */}
        <div className="flex h-16 items-center gap-3 sm:gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full overflow-hidden border-2 border-amber-400 shadow-md bg-white p-0.5 flex items-center justify-center group-hover:scale-105 transition-transform">
              <img
                src="/india-bazaar-logo.jpg"
                alt="India Bazaar Logo"
                className="h-full w-full object-cover rounded-full"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center leading-none">
                India <span className="text-amber-400 ml-1">Bazaar</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300/90 flex items-center gap-1">
                🪔 Diwali Mahotsav
              </span>
            </div>
          </Link>

          {/* Search Bar - Hidden on mobile, shown on larger screens */}
          <div className="hidden sm:flex flex-1 max-w-3xl mx-auto">
            <form onSubmit={handleSearch} className="relative w-full flex">
              <Input
                type="search"
                placeholder="Search for products, brands and more..."
                className="w-full bg-white text-black border-none rounded-r-none focus-visible:ring-0 placeholder:text-muted-foreground h-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit" className="rounded-l-none bg-secondary hover:bg-secondary/90 text-white h-10 px-6">
                <Search className="h-5 w-5" />
              </Button>
            </form>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-4 ml-auto flex-shrink-0">
            <Button variant="ghost" size="icon" className="sm:hidden text-white hover:bg-white/20 hover:text-white" onClick={() => setLocation('/search')}>
              <Search className="h-5 w-5" />
            </Button>
            
            <Link href="/account" className="flex items-center gap-2 hover:bg-white/10 px-3 py-2 rounded-md transition-colors text-white">
              <User className="h-5 w-5" />
              <span className="hidden lg:inline font-medium">Login</span>
            </Link>

            <Link href="/wishlist" className="flex items-center gap-2 hover:bg-white/10 px-3 py-2 rounded-md transition-colors text-white relative">
              <Heart className="h-5 w-5" />
              <span className="hidden lg:inline font-medium">Wishlist</span>
              {summary?.wishlistCount ? (
                <span className="absolute top-1 right-2 lg:right-auto lg:left-6 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                  {summary.wishlistCount}
                </span>
              ) : null}
            </Link>

            <Link href="/cart" className="flex items-center gap-2 hover:bg-white/10 px-3 py-2 rounded-md transition-colors text-white relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="hidden lg:inline font-medium">Cart</span>
              {summary?.cartItemCount ? (
                <span className="absolute top-1 right-2 lg:right-auto lg:left-6 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                  {summary.cartItemCount}
                </span>
              ) : null}
            </Link>
          </div>
        </div>
      </div>
      
      {/* Bottom Categories Bar */}
      <div className="bg-white border-b shadow-sm hidden md:block">
        <div className="container mx-auto px-4 flex h-10 items-center gap-6 text-sm font-medium text-foreground">
          <button className="flex items-center gap-1 hover:text-primary transition-colors">
            <Menu className="h-4 w-4" /> All Categories
          </button>
          <Link href="/search?category=diwali" className="text-amber-600 font-bold hover:text-amber-700 transition-colors flex items-center gap-1">
            🪔 Diwali Specials
          </Link>
          <Link href="/search?category=electronics" className="hover:text-primary transition-colors">Mobiles & Electronics</Link>
          <Link href="/search?category=fashion" className="hover:text-primary transition-colors">Ethnic Wear & Fashion</Link>
          <Link href="/search?category=sweets" className="hover:text-primary transition-colors">Sweets & Dry Fruits</Link>
          <Link href="/search?category=home" className="hover:text-primary transition-colors">Home & Pooja Decor</Link>
          <Link href="/search?category=appliances" className="hover:text-primary transition-colors">Appliances</Link>
        </div>
      </div>
    </header>
  );
}