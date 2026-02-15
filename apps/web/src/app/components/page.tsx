import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ComponentShowroom } from "@/components/showroom/component-showroom";

export const metadata = {
  title: "Components",
  description: "Every Aether UI component — interactive, themed, and ready to copy.",
};

export default function ComponentsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="mb-16">
            <h1 className="text-4xl font-bold text-[hsl(var(--aether-fg))] sm:text-5xl">
              Components
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-[hsl(var(--aether-muted-fg))]">
              Every component in the Aether system. Interactive previews with
              live code, variant toggles, and theme switching.
            </p>
          </div>
          <ComponentShowroom />
        </div>
      </main>
      <Footer />
    </>
  );
}
