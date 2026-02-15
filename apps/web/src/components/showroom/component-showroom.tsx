"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  Badge,
  Input,
  Textarea,
  Switch,
  Slider,
  Progress,
  Separator,
  Checkbox,
  Label,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@aether-ui/react";

// ─── Component Catalog ─────────────────────────────────────

interface ComponentDemo {
  name: string;
  description: string;
  category: string;
  render: () => React.ReactNode;
  code: string;
}

const catalog: ComponentDemo[] = [
  {
    name: "Button",
    description: "8 variants, 5 sizes, compound support via Slot",
    category: "Actions",
    code: `<Button variant="glow" size="lg">Click Me</Button>`,
    render: () => (
      <div className="space-y-6">
        <div className="flex flex-wrap gap-3">
          <Button variant="default">Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="glow">Glow</Button>
          <Button variant="glass">Glass</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
        <Separator variant="gradient" />
        <div className="flex items-end gap-3">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="xl">XL</Button>
          <Button size="icon">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </Button>
        </div>
      </div>
    ),
  },
  {
    name: "Card",
    description: "5 variants including glass, glow, and interactive",
    category: "Layout",
    code: `<Card variant="glow"><CardHeader>...</CardHeader></Card>`,
    render: () => (
      <div className="grid gap-4 sm:grid-cols-2">
        <Card variant="elevated" className="p-4">
          <CardTitle className="text-base">Elevated</CardTitle>
          <CardDescription>Lifts on hover</CardDescription>
        </Card>
        <Card variant="glow" className="p-4">
          <CardTitle className="text-base">Glow</CardTitle>
          <CardDescription>Ambient light bleed</CardDescription>
        </Card>
        <Card variant="glass" className="p-4">
          <CardTitle className="text-base">Glass</CardTitle>
          <CardDescription>Frosted translucency</CardDescription>
        </Card>
        <Card variant="interactive" className="p-4">
          <CardTitle className="text-base">Interactive</CardTitle>
          <CardDescription>Click target</CardDescription>
        </Card>
      </div>
    ),
  },
  {
    name: "Input",
    description: "4 variants: default, glass, glow, underline",
    category: "Forms",
    code: `<Input variant="glow" placeholder="Search..." />`,
    render: () => (
      <div className="space-y-4">
        <div>
          <Label className="mb-2 block">Default Input</Label>
          <Input placeholder="Type here..." />
        </div>
        <div>
          <Label className="mb-2 block">Glass Input</Label>
          <Input variant="glass" placeholder="Frosted glass..." />
        </div>
        <div>
          <Label className="mb-2 block">Glow Input</Label>
          <Input variant="glow" placeholder="Focus for glow..." />
        </div>
        <div>
          <Label className="mb-2 block">Underline Input</Label>
          <Input variant="underline" placeholder="Minimal style..." />
        </div>
      </div>
    ),
  },
  {
    name: "Badge",
    description: "6 variants for labels, statuses, and tags",
    category: "Data Display",
    code: `<Badge variant="glow">New</Badge>`,
    render: () => (
      <div className="flex flex-wrap gap-3">
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="glow">Glow</Badge>
        <Badge variant="glass">Glass</Badge>
      </div>
    ),
  },
  {
    name: "Switch & Checkbox",
    description: "Toggle and checkbox with glow variants",
    category: "Forms",
    code: `<Switch variant="glow" />`,
    render: () => (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Switch id="s1" />
          <Label htmlFor="s1">Default switch</Label>
        </div>
        <div className="flex items-center gap-4">
          <Switch id="s2" variant="glow" defaultChecked />
          <Label htmlFor="s2">Glow switch (active)</Label>
        </div>
        <Separator variant="gradient" />
        <div className="flex items-center gap-4">
          <Checkbox id="c1" />
          <Label htmlFor="c1">Default checkbox</Label>
        </div>
        <div className="flex items-center gap-4">
          <Checkbox id="c2" variant="glow" defaultChecked />
          <Label htmlFor="c2">Glow checkbox (active)</Label>
        </div>
      </div>
    ),
  },
  {
    name: "Slider & Progress",
    description: "Range sliders and progress bars with glow/gradient",
    category: "Forms",
    code: `<Slider variant="glow" defaultValue={[50]} />`,
    render: () => (
      <div className="space-y-8">
        <div className="space-y-2">
          <Label>Default Slider</Label>
          <Slider defaultValue={[40]} max={100} />
        </div>
        <div className="space-y-2">
          <Label>Glow Slider</Label>
          <Slider variant="glow" defaultValue={[70]} max={100} />
        </div>
        <Separator variant="gradient" />
        <div className="space-y-2">
          <Label>Default Progress</Label>
          <Progress value={55} />
        </div>
        <div className="space-y-2">
          <Label>Glow Progress</Label>
          <Progress variant="glow" value={75} />
        </div>
        <div className="space-y-2">
          <Label>Gradient Progress</Label>
          <Progress variant="gradient" value={88} />
        </div>
      </div>
    ),
  },
  {
    name: "Tabs",
    description: "Multiple tab styles: default, glass, pills, underline",
    category: "Navigation",
    code: `<Tabs defaultValue="tab1"><TabsList>...</TabsList></Tabs>`,
    render: () => (
      <div className="space-y-8">
        <Tabs defaultValue="preview">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
            <TabsTrigger value="docs">Docs</TabsTrigger>
          </TabsList>
          <TabsContent value="preview" className="rounded-lg border border-[hsl(var(--aether-border))] p-4 mt-4">
            Preview content here
          </TabsContent>
          <TabsContent value="code" className="rounded-lg border border-[hsl(var(--aether-border))] p-4 mt-4">
            Code content here
          </TabsContent>
          <TabsContent value="docs" className="rounded-lg border border-[hsl(var(--aether-border))] p-4 mt-4">
            Documentation here
          </TabsContent>
        </Tabs>
      </div>
    ),
  },
  {
    name: "Accordion",
    description: "Animated expand/collapse sections",
    category: "Data Display",
    code: `<Accordion type="single"><AccordionItem>...</AccordionItem></Accordion>`,
    render: () => (
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionContent>
            Yes. It adheres to WCAG 2.2 AA+ standards and is fully keyboard navigable.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Is it tree-shakable?</AccordionTrigger>
          <AccordionContent>
            Absolutely. Each component is independently importable. Only what you use ships.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>How do themes work?</AccordionTrigger>
          <AccordionContent>
            Add a data-theme attribute to your root element. All 12 themes are purely CSS.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    ),
  },
  {
    name: "Dialog",
    description: "Modal with glass and glow variants",
    category: "Overlay",
    code: `<Dialog><DialogTrigger asChild><Button>Open</Button></DialogTrigger></Dialog>`,
    render: () => (
      <div className="flex gap-3">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default">Open Default</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Default Dialog</DialogTitle>
              <DialogDescription>This is a standard Aether dialog with smooth animations.</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Input placeholder="Enter something..." />
            </div>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="glow">Open Glow</Button>
          </DialogTrigger>
          <DialogContent variant="glow">
            <DialogHeader>
              <DialogTitle>Glow Dialog</DialogTitle>
              <DialogDescription>A dialog with ambient glow effects.</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    ),
  },
  {
    name: "Avatar",
    description: "User avatars with ring and glow variants",
    category: "Data Display",
    code: `<Avatar variant="glow"><AvatarFallback>AU</AvatarFallback></Avatar>`,
    render: () => (
      <div className="flex items-center gap-4">
        <Avatar size="sm">
          <AvatarFallback>SM</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>MD</AvatarFallback>
        </Avatar>
        <Avatar size="lg" variant="ring">
          <AvatarFallback>LG</AvatarFallback>
        </Avatar>
        <Avatar size="xl" variant="glow">
          <AvatarFallback>XL</AvatarFallback>
        </Avatar>
      </div>
    ),
  },
  {
    name: "Textarea",
    description: "Multiline text input with glass and glow variants",
    category: "Forms",
    code: `<Textarea variant="glow" placeholder="Write..." />`,
    render: () => (
      <div className="space-y-4">
        <Textarea placeholder="Default textarea..." />
        <Textarea variant="glass" placeholder="Glass variant..." />
        <Textarea variant="glow" placeholder="Glow variant..." />
      </div>
    ),
  },
  {
    name: "Separator",
    description: "Visual dividers with gradient and glow styles",
    category: "Layout",
    code: `<Separator variant="gradient" />`,
    render: () => (
      <div className="space-y-8">
        <div>
          <p className="mb-2 text-sm text-[hsl(var(--aether-muted-fg))]">Default</p>
          <Separator />
        </div>
        <div>
          <p className="mb-2 text-sm text-[hsl(var(--aether-muted-fg))]">Gradient</p>
          <Separator variant="gradient" />
        </div>
        <div>
          <p className="mb-2 text-sm text-[hsl(var(--aether-muted-fg))]">Glow</p>
          <Separator variant="glow" />
        </div>
      </div>
    ),
  },
];

// ─── Category Filter ───────────────────────────────────────
const categories = ["All", ...new Set(catalog.map((c) => c.category))];

// ─── Main Showroom Component ──────────────────────────────
export function ComponentShowroom() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = catalog.filter((comp) => {
    const matchesCategory = activeCategory === "All" || comp.category === activeCategory;
    const matchesSearch =
      comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      {/* Search + Filter */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <Input
          variant="glass"
          placeholder="Search components..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-xs"
        />
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-all",
                activeCategory === cat
                  ? "bg-[hsl(var(--aether-primary))] text-[hsl(var(--aether-primary-fg))]"
                  : "bg-[hsl(var(--aether-secondary))] text-[hsl(var(--aether-muted-fg))] hover:text-[hsl(var(--aether-fg))]"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-8">
        <AnimatePresence mode="popLayout">
          {filtered.map((comp) => (
            <motion.div
              key={comp.name}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <Card variant="glass" className="overflow-hidden">
                <CardHeader className="flex flex-row items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-xl">{comp.name}</CardTitle>
                      <Badge variant="glow" className="text-[10px]">{comp.category}</Badge>
                    </div>
                    <CardDescription className="mt-1">{comp.description}</CardDescription>
                  </div>
                </CardHeader>

                <Tabs defaultValue="preview">
                  <div className="border-b border-[hsl(var(--aether-border))] px-6">
                    <TabsList variant="underline">
                      <TabsTrigger value="preview">Preview</TabsTrigger>
                      <TabsTrigger value="code">Code</TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="preview" className="p-6">
                    {comp.render()}
                  </TabsContent>

                  <TabsContent value="code" className="p-6">
                    <div className="overflow-x-auto rounded-lg bg-black/40 p-4 backdrop-blur">
                      <pre className="text-sm">
                        <code className="font-mono text-white/70">{comp.code}</code>
                      </pre>
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
