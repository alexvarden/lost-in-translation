import { Header } from "@/components/layout/Header";
import { SiteNav } from "@/components/layout/SiteNav";
import { TranslationPlayground } from "@/components/playground/TranslationPlayground";

export default function HomePage() {
  return (
    <main className="relative min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Header asPageHeading rightSlot={<SiteNav current="demo" />} />

      <div className="mt-6">
        <TranslationPlayground
          hydrateFromUrl
          showControls
          showResults
          showExplainer
        />
      </div>

      <footer className="mt-12 pt-6 border-t border-dark-700/40 text-xs text-dark-500 flex items-center justify-between">
        <span>A showcase by Crane</span>
        <span>Deliberately built.</span>
      </footer>
    </main>
  );
}
