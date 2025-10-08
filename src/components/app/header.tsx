import { FlaskConical } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-white/10 bg-background/50 px-4 backdrop-blur-xl md:px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <FlaskConical className="h-6 w-6" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Test Case Buddy
        </h1>
      </div>
    </header>
  );
}
