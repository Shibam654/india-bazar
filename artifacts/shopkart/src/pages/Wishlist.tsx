import { AppLayout } from "@/components/layout/AppLayout";
import { Link, useLocation } from "wouter";
import { 
  useGetWishlist, 
  useRemoveFromWishlist,
  useAddToCart,
  useGetDashboardSummary,
  getGetWishlistQueryKey,
  getGetDashboardSummaryQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { formatINR } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2, ShoppingCart, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Wishlist() {
  const [_, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: wishlist, isLoading } = useGetWishlist();
  
  const removeFromWishlist = useRemoveFromWishlist();
  const addToCart = useAddToCart();

  const handleRemove = (productId: number) => {
    removeFromWishlist.mutate(
      { productId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetWishlistQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
          toast({ title: "Removed from Wishlist", description: "Product has been removed from your wishlist." });
        }
      }
    );
  };

  const handleMoveToCart = (productId: number) => {
    addToCart.mutate(
      { data: { productId, quantity: 1 } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
          handleRemove(productId); // Remove from wishlist after adding to cart
          toast({ title: "Moved to Cart", description: "Product has been moved to your cart." });
        }
      }
    );
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          My Wishlist 
          <span className="text-muted-foreground font-normal text-base">({wishlist?.length || 0} items)</span>
        </h1>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-80 rounded-lg" />)}
          </div>
        ) : wishlist?.length === 0 ? (
          <div className="bg-white rounded-lg border shadow-sm p-12 flex flex-col items-center justify-center text-center">
            <div className="w-48 h-48 mb-6 flex items-center justify-center bg-red-50 rounded-full text-red-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Empty Wishlist</h2>
            <p className="text-muted-foreground mb-8">You have no items in your wishlist. Start adding!</p>
            <Button size="lg" onClick={() => setLocation('/')} className="px-12">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {wishlist?.map((item) => (
              <div key={item.id} className="bg-white rounded-lg border shadow-sm overflow-hidden flex flex-col relative group">
                {/* Remove Button */}
                <button 
                  className="absolute top-2 right-2 z-10 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.preventDefault();
                    handleRemove(item.productId);
                  }}
                  disabled={removeFromWishlist.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                <Link href={`/product/${item.productId}`} className="relative aspect-square p-4 flex items-center justify-center bg-gray-50 border-b">
                  <img 
                    src={item.product.images[0] || "https://placehold.co/400x400"} 
                    alt={item.product.name}
                    className="object-contain max-h-full mix-blend-multiply"
                  />
                </Link>
                
                <div className="p-4 flex-1 flex flex-col">
                  <Link href={`/product/${item.productId}`} className="font-medium hover:text-primary line-clamp-2 text-sm mb-2">
                    {item.product.name}
                  </Link>
                  
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex items-center bg-green-600 text-white px-1.5 py-0.5 rounded text-xs font-bold">
                      {item.product.rating.toFixed(1)} <Star className="w-3 h-3 ml-0.5 fill-current" />
                    </div>
                    <span className="text-xs text-muted-foreground">({item.product.reviewCount})</span>
                  </div>

                  <div className="mt-auto pt-2 mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold">{formatINR(item.product.price)}</span>
                      {item.product.discount > 0 && (
                        <>
                          <span className="text-sm text-muted-foreground line-through">{formatINR(item.product.mrp)}</span>
                          <span className="text-xs font-bold text-green-600">{item.product.discount}% off</span>
                        </>
                      )}
                    </div>
                  </div>

                  <Button 
                    className="w-full font-bold uppercase tracking-wider" 
                    onClick={() => handleMoveToCart(item.productId)}
                    disabled={addToCart.isPending}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" /> Move to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}