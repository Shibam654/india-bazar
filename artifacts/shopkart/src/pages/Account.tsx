import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { 
  useGetUserProfile, 
  useUpdateUserProfile, 
  useGetDashboardSummary,
  useListAddresses
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Package, Heart, CreditCard, Settings, LogOut, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

export default function Account() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: profile, isLoading: profileLoading } = useGetUserProfile();
  const { data: summary, isLoading: summaryLoading } = useGetDashboardSummary();
  const { data: addresses, isLoading: addressesLoading } = useListAddresses();
  
  const updateProfile = useUpdateUserProfile();
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setPhone(profile.phone || "");
    }
  }, [profile]);

  const handleSaveProfile = () => {
    updateProfile.mutate(
      { data: { name, phone } },
      {
        onSuccess: () => {
          setIsEditing(false);
          queryClient.invalidateQueries();
          toast({ title: "Profile Updated", description: "Your details have been saved successfully." });
        }
      }
    );
  };

  const loading = profileLoading || summaryLoading || addressesLoading;

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-6xl flex flex-col md:flex-row gap-6 lg:gap-8">
        
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 shrink-0 space-y-4">
          <div className="bg-white rounded-lg border shadow-sm p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Hello,</div>
              <div className="font-bold">{profile?.name || 'Guest'}</div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
            <div className="p-4 border-b font-semibold text-gray-500 uppercase text-xs flex items-center gap-2">
              <Package className="w-4 h-4 text-primary" /> My Orders
            </div>
            <Link href="/orders" className="flex items-center justify-between p-4 hover:bg-gray-50 hover:text-primary transition-colors text-sm font-medium">
              All Orders <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>
            
            <div className="p-4 border-b border-t font-semibold text-gray-500 uppercase text-xs flex items-center gap-2">
              <Settings className="w-4 h-4 text-primary" /> Account Settings
            </div>
            <div className="flex flex-col">
              <a href="#" className="p-4 hover:bg-gray-50 text-primary bg-blue-50/50 transition-colors text-sm font-medium">Profile Information</a>
              <a href="#" className="p-4 hover:bg-gray-50 transition-colors text-sm font-medium">Manage Addresses</a>
              <a href="#" className="p-4 hover:bg-gray-50 transition-colors text-sm font-medium">PAN Card Information</a>
            </div>

            <div className="p-4 border-b border-t font-semibold text-gray-500 uppercase text-xs flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary" /> Payments
            </div>
            <div className="flex flex-col">
              <a href="#" className="p-4 hover:bg-gray-50 transition-colors text-sm font-medium">Saved Cards</a>
              <a href="#" className="p-4 hover:bg-gray-50 transition-colors text-sm font-medium">Gift Cards</a>
            </div>

            <div className="p-4 border-b border-t font-semibold text-gray-500 uppercase text-xs flex items-center gap-2">
              <Heart className="w-4 h-4 text-primary" /> My Stuff
            </div>
            <div className="flex flex-col border-b">
              <Link href="/wishlist" className="p-4 hover:bg-gray-50 transition-colors text-sm font-medium">My Wishlist</Link>
            </div>
            
            <div className="p-4 text-red-600 hover:bg-red-50 transition-colors cursor-pointer flex items-center gap-2 font-medium text-sm">
              <LogOut className="w-4 h-4" /> Logout
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          
          {/* Dashboard Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border shadow-sm flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-bold text-primary mb-1">{summary?.totalOrderCount || 0}</span>
              <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Total Orders</span>
            </div>
            <div className="bg-white p-4 rounded-lg border shadow-sm flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-bold text-[#fb641b] mb-1">{summary?.activeOrderCount || 0}</span>
              <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Active Orders</span>
            </div>
            <div className="bg-white p-4 rounded-lg border shadow-sm flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-bold text-pink-600 mb-1">{summary?.wishlistCount || 0}</span>
              <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">In Wishlist</span>
            </div>
            <div className="bg-white p-4 rounded-lg border shadow-sm flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-bold text-green-600 mb-1">{summary?.cartItemCount || 0}</span>
              <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">In Cart</span>
            </div>
          </div>

          {/* Profile Section */}
          <div className="bg-white rounded-lg border shadow-sm p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Personal Information</h2>
              {!isEditing && (
                <Button variant="link" className="text-primary font-semibold p-0 h-auto" onClick={() => setIsEditing(true)}>
                  Edit
                </Button>
              )}
            </div>

            {loading ? (
              <div className="space-y-4 max-w-md">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <div className="space-y-6 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    disabled={!isEditing}
                    className="max-w-md bg-gray-50/50 disabled:opacity-100 disabled:bg-gray-100"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    value={profile?.email || ""} 
                    disabled 
                    className="max-w-md bg-gray-100 opacity-100 text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Mobile Number</Label>
                  <Input 
                    id="phone" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    disabled={!isEditing}
                    className="max-w-md bg-gray-50/50 disabled:opacity-100 disabled:bg-gray-100"
                  />
                </div>

                {isEditing && (
                  <div className="flex gap-4 pt-4">
                    <Button onClick={handleSaveProfile} disabled={updateProfile.isPending}>
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => {
                      setIsEditing(false);
                      setName(profile?.name || "");
                      setPhone(profile?.phone || "");
                    }}>
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Addresses Preview */}
          <div className="bg-white rounded-lg border shadow-sm p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Manage Addresses</h2>
              <Button variant="outline" size="sm">Add New</Button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {addresses?.map(addr => (
                <div key={addr.id} className="border rounded-lg p-4 relative">
                  {addr.isDefault && (
                    <span className="absolute top-4 right-4 text-[10px] uppercase font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      Default
                    </span>
                  )}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-gray-200 text-gray-700 text-[10px] px-1.5 py-0.5 rounded uppercase font-bold">{addr.addressType}</span>
                  </div>
                  <div className="font-bold mb-1">{addr.fullName} <span className="font-medium ml-2 text-sm">{addr.phone}</span></div>
                  <p className="text-sm text-gray-600">
                    {addr.addressLine1}<br />
                    {addr.addressLine2 && <>{addr.addressLine2}<br /></>}
                    {addr.city}, {addr.state} - <span className="font-medium text-gray-900">{addr.pincode}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </AppLayout>
  );
}