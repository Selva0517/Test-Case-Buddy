
import { FlaskConical } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-background/50 py-8 backdrop-blur-sm">
      <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-4 md:flex-row md:px-6">
        <div className="flex items-center gap-2">
           <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <FlaskConical className="h-6 w-6" />
          </div>
          <p className="text-sm font-semibold text-foreground">
            Test Case Buddy
          </p>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground md:gap-6">
          <Link href="#" className="transition-colors hover:text-foreground">
            Terms of Service
          </Link>
          <Link href="#" className="transition-colors hover:text-foreground">
            Privacy Policy
          </Link>
          <Link href="#about" className="transition-colors hover:text-foreground">
            About Us
          </Link>
        </nav>
        <div className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Test Case Buddy. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
