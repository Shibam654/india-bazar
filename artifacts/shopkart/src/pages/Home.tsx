import { AppLayout } from "@/components/layout/AppLayout";
import { useGetFeaturedProducts, useGetDealsOfTheDay, useListCategories } from "@workspace/api-client-react";
import { ProductCard } from "@/components/ProductCard";
import { Link } from "wouter";
import { ChevronRight, Zap } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { data: featuredProducts, isLoading: loadingFeatured } = useGetFeaturedProducts();
  const { data: deals, isLoading: loadingDeals } = useGetDealsOfTheDay();
  const { data: categories, isLoading: loadingCategories } = useListCategories();

  return (
    <AppLayout>
      {/* Hero Banner Carousel (Static representation for vibe) */}
      <div className="bg-primary pt-8 pb-12 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8 bg-gradient-to-r from-blue-700 to-blue-500 rounded-xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
            <div className="z-10 flex-1 space-y-4">
              <span className="inline-block px-3 py-1 bg-accent text-accent-foreground text-xs font-bold uppercase tracking-wider rounded-full">Big Diwali Sale</span>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">The Big Shopping Festival</h1>
              <p className="text-lg text-blue-100 max-w-md">Up to 80% off on Electronics, Fashion, and more. Plus 10% instant discount on SBI Cards.</p>
              <div className="pt-4">
                <Link href="/search" className="inline-flex items-center justify-center bg-white text-primary font-bold px-8 py-3 rounded hover:bg-gray-100 transition-colors">
                  Shop Now <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
            <div className="flex-1 relative z-10 flex justify-center hidden md:flex">
              {/* Abstract shapes or generated image could go here, for now a stylish mockup */}
              <div className="w-64 h-64 bg-accent/20 rounded-full blur-3xl absolute top-0 -right-10"></div>
              <div className="w-64 h-64 bg-white/20 rounded-full blur-3xl absolute bottom-0 left-0"></div>
              <img src="https://placehold.co/400x400/transparent/white?text=Offers" alt="Sale" className="relative z-20 object-contain drop-shadow-2xl" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Categories Shortcut */}
        <section>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {loadingCategories ? (
              Array(8).fill(0).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <Skeleton className="w-16 h-16 rounded-full" />
                  <Skeleton className="w-16 h-4" />
                </div>
              ))
            ) : categories?.map((cat) => (
              <Link key={cat.id} href={`/search?category=${cat.slug}`} className="flex flex-col items-center gap-3 group">
                <div className="w-16 h-16 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-2xl group-hover:shadow-md group-hover:-translate-y-1 transition-all overflow-hidden p-3">
                  {cat.icon ? (
                    <img src={cat.icon} alt={cat.name} className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-gray-400">{cat.name.charAt(0)}</span>
                  )}
                </div>
                <span className="text-xs font-medium text-center group-hover:text-primary transition-colors">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Deals of the Day */}
        <section className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-accent via-secondary to-accent"></div>
          <div className="flex items-center justify-between mb-6 border-b pb-4">
            <div className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-accent fill-accent" />
              <h2 className="text-xl md:text-2xl font-bold">Deals of the Day</h2>
            </div>
            <Link href="/search?sort=popular" className="text-sm font-medium text-primary flex items-center hover:underline">
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {loadingDeals ? (
              Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-64 rounded-lg" />)
            ) : deals?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-bold">Featured Products</h2>
            <Link href="/search" className="text-sm font-medium text-primary flex items-center hover:underline">
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {loadingFeatured ? (
              Array(10).fill(0).map((_, i) => <Skeleton key={i} className="h-80 rounded-lg" />)
            ) : featuredProducts?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}