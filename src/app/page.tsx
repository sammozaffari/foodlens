'use client';

import {
  Button,
  Input,
  Badge,
  Card,
  Display,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Body,
  BodySmall,
  Caption,
  Mono,
  MonoLarge,
} from '@/components/atoms';

export default function DesignSystemPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12 space-y-16">
      {/* Color Palette */}
      <section>
        <Heading1>Color Palette</Heading1>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <ColorSwatch name="Background" className="bg-background border border-border" />
          <ColorSwatch name="Surface" className="bg-surface" />
          <ColorSwatch name="Surface Raised" className="bg-surface-raised" />
          <ColorSwatch name="Primary" className="bg-primary" textLight />
          <ColorSwatch name="Primary Hover" className="bg-primary-hover" textLight />
          <ColorSwatch name="Primary Muted" className="bg-primary-muted" />
          <ColorSwatch name="Success" className="bg-success" textLight />
          <ColorSwatch name="Success Muted" className="bg-success-muted" />
          <ColorSwatch name="Warning" className="bg-warning" />
          <ColorSwatch name="Warning Muted" className="bg-warning-muted" />
          <ColorSwatch name="Error" className="bg-error" textLight />
          <ColorSwatch name="Error Muted" className="bg-error-muted" />
          <ColorSwatch name="Info" className="bg-info" textLight />
          <ColorSwatch name="Info Muted" className="bg-info-muted" />
          <ColorSwatch name="Border" className="bg-border" />
          <ColorSwatch name="Border Strong" className="bg-border-strong" />
        </div>
      </section>

      {/* Typography */}
      <section>
        <Heading1>Typography</Heading1>
        <div className="mt-6 space-y-4">
          <Display>Display — 40px / Bold</Display>
          <Heading1>Heading 1 — 32px / Bold</Heading1>
          <Heading2>Heading 2 — 24px / Semibold</Heading2>
          <Heading3>Heading 3 — 20px / Semibold</Heading3>
          <Heading4>Heading 4 — 18px / Semibold</Heading4>
          <Body>Body — 16px / Regular. The quick brown fox jumps over the lazy dog. This is standard body text used for paragraphs and general content.</Body>
          <BodySmall>Body Small — 14px / Regular. Secondary body text for less prominent content.</BodySmall>
          <Caption>Caption — 12px / Medium. Labels and metadata.</Caption>
          <div>
            <Mono>Mono — 14px / 2,300mg sodium / 45g sugar</Mono>
          </div>
          <div>
            <MonoLarge>MonoLarge — 20px / 1,847 kcal</MonoLarge>
          </div>
        </div>
      </section>

      {/* Buttons */}
      <section>
        <Heading1>Buttons</Heading1>

        <div className="mt-6 space-y-8">
          {/* Primary */}
          <div>
            <Heading3 className="mb-3">Primary</Heading3>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
              <Button disabled>Disabled</Button>
              <Button loading>Loading</Button>
              <Button fullWidth>Full Width</Button>
            </div>
          </div>

          {/* Secondary */}
          <div>
            <Heading3 className="mb-3">Secondary</Heading3>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="secondary" size="sm">Small</Button>
              <Button variant="secondary" size="md">Medium</Button>
              <Button variant="secondary" size="lg">Large</Button>
              <Button variant="secondary" disabled>Disabled</Button>
              <Button variant="secondary" loading>Loading</Button>
            </div>
          </div>

          {/* Ghost */}
          <div>
            <Heading3 className="mb-3">Ghost</Heading3>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="ghost" size="sm">Small</Button>
              <Button variant="ghost" size="md">Medium</Button>
              <Button variant="ghost" size="lg">Large</Button>
              <Button variant="ghost" disabled>Disabled</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Badges */}
      <section>
        <Heading1>Badges</Heading1>
        <div className="mt-6 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Badge size="sm">Default SM</Badge>
            <Badge size="sm" variant="success">Success SM</Badge>
            <Badge size="sm" variant="warning">Warning SM</Badge>
            <Badge size="sm" variant="error">Error SM</Badge>
            <Badge size="sm" variant="info">Info SM</Badge>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge>Default MD</Badge>
            <Badge variant="success">Success MD</Badge>
            <Badge variant="warning">Warning MD</Badge>
            <Badge variant="error">Error MD</Badge>
            <Badge variant="info">Info MD</Badge>
          </div>
        </div>
      </section>

      {/* Cards */}
      <section>
        <Heading1>Cards</Heading1>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Card variant="flat">
            <Heading3>Flat Card</Heading3>
            <Body className="mt-2 text-text-muted">Background surface with a subtle border. Used for grouping related content.</Body>
          </Card>
          <Card variant="elevated">
            <Heading3>Elevated Card</Heading3>
            <Body className="mt-2 text-text-muted">White background with shadow elevation. Used for primary content areas.</Body>
          </Card>
          <Card variant="flat" padding="sm">
            <BodySmall>Flat / Padding SM</BodySmall>
          </Card>
          <Card variant="elevated" padding="lg">
            <BodySmall>Elevated / Padding LG</BodySmall>
          </Card>
        </div>
      </section>

      {/* Inputs */}
      <section>
        <Heading1>Inputs</Heading1>
        <div className="mt-6 max-w-md space-y-6">
          <Input label="Default Input" placeholder="Enter a value..." hint="This is a hint message" />
          <Input label="Large Input" size="lg" placeholder="Larger touch target..." />
          <Input label="With Error" error="This field is required" placeholder="Something wrong..." />
          <Input label="Disabled" disabled placeholder="Cannot edit..." />
          <Input label="Full Width" fullWidth placeholder="Takes full container width..." />
        </div>
      </section>

      {/* Focus demo */}
      <section>
        <Heading1>Focus States</Heading1>
        <Body className="mt-2 text-text-muted">Tab through the elements below to see focus rings.</Body>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button>Tab to me</Button>
          <Button variant="secondary">And me</Button>
          <Button variant="ghost">Me too</Button>
        </div>
      </section>
    </main>
  );
}

function ColorSwatch({ name, className, textLight = false }: { name: string; className: string; textLight?: boolean }) {
  return (
    <div className={`rounded-lg p-3 h-20 flex items-end ${className}`}>
      <span className={`text-xs font-medium ${textLight ? 'text-white' : 'text-text'}`}>
        {name}
      </span>
    </div>
  );
}
