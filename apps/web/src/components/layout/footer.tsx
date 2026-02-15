import Link from "next/link";
import { Separator } from "@aether-ui/react";

const footerLinks = {
  Product: [
    { label: "Components", href: "/components" },
    { label: "Themes", href: "/themes" },
    { label: "Showroom", href: "/showroom" },
    { label: "CLI", href: "/docs/cli" },
  ],
  Resources: [
    { label: "Documentation", href: "/docs" },
    { label: "Installation", href: "/docs/installation" },
    { label: "Changelog", href: "/changelog" },
    { label: "Figma Kit", href: "/figma" },
  ],
  Community: [
    { label: "GitHub", href: "https://github.com/aether-ui/aether" },
    { label: "Discord", href: "https://discord.gg/aether-ui" },
    { label: "Twitter", href: "https://twitter.com/aether_ui" },
    { label: "Contributing", href: "/contributing" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-[hsl(var(--aether-border))] bg-[hsl(var(--aether-bg))]">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rotate-45 rounded-lg bg-gradient-to-tr from-[hsl(var(--aether-primary))] to-[hsl(var(--aether-glow))]" />
              <span className="text-lg font-bold text-[hsl(var(--aether-fg))]">
                Aether UI
              </span>
            </div>
            <p className="mt-4 text-sm text-[hsl(var(--aether-muted-fg))]">
              Components forged beyond the boundary of reality.
              Open source. Free forever.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-[hsl(var(--aether-fg))]">
                {category}
              </h3>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[hsl(var(--aether-muted-fg))] transition-colors hover:text-[hsl(var(--aether-fg))]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator variant="gradient" className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-[hsl(var(--aether-muted-fg))]">
            &copy; {new Date().getFullYear()} Aether UI. Open source under MIT.
          </p>
          <p className="text-xs text-[hsl(var(--aether-muted-fg))]">
            Built with obsessive attention to detail.
          </p>
        </div>
      </div>
    </footer>
  );
}
