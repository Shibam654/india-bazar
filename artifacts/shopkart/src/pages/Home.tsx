import { AppLayout } from "@/components/layout/AppLayout";
import { useGetFeaturedProducts, useGetDealsOfTheDay, useListCategories } from "@workspace/api-client-react";
import { ProductCard } from "@/components/ProductCard";
import { Link } from "wouter";
import { ChevronRight, Zap, Sparkles, ShieldCheck, Truck, RotateCcw, CreditCard } from "lucide-react";
import { MOCK_PRODUCTS, DIWALI_CATEGORIES } from "@/data/mockProducts";

export default function Home() {
  const { data: featuredProducts, isLoading: loadingFeatured } = useGetFeaturedProducts();
  const { data: deals, isLoading: loadingDeals } = useGetDealsOfTheDay();
  const { data: categories } = useListCategories();

  // Use API products if available and non-empty, otherwise use rich India Bazaar Diwali mock products
  const activeFeatured = (featuredProducts && featuredProducts.length > 0)
    ? featuredProducts
    : MOCK_PRODUCTS;

  const activeDeals = (deals && deals.length > 0)
    ? deals
    : MOCK_PRODUCTS.filter(p => p.discount >= 50);

  const activeCategories = (categories && categories.length > 0)
    ? categories
    : DIWALI_CATEGORIES;

  return (
    <AppLayout>
      {/* Hero Section with India Bazaar Diwali Festival Banner */}
      <div className="bg-gradient-to-b from-indigo-950 via-slate-900 to-amber-950/20 pt-4 pb-8 overflow-hidden">
        <div className="container mx-auto px-4 space-y-6">
          {/* Main Visual Banner Card */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-amber-500/30 group">
            <img
              src="/diwali-sale-banner.jpg"
              alt="India Bazaar Diwali Festival of Lights Sale"
              className="w-full h-[260px] sm:h-[380px] md:h-[460px] object-cover object-center group-hover:scale-[1.01] transition-transform duration-700"
            />
            {/* Overlay Gradient with CTAs */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-6 sm:p-10 text-white">
              <div className="max-w-2xl space-y-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider rounded-full shadow-lg">
                  <Sparkles className="h-3.5 w-3.5 fill-current" /> India Bazaar Diwali Dhamaka
                </div>
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-amber-200 drop-shadow-md">
                  Celebrate The Grand Festival of Lights
                </h1>
                <p className="text-xs sm:text-base text-gray-200 line-clamp-2 drop-shadow">
                  Handcrafted Diyas, Traditional Royal Silk Sarees, Dry Fruit Hampers, and Top 5G Electronics with up to 80% Off!
                </p>
                <div className="pt-2 flex flex-wrap gap-3">
                  <Link
                    href="/search?category=diwali"
                    className="inline-flex items-center justify-center bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-extrabold px-6 py-2.5 rounded-lg hover:from-amber-400 hover:to-orange-400 shadow-lg transition-all"
                  >
                    Explore Diwali Specials <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                  <Link
                    href="/search"
                    className="inline-flex items-center justify-center bg-white/20 backdrop-blur-md border border-white/30 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-white/30 transition-all"
                  >
                    View All Products
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* India Bazaar Trust Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-slate-800">
            <div className="bg-amber-50/80 border border-amber-200/60 rounded-xl p-3 flex items-center gap-3">
              <div className="p-2 bg-amber-500 text-white rounded-lg">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold">Free Delivery</p>
                <p className="text-[11px] text-muted-foreground">On all orders above ₹499</p>
              </div>
            </div>
            <div className="bg-orange-50/80 border border-orange-200/60 rounded-xl p-3 flex items-center gap-3">
              <div className="p-2 bg-orange-500 text-white rounded-lg">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold">100% Authentic</p>
                <p className="text-[11px] text-muted-foreground">Certified Indian Brands</p>
              </div>
            </div>
            <div className="bg-emerald-50/80 border border-emerald-200/60 rounded-xl p-3 flex items-center gap-3">
              <div className="p-2 bg-emerald-600 text-white rounded-lg">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold">Cash On Delivery</p>
                <p className="text-[11px] text-muted-foreground">Pay at your doorstep or UPI</p>
              </div>
            </div>
            <div className="bg-blue-50/80 border border-blue-200/60 rounded-xl p-3 flex items-center gap-3">
              <div className="p-2 bg-blue-600 text-white rounded-lg">
                <RotateCcw className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold">7-Day Easy Returns</p>
                <p className="text-[11px] text-muted-foreground">Hassle-free replacement</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Categories Shortcut */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
              <span>🛍️</span> Shop by Category
            </h2>
            <Link href="/search" className="text-xs font-semibold text-primary hover:underline">
              View All Categories &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {activeCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/search?category=${cat.slug}`}
                className="flex flex-col items-center gap-2.5 p-3 rounded-xl bg-white shadow-sm border border-gray-100 hover:border-amber-400 hover:shadow-md hover:-translate-y-1 transition-all group"
              >
                <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center overflow-hidden border border-amber-100">
                  <img
                    src={cat.icon}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  />
                </div>
                <span className="text-xs font-semibold text-center group-hover:text-amber-600 transition-colors line-clamp-1">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Deals of the Day (Diwali Dhamaka) */}
        <section className="bg-white rounded-2xl shadow-sm border border-amber-200/70 p-4 sm:p-6 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500"></div>
          <div className="flex items-center justify-between mb-6 border-b pb-4 pt-1">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-amber-100 text-amber-600">
                <Zap className="h-5 w-5 fill-current" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-2">
                  Diwali Dhamaka Deals <span className="text-xs bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full">Up to 71% Off</span>
                </h2>
                <p className="text-xs text-muted-foreground">Limited time festival special pricing</p>
              </div>
            </div>
            <Link href="/search?sort=popular" className="text-sm font-bold text-amber-600 flex items-center hover:underline">
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {activeDeals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Featured India Bazaar Products */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-2">
                ✨ Featured on India Bazaar
              </h2>
              <p className="text-xs text-muted-foreground">Hand-picked top festive selections across India</p>
            </div>
            <Link href="/search" className="text-sm font-bold text-primary flex items-center hover:underline">
              Browse All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {activeFeatured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}