import Link from "next/link";

const footerLinks = {
  Product: [
    { label: "AI Builder", href: "/builder" },
  ],
  Community: [
    { label: "GitHub", href: "https://github.com/zakir19/AetherDB" },
    { label: "Discord", href: "https://discord.gg/aether-db" },
    { label: "Twitter", href: "https://twitter.com/aether_db" },
  ],
};

const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/zakir19/AetherDB",
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    label: "Discord",
    href: "https://discord.gg/aether-db",
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    ),
  },
  {
    label: "Twitter",
    href: "https://twitter.com/aether_db",
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-[hsl(var(--aether-border)/0.5)]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-px w-2/3 max-w-xl bg-linear-to-r from-transparent via-[hsl(var(--aether-glow)/0.25)] to-transparent blur-sm" />

      <div className="mx-auto max-w-7xl px-6">
        <div className="overflow-hidden pt-20 pb-16 sm:pt-28 sm:pb-20">
          <div className="text-[clamp(4rem,12vw,10rem)] font-black tracking-[-0.06em] leading-none text-[hsl(var(--aether-fg)/0.03)] select-none" aria-hidden="true">
            AETHER
          </div>
        </div>

        <div className="grid grid-cols-2 gap-10 pb-16 md:grid-cols-5 md:gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2.5">
              <svg className="h-6 w-6 text-[hsl(var(--aether-primary))]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L3 7l9 5 9-5-9-5z" />
                <path d="M3 17l9 5 9-5" />
                <path d="M3 12l9 5 9-5" />
              </svg>
              <span className="text-sm font-bold tracking-tight text-[hsl(var(--aether-fg))]">
                Aether
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-[hsl(var(--aether-muted-fg))] leading-relaxed">
              AI-powered database schema generation.
              Open source. Free forever.
            </p>


            <div className="mt-6 flex items-center gap-1.5">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[hsl(var(--aether-muted-fg))] transition-all duration-200 hover:text-[hsl(var(--aether-fg))] hover:bg-[hsl(var(--aether-muted)/0.3)]"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[hsl(var(--aether-muted-fg))]">
                {category}
              </h3>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[hsl(var(--aether-muted-fg)/0.7)] transition-colors duration-200 hover:text-[hsl(var(--aether-fg))]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="h-px bg-linear-to-r from-transparent via-[hsl(var(--aether-border)/0.5)] to-transparent" />

        <div className="flex flex-col items-center justify-between gap-4 py-8 sm:flex-row">
          <p className="text-xs text-[hsl(var(--aether-muted-fg)/0.5)]">
            &copy; {new Date().getFullYear()} Aether. MIT License.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-[hsl(var(--aether-muted-fg)/0.5)]">
            <span>Built with</span>
            <span className="text-[hsl(var(--aether-glow)/0.6)]">&hearts;</span>
            <span>and obsessive attention to detail</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
