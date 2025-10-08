
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowDown } from 'lucide-react';

export default function Hero() {
  return (
    <section id="hero" className="relative h-[80vh] w-full">
      <div className="container mx-auto flex h-full flex-col items-center justify-center px-4 text-center">
        <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          Revolutionize Your Testing Workflow
        </h1>
        <p className="mx-auto mt-6 max-w-[700px] text-lg text-muted-foreground md:text-xl">
          Our vision is to empower developers and QA teams with intelligent tools that streamline the entire testing process. With Test Case Buddy, you can instantly generate comprehensive test cases from requirements, saving time and ensuring robust software quality.
        </p>
        <div className="mt-8 flex gap-4">
          <Button size="lg" asChild>
            <Link href="#generator">
              Get Started
              <ArrowDown className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button size="lg" variant="outline">
            Learn More
          </Button>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
