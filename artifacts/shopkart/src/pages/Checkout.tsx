import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useLocation } from "wouter";
import { 
  useGetCart,
  useListAddresses,
  usePlaceOrder,
  OrderInputPaymentMethod
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { formatINR } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle2, MapPin, CreditCard, Banknote, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Checkout() {
  const [_, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: cart, isLoading: cartLoading } = useGetCart();
  const { data: addresses, isLoading: addressesLoading } = useListAddresses();
  const placeOrder = usePlaceOrder();

  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<OrderInputPaymentMethod>(OrderInputPaymentMethod.cod);

  // Initialize selected address
  if (addresses && addresses.length > 0 && selectedAddressId === null) {
    const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
    setSelectedAddressId(defaultAddr.id);
  }

  const handlePlaceOrder = () => {
    if (!selectedAddressId || !cart || cart.items.length === 0) return;

    placeOrder.mutate(
      { 
        data: { 
          addressId: selectedAddressId, 
          paymentMethod, 
          cartItemIds: cart.items.map(item => item.id) 
        } 
      },
      {
        onSuccess: (order) => {
          queryClient.invalidateQueries(); // Invalidate all (cart, dashboard, orders)
          toast({ title: "Order Placed Successfully!", description: `Order ID: #${order.id}` });
          setLocation(`/orders/${order.id}`);
        },
        onError: () => {
          toast({ title: "Order Failed", description: "Something went wrong while placing your order.", variant: "destructive" });
        }
      }
    );
  };

  if (cartLoading || addressesLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <Skeleton className="h-10 w-48 mb-8" />
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-2/3 space-y-6">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-64 w-full rounded-lg" />
            </div>
            <div className="w-full lg:w-1/3">
              <Skeleton className="h-96 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <Button onClick={() => setLocation('/')}>Start Shopping</Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-2xl font-bold mb-8">Checkout</h1>
        
        <div className="flex flex-col lg:flex-row gap-6 lg:items-start">
          {/* Left Column - Steps */}
          <div className="w-full lg:w-2/3 space-y-6">
            
            {/* Step 1: Delivery Address */}
            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
              <div className="bg-primary text-primary-foreground p-4 flex items-center gap-3">
                <span className="bg-white text-primary w-6 h-6 rounded flex items-center justify-center font-bold text-sm">1</span>
                <h2 className="font-bold uppercase tracking-wide">Delivery Address</h2>
                {selectedAddressId && <CheckCircle2 className="h-5 w-5 ml-auto text-green-400" />}
              </div>
              
              <div className="p-4 md:p-6">
                {addresses?.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground mb-4">You don't have any saved addresses.</p>
                    <Button variant="outline">Add New Address</Button>
                  </div>
                ) : (
                  <RadioGroup value={selectedAddressId?.toString()} onValueChange={(val) => setSelectedAddressId(parseInt(val))}>
                    <div className="space-y-4">
                      {addresses?.map(addr => (
                        <div key={addr.id} className={`border rounded-lg p-4 cursor-pointer transition-colors ${selectedAddressId === addr.id ? 'bg-blue-50/50 border-blue-200' : 'hover:bg-gray-50'}`}>
                          <div className="flex items-start gap-3">
                            <RadioGroupItem value={addr.id.toString()} id={`addr-${addr.id}`} className="mt-1" />
                            <div className="flex-1">
                              <Label htmlFor={`addr-${addr.id}`} className="flex items-center gap-2 font-bold text-base cursor-pointer mb-1">
                                {addr.fullName} <span className="bg-gray-200 text-gray-700 text-[10px] px-1.5 py-0.5 rounded uppercase font-bold">{addr.addressType}</span>
                                <span className="font-medium ml-2">{addr.phone}</span>
                              </Label>
                              <div className="text-sm text-gray-600 mt-1">
                                {addr.addressLine1}, {addr.addressLine2 ? `${addr.addressLine2}, ` : ''}
                                {addr.city}, {addr.state} - <span className="font-medium text-gray-900">{addr.pincode}</span>
                              </div>
                              {selectedAddressId === addr.id && (
                                <div className="mt-4">
                                  <Button className="bg-[#fb641b] hover:bg-[#fb641b]/90 text-white font-bold px-8">Deliver Here</Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                )}
              </div>
            </div>

            {/* Step 2: Payment Options */}
            <div className={`bg-white rounded-lg border shadow-sm overflow-hidden ${!selectedAddressId ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="bg-primary text-primary-foreground p-4 flex items-center gap-3">
                <span className="bg-white text-primary w-6 h-6 rounded flex items-center justify-center font-bold text-sm">2</span>
                <h2 className="font-bold uppercase tracking-wide">Payment Options</h2>
              </div>
              
              <div className="p-4 md:p-6">
                <RadioGroup value={paymentMethod} onValueChange={(val) => setPaymentMethod(val as OrderInputPaymentMethod)}>
                  <div className="space-y-0 border rounded-lg overflow-hidden divide-y">
                    <div className={`p-4 flex items-center gap-3 cursor-pointer ${paymentMethod === OrderInputPaymentMethod.cod ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}>
                      <RadioGroupItem value={OrderInputPaymentMethod.cod} id="pay-cod" />
                      <Label htmlFor="pay-cod" className="flex items-center gap-3 flex-1 cursor-pointer font-medium">
                        <Banknote className="h-5 w-5 text-green-600" /> Cash on Delivery (Cash/UPI)
                      </Label>
                    </div>
                    
                    <div className={`p-4 flex items-center gap-3 cursor-pointer ${paymentMethod === OrderInputPaymentMethod.upi ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}>
                      <RadioGroupItem value={OrderInputPaymentMethod.upi} id="pay-upi" />
                      <Label htmlFor="pay-upi" className="flex items-center gap-3 flex-1 cursor-pointer font-medium">
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10h16"/><path d="M4 14h16"/><path d="M12 4v16"/></svg> 
                        UPI (Google Pay, PhonePe, Paytm)
                      </Label>
                    </div>
                    
                    <div className={`p-4 flex items-center gap-3 cursor-pointer ${paymentMethod === OrderInputPaymentMethod.card ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}>
                      <RadioGroupItem value={OrderInputPaymentMethod.card} id="pay-card" />
                      <Label htmlFor="pay-card" className="flex items-center gap-3 flex-1 cursor-pointer font-medium">
                        <CreditCard className="h-5 w-5 text-blue-600" /> Credit / Debit / ATM Card
                      </Label>
                    </div>
                    
                    <div className={`p-4 flex items-center gap-3 cursor-pointer ${paymentMethod === OrderInputPaymentMethod.netbanking ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}>
                      <RadioGroupItem value={OrderInputPaymentMethod.netbanking} id="pay-netbanking" />
                      <Label htmlFor="pay-netbanking" className="flex items-center gap-3 flex-1 cursor-pointer font-medium">
                        <svg className="h-5 w-5 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M3 10h18"/><path d="M5 6l7-3 7 3"/><path d="M4 10v11"/><path d="M20 10v11"/><path d="M8 14v3"/><path d="M12 14v3"/><path d="M16 14v3"/></svg>
                        Net Banking
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            </div>

          </div>

          {/* Right Column - Price Details */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-lg border shadow-sm sticky top-24">
              <div className="p-4 border-b">
                <h3 className="font-bold text-gray-500 uppercase tracking-wider">Order Summary</h3>
              </div>
              
              <div className="p-4 space-y-4">
                <div className="space-y-3 max-h-[300px] overflow-y-auto mb-4 scrollbar-hide pr-2">
                  {cart.items.map(item => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-12 h-12 bg-gray-50 rounded border p-1 shrink-0">
                        <img src={item.product.images[0]} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="text-sm font-medium truncate">{item.product.name}</div>
                        <div className="text-xs text-muted-foreground">Qty: {item.quantity} × {formatINR(item.product.price)}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-dashed pt-4 space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span>Price ({cart.itemCount} items)</span>
                    <span>{formatINR(cart.subtotal + cart.discount)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span>Discount</span>
                    <span className="text-green-600 font-medium">-{formatINR(cart.discount)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span>Delivery Charges</span>
                    <span className={cart.deliveryCharge === 0 ? "text-green-600 font-medium" : ""}>
                      {cart.deliveryCharge === 0 ? "Free" : formatINR(cart.deliveryCharge)}
                    </span>
                  </div>
                </div>
                
                <div className="border-t pt-4 flex justify-between items-center font-bold text-xl">
                  <span>Amount Payable</span>
                  <span>{formatINR(cart.total)}</span>
                </div>
                
                {cart.discount > 0 && (
                  <div className="text-green-600 font-semibold text-sm pt-2 border-t mt-4 border-dashed">
                    Your Total Savings on this order {formatINR(cart.discount)}
                  </div>
                )}
              </div>

              <div className="p-4 bg-gray-50 border-t rounded-b-lg">
                <Button 
                  size="lg" 
                  className="w-full text-lg h-14 bg-[#fb641b] hover:bg-[#fb641b]/90 text-white font-bold"
                  onClick={handlePlaceOrder}
                  disabled={!selectedAddressId || placeOrder.isPending}
                >
                  {placeOrder.isPending ? "PROCESSING..." : `PAY ${formatINR(cart.total)}`}
                </Button>
              </div>
            </div>
            
            <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground font-medium">
              <ShieldCheck className="h-8 w-8 text-green-600" />
              <p>Safe and Secure Payments. Easy returns. 100% Authentic products.</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}