import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, Badge, Separator } from "@aether-ui/react";

export const metadata = {
  title: "Documentation",
  description: "Complete guide to installing, configuring, and using Aether UI.",
};

const sections = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", href: "/docs", desc: "What is Aether UI and why it exists" },
      { title: "Installation", href: "/docs/installation", desc: "Install via CLI or manual setup" },
      { title: "Theming", href: "/docs/theming", desc: "12 themes, CSS custom properties" },
      { title: "Dark Mode", href: "/docs/dark-mode", desc: "next-themes integration" },
    ],
  },
  {
    title: "Components",
    items: [
      { title: "Button", href: "/docs/button", desc: "8 variants, 5 sizes, Slot support" },
      { title: "Card", href: "/docs/card", desc: "5 variants including glass & glow" },
      { title: "Dialog", href: "/docs/dialog", desc: "Modal with glass and glow variants" },
      { title: "Input", href: "/docs/input", desc: "4 input styles for every context" },
      { title: "Tabs", href: "/docs/tabs", desc: "Tab navigation with animations" },
      { title: "Select", href: "/docs/select", desc: "Radix-powered select dropdown" },
      { title: "Slider", href: "/docs/slider", desc: "Range sliders with glow effects" },
      { title: "Switch", href: "/docs/switch", desc: "Toggle switches with glow" },
      { title: "Badge", href: "/docs/badge", desc: "Status, labels, and tags" },
      { title: "Avatar", href: "/docs/avatar", desc: "User avatars with variants" },
      { title: "Accordion", href: "/docs/accordion", desc: "Expandable content sections" },
      { title: "Progress", href: "/docs/progress", desc: "Progress bars with gradient" },
      { title: "Tooltip", href: "/docs/tooltip", desc: "Contextual tooltips" },
      { title: "Separator", href: "/docs/separator", desc: "Visual dividers" },
      { title: "Checkbox", href: "/docs/checkbox", desc: "Checkboxes with glow" },
      { title: "Textarea", href: "/docs/textarea", desc: "Multiline text input" },
      { title: "Label", href: "/docs/label", desc: "Accessible form labels" },
    ],
  },
];

export default function DocsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <div className="mb-16">
            <Badge variant="glow" className="mb-4">Documentation</Badge>
            <h1 className="text-4xl font-bold text-[hsl(var(--aether-fg))] sm:text-5xl">
              Aether UI Docs
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-[hsl(var(--aether-muted-fg))]">
              Everything you need to build beyond reality.
            </p>
          </div>

          {/* Quick Install */}
          <div className="mb-16 overflow-hidden rounded-xl border border-white/10 bg-black/40 p-6 backdrop-blur">
            <h2 className="mb-4 text-lg font-semibold text-[hsl(var(--aether-fg))]">Quick Start</h2>
            <div className="space-y-3 font-mono text-sm">
              <div>
                <span className="text-[hsl(var(--aether-muted-fg))]"># Initialize in your project</span>
              </div>
              <div>
                <span className="text-[hsl(var(--aether-glow))]">$</span>{" "}
                <span className="text-white/80">npx aether init</span>
              </div>
              <div className="mt-3">
                <span className="text-[hsl(var(--aether-muted-fg))]"># Add components</span>
              </div>
              <div>
                <span className="text-[hsl(var(--aether-glow))]">$</span>{" "}
                <span className="text-white/80">npx aether add button card dialog input tabs</span>
              </div>
              <div className="mt-3">
                <span className="text-[hsl(var(--aether-muted-fg))]"># Or add everything</span>
              </div>
              <div>
                <span className="text-[hsl(var(--aether-glow))]">$</span>{" "}
                <span className="text-white/80">npx aether add --all</span>
              </div>
            </div>
          </div>

          {/* Sections */}
          {sections.map((section) => (
            <div key={section.title} className="mb-12">
              <h2 className="mb-6 text-2xl font-bold text-[hsl(var(--aether-fg))]">{section.title}</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {section.items.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <Card variant="interactive" className="h-full p-4 transition-all">
                      <CardTitle className="text-base">{item.title}</CardTitle>
                      <CardDescription className="mt-1 text-xs">{item.desc}</CardDescription>
                    </Card>
                  </Link>
                ))}
              </div>
              <Separator variant="gradient" className="mt-8" />
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
