import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ThemeSwitcher } from "@/components/showroom/theme-switcher";

export const metadata = {
  title: "Themes",
  description: "18 unique visual themes — switch between realities.",
};

export default function ThemesPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="mb-16">
            <h1 className="text-4xl font-bold text-[hsl(var(--aether-fg))] sm:text-5xl">
              Themes
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-[hsl(var(--aether-muted-fg))]">
              18 complete design languages. Switch realities with a single CSS custom property change.
            </p>
          </div>
          <ThemeSwitcher />
        </div>
      </main>
      <Footer />
    </>
  );
}
