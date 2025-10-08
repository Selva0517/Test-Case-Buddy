
import Header from '@/components/app/header';
import Hero from '@/components/app/hero';
import GeneratorPage from '@/components/app/generator-page';
import Footer from '@/components/app/footer';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <GeneratorPage />
      </main>
      <Footer />
    </div>
  );
}
