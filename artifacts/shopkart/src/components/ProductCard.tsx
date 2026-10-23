import { Link, useLocation } from "wouter";
import { Heart, Star } from "lucide-react";
import { Product } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { formatINR } from "@/lib/utils";
import { useAddToWishlist, useAddToCart, getGetDashboardSummaryQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [_, setLocation] = useLocation();
  const addToCart = useAddToCart();
  const addToWishlist = useAddToWishlist();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleCardClick = () => {
    setLocation(`/product/${product.id}`);
  };

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToWishlist.mutate(
      { data: { productId: product.id } },
      {
        onSuccess: () => {
          toast({ title: "Added to Wishlist", description: `${product.name} saved for later.` });
          queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
        },
        onError: () => {
          toast({ title: "Error", description: "Failed to add to wishlist.", variant: "destructive" });
        }
      }
    );
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group flex flex-col bg-card rounded-lg border hover:shadow-lg transition-shadow overflow-hidden relative cursor-pointer"
    >
      {/* Wishlist Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 z-10 rounded-full bg-white/80 hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={handleAddToWishlist}
      >
        <Heart className="h-5 w-5 text-gray-500 hover:text-red-500" />
      </Button>

      {/* Image */}
      <div className="relative aspect-square p-4 flex items-center justify-center bg-white">
        <img 
          src={product.images[0] || "https://placehold.co/400x400?text=No+Image"} 
          alt={product.name}
          className="object-contain max-h-full transition-transform group-hover:scale-105 duration-300"
        />
        {/* Deal Badge */}
        {product.discount >= 50 ? (
          <div className="absolute bottom-0 left-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[11px] font-black px-2.5 py-0.5 rounded-tr-md uppercase tracking-wider shadow-sm flex items-center gap-1">
            🪔 Diwali Dhamaka
          </div>
        ) : product.isFeatured ? (
          <div className="absolute bottom-0 left-0 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-tr-md uppercase tracking-wider">
            Featured
          </div>
        ) : null}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 border-t bg-white">
        <div className="text-xs text-muted-foreground mb-1 font-medium uppercase tracking-wider">{product.brand}</div>
        <h3 className="font-medium text-foreground line-clamp-2 text-sm mb-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        
        {/* Ratings */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center bg-green-600 text-white px-1.5 py-0.5 rounded text-xs font-bold">
            {product.rating.toFixed(1)} <Star className="w-3 h-3 ml-0.5 fill-current" />
          </div>
          <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
        </div>

        <div className="mt-auto pt-2">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-lg font-bold text-foreground">{formatINR(product.price)}</span>
            {product.discount > 0 && (
              <>
                <span className="text-sm text-muted-foreground line-through">{formatINR(product.mrp)}</span>
                <span className="text-xs font-bold text-green-600">{product.discount}% off</span>
              </>
            )}
          </div>
          {product.price > 499 ? (
            <div className="text-xs text-muted-foreground">Free delivery</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}