import { FlaskConical } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur md:px-6">
      <div className="flex items-center gap-3">
        <FlaskConical className="h-7 w-7 text-primary" />
        <h1 className="font-headline text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Test Case Buddy
        </h1>
      </div>
    </header>
  );
}
