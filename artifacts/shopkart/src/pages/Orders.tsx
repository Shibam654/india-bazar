import { AppLayout } from "@/components/layout/AppLayout";
import { Link } from "wouter";
import { useListOrders, OrderStatus } from "@workspace/api-client-react";
import { formatINR } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, ChevronRight, Clock, CheckCircle2, Truck, Box } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Orders() {
  const { data: orders, isLoading } = useListOrders();

  const getStatusConfig = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.pending: return { color: "bg-yellow-100 text-yellow-800", icon: Clock, label: "Pending" };
      case OrderStatus.confirmed: return { color: "bg-blue-100 text-blue-800", icon: CheckCircle2, label: "Confirmed" };
      case OrderStatus.shipped: return { color: "bg-indigo-100 text-indigo-800", icon: Package, label: "Shipped" };
      case OrderStatus.out_for_delivery: return { color: "bg-orange-100 text-orange-800", icon: Truck, label: "Out for Delivery" };
      case OrderStatus.delivered: return { color: "bg-green-100 text-green-800", icon: Box, label: "Delivered" };
      case OrderStatus.cancelled: return { color: "bg-red-100 text-red-800", icon: Clock, label: "Cancelled" };
      default: return { color: "bg-gray-100 text-gray-800", icon: Clock, label: status };
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          My Orders
        </h1>

        {isLoading ? (
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-40 w-full rounded-lg" />
            ))}
          </div>
        ) : orders?.length === 0 ? (
          <div className="bg-white rounded-lg border shadow-sm p-12 flex flex-col items-center justify-center text-center">
            <div className="w-32 h-32 mb-6 flex items-center justify-center bg-blue-50 rounded-full text-blue-200">
              <Package className="w-16 h-16" />
            </div>
            <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-8">Looks like you haven't placed any orders yet.</p>
            <Link href="/" className="inline-flex items-center justify-center bg-primary text-primary-foreground h-10 px-8 rounded-md font-medium">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders?.map((order) => {
              const statusConfig = getStatusConfig(order.status);
              const StatusIcon = statusConfig.icon;
              
              return (
                <Link key={order.id} href={`/orders/${order.id}`} className="block bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
                  <div className="bg-gray-50 border-b p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                      <div>
                        <span className="text-muted-foreground">Order ID:</span>
                        <span className="font-semibold ml-1">#{order.id}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Placed on:</span>
                        <span className="font-semibold ml-1">{new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Total:</span>
                        <span className="font-semibold ml-1">{formatINR(order.total)}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className={`border-none ${statusConfig.color} flex items-center gap-1.5 px-2.5 py-1`}>
                      <StatusIcon className="w-3.5 h-3.5" /> {statusConfig.label}
                    </Badge>
                  </div>
                  
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex -space-x-4">
                      {order.items.slice(0, 4).map((item, idx) => (
                        <div key={item.id} className="w-16 h-16 rounded-full border-2 border-white bg-white shadow-sm overflow-hidden z-10" style={{ zIndex: 10 - idx }}>
                          <img src={item.product.images[0]} alt="" className="w-full h-full object-contain p-1" />
                        </div>
                      ))}
                      {order.items.length > 4 && (
                        <div className="w-16 h-16 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 shadow-sm z-0">
                          +{order.items.length - 4}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center text-primary font-medium group-hover:underline">
                      View Details <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}