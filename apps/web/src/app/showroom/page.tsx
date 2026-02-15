import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ComponentShowroom } from "@/components/showroom/component-showroom";

export const metadata = {
  title: "Showroom",
  description: "The interactive Aether UI showroom — every component, every variant, live.",
};

export default function ShowroomPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="mb-16">
            <h1 className="text-4xl font-bold text-[hsl(var(--aether-fg))] sm:text-5xl">
              Showroom
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-[hsl(var(--aether-muted-fg))]">
              Experience every Aether component in its full glory.
              Interact, theme, and explore in real time.
            </p>
          </div>
          <ComponentShowroom />
        </div>
      </main>
      <Footer />
    </>
  );
}
