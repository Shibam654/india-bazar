import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-semibold mb-4">About ShopKart</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Press</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Corporate Information</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Help</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">Payments</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Shipping</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Cancellation & Returns</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Policy</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">Return Policy</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Terms of Use</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Security</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Privacy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Connect With Us</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">Facebook</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Twitter</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Instagram</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">YouTube</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2">
              <span className="font-bold text-accent text-lg">ShopKart</span>
            </span>
          </div>
          <p>&copy; {new Date().getFullYear()} ShopKart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}