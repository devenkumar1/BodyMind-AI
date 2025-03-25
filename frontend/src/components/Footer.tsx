import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DumbbellIcon, InstagramIcon, TwitterIcon, FacebookIcon } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-background/95">
      <div className="container px-4 py-8 sm:py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <DumbbellIcon className="w-6 h-6" />
              <span className="text-xl font-bold">Freaky Fit</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your ultimate fitness companion for achieving your health and fitness goals.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="w-8 h-8">
                <InstagramIcon className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="w-8 h-8">
                <TwitterIcon className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="w-8 h-8">
                <FacebookIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-foreground">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/training" className="text-muted-foreground hover:text-foreground">
                  Training Programs
                </Link>
              </li>
              <li>
                <Link to="/nutrition" className="text-muted-foreground hover:text-foreground">
                  Nutrition Guide
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-foreground">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Newsletter</h3>
            <p className="text-sm text-muted-foreground">
              Subscribe to our newsletter for tips, updates, and exclusive offers.
            </p>
            <form className="flex flex-col gap-2 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex px-3 py-1 w-full h-9 text-sm rounded-md border shadow-sm transition-colors border-input bg-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
              <Button type="submit" className="whitespace-nowrap">Subscribe</Button>
            </form>
          </div>
        </div>

        <div className="pt-8 mt-8 text-sm text-center border-t text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Freaky Fit. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 