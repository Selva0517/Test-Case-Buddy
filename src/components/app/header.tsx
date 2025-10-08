
'use client';
import { FlaskConical } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-white/10 bg-background/50 px-4 backdrop-blur-xl md:px-6">
      <Link href="/" className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <FlaskConical className="h-6 w-6" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Test Case Buddy
        </h1>
      </Link>
      <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
        <Link
          href="#features"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Features
        </Link>
        <Link
          href="#generator"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Generator
        </Link>
        <Link
          href="#about"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          About
        </Link>
      </nav>
      <div className="flex items-center gap-2">
        {/* Social links and sign-in button removed */}
      </div>
    </header>
  );
}
