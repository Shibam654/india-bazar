import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/india-bazaar-logo.jpg" alt="India Bazaar" className="w-10 h-10 rounded-full border border-amber-400" />
              <span className="text-xl font-bold text-white">India <span className="text-amber-400">Bazaar</span></span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              India's premier marketplace celebrating Indian craftsmanship, festival specials, and top electronics. Wishing everyone a prosperous and joyous Diwali!
            </p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-amber-300 transition-colors">About India Bazaar</Link></li>
              <li><Link href="/" className="hover:text-amber-300 transition-colors">Careers</Link></li>
              <li><Link href="/" className="hover:text-amber-300 transition-colors">Corporate Information</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Customer Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">Track Orders</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Diwali Gift Cards</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Free Shipping Policy</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Cancellation & Returns</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">24x7 Help Center</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Payment & Security</h3>
            <ul className="space-y-2 text-sm">
              <li><span className="text-slate-400">✓ UPI (GPay, PhonePe, Paytm)</span></li>
              <li><span className="text-slate-400">✓ Credit & Debit Cards</span></li>
              <li><span className="text-slate-400">✓ Cash on Delivery (COD)</span></li>
              <li><span className="text-slate-400">✓ Net Banking</span></li>
              <li><span className="text-slate-400">✓ 100% Safe & Secure Checkout</span></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Diwali Dhamaka Offers</h3>
            <p className="text-xs text-amber-300/90 mb-3">
              Get instant 10% discount with SBI & HDFC cards, plus free festive sweets hamper on orders above ₹1,999!
            </p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">Facebook</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Instagram</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">YouTube</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <div className="flex items-center gap-3">
            <span className="font-bold text-amber-400 text-lg flex items-center gap-2">
              🪔 India Bazaar
            </span>
            <span className="text-xs text-slate-500">| Apna Desi Shopping Destination</span>
          </div>
          <p>&copy; {new Date().getFullYear()} India Bazaar. All rights reserved. Happy Diwali!</p>
        </div>
      </div>
    </footer>
  );
}