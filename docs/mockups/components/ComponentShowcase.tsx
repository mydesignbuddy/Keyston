import React, { useState } from 'react';
import { KeystonCard } from './KeystonCard';
import { KeystonButton } from './KeystonButton';
import { KeystonInput } from './KeystonInput';
import { KeystonToggle } from './KeystonToggle';
import { Mail, Lock, Search, Heart } from 'lucide-react';

export function ComponentShowcase() {
  const [toggleState, setToggleState] = useState(false);
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="pb-24 px-4 pt-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-[rgb(var(--foreground))] mb-1">Component Showcase</h1>
          <p className="text-[rgb(var(--foreground-secondary))]">
            All Keystõn design system components
          </p>
        </div>

        {/* Buttons */}
        <KeystonCard className="mb-6">
          <h3 className="text-[rgb(var(--foreground))] mb-4">Buttons</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <KeystonButton variant="primary">Primary</KeystonButton>
              <KeystonButton variant="secondary">Secondary</KeystonButton>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <KeystonButton variant="tertiary">Tertiary</KeystonButton>
              <KeystonButton variant="outline">Outline</KeystonButton>
            </div>
            <KeystonButton variant="ghost" fullWidth>Ghost Button</KeystonButton>
            <div className="grid grid-cols-3 gap-2">
              <KeystonButton variant="primary" size="sm">Small</KeystonButton>
              <KeystonButton variant="primary" size="md">Medium</KeystonButton>
              <KeystonButton variant="primary" size="lg">Large</KeystonButton>
            </div>
            <KeystonButton variant="primary" fullWidth>
              <Heart className="w-5 h-5" />
              With Icon
            </KeystonButton>
          </div>
        </KeystonCard>

        {/* Cards */}
        <KeystonCard className="mb-6">
          <h3 className="text-[rgb(var(--foreground))] mb-4">Cards</h3>
          <div className="space-y-3">
            <KeystonCard>
              <p className="text-[rgb(var(--foreground))]">Standard Card</p>
              <p className="text-sm text-[rgb(var(--foreground-secondary))] mt-1">
                This is a standard card with shadow-sm
              </p>
            </KeystonCard>
            
            <KeystonCard elevated>
              <p className="text-[rgb(var(--foreground))]">Elevated Card</p>
              <p className="text-sm text-[rgb(var(--foreground-secondary))] mt-1">
                This card has elevated styling with stronger shadow
              </p>
            </KeystonCard>
            
            <KeystonCard onClick={() => alert('Card clicked!')}>
              <p className="text-[rgb(var(--foreground))]">Interactive Card</p>
              <p className="text-sm text-[rgb(var(--foreground-secondary))] mt-1">
                Click me! This card has hover and active states
              </p>
            </KeystonCard>
          </div>
        </KeystonCard>

        {/* Inputs */}
        <KeystonCard className="mb-6">
          <h3 className="text-[rgb(var(--foreground))] mb-4">Input Fields</h3>
          <div className="space-y-4">
            <KeystonInput
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            
            <KeystonInput
              label="Password"
              type="password"
              placeholder="Enter your password"
              icon={<Lock className="w-5 h-5" />}
            />
            
            <KeystonInput
              placeholder="Search..."
              icon={<Search className="w-5 h-5" />}
            />
            
            <KeystonInput
              label="With Error"
              placeholder="Invalid input"
              error="This field is required"
            />
          </div>
        </KeystonCard>

        {/* Toggles */}
        <KeystonCard className="mb-6">
          <h3 className="text-[rgb(var(--foreground))] mb-4">Toggle Switches</h3>
          <div className="space-y-4">
            <KeystonToggle
              checked={toggleState}
              onChange={setToggleState}
              label="Enable notifications"
            />
            
            <KeystonToggle
              checked={true}
              onChange={() => {}}
              label="Always enabled"
            />
            
            <KeystonToggle
              checked={false}
              onChange={() => {}}
              label="Disabled toggle"
              disabled
            />
          </div>
        </KeystonCard>

        {/* Color Palette */}
        <KeystonCard className="mb-6">
          <h3 className="text-[rgb(var(--foreground))] mb-4">Color Palette</h3>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-[rgb(var(--foreground-secondary))] mb-2">Brand Colors</p>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <div className="h-16 rounded-lg bg-[rgb(var(--primary))] mb-2"></div>
                  <p className="text-xs text-[rgb(var(--foreground-secondary))]">Primary</p>
                </div>
                <div>
                  <div className="h-16 rounded-lg bg-[rgb(var(--secondary))] mb-2"></div>
                  <p className="text-xs text-[rgb(var(--foreground-secondary))]">Secondary</p>
                </div>
                <div>
                  <div className="h-16 rounded-lg bg-[rgb(var(--tertiary))] mb-2"></div>
                  <p className="text-xs text-[rgb(var(--foreground-secondary))]">Tertiary</p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm text-[rgb(var(--foreground-secondary))] mb-2">Chart Colors</p>
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <div className="h-16 rounded-lg bg-[rgb(var(--chart-protein))] mb-2"></div>
                  <p className="text-xs text-[rgb(var(--foreground-secondary))]">Protein</p>
                </div>
                <div>
                  <div className="h-16 rounded-lg bg-[rgb(var(--chart-carbs))] mb-2"></div>
                  <p className="text-xs text-[rgb(var(--foreground-secondary))]">Carbs</p>
                </div>
                <div>
                  <div className="h-16 rounded-lg bg-[rgb(var(--chart-fat))] mb-2"></div>
                  <p className="text-xs text-[rgb(var(--foreground-secondary))]">Fat</p>
                </div>
                <div>
                  <div className="h-16 rounded-lg bg-[rgb(var(--chart-fiber))] mb-2"></div>
                  <p className="text-xs text-[rgb(var(--foreground-secondary))]">Fiber</p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm text-[rgb(var(--foreground-secondary))] mb-2">Semantic Colors</p>
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <div className="h-16 rounded-lg bg-[rgb(var(--success))] mb-2"></div>
                  <p className="text-xs text-[rgb(var(--foreground-secondary))]">Success</p>
                </div>
                <div>
                  <div className="h-16 rounded-lg bg-[rgb(var(--warning))] mb-2"></div>
                  <p className="text-xs text-[rgb(var(--foreground-secondary))]">Warning</p>
                </div>
                <div>
                  <div className="h-16 rounded-lg bg-[rgb(var(--error))] mb-2"></div>
                  <p className="text-xs text-[rgb(var(--foreground-secondary))]">Error</p>
                </div>
                <div>
                  <div className="h-16 rounded-lg bg-[rgb(var(--info))] mb-2"></div>
                  <p className="text-xs text-[rgb(var(--foreground-secondary))]">Info</p>
                </div>
              </div>
            </div>
          </div>
        </KeystonCard>

        {/* Typography */}
        <KeystonCard>
          <h3 className="text-[rgb(var(--foreground))] mb-4">Typography</h3>
          <div className="space-y-3">
            <div>
              <h1 className="text-[rgb(var(--foreground))]">Heading 1</h1>
              <p className="text-xs text-[rgb(var(--foreground-tertiary))]">2rem • Bold</p>
            </div>
            <div>
              <h2 className="text-[rgb(var(--foreground))]">Heading 2</h2>
              <p className="text-xs text-[rgb(var(--foreground-tertiary))]">1.5rem • Bold</p>
            </div>
            <div>
              <h3 className="text-[rgb(var(--foreground))]">Heading 3</h3>
              <p className="text-xs text-[rgb(var(--foreground-tertiary))]">1.25rem • Semibold</p>
            </div>
            <div>
              <p className="text-[rgb(var(--foreground))]">Body text - Regular paragraph</p>
              <p className="text-xs text-[rgb(var(--foreground-tertiary))]">1rem • Regular</p>
            </div>
            <div>
              <p className="text-[rgb(var(--foreground-secondary))]">Secondary text</p>
              <p className="text-xs text-[rgb(var(--foreground-tertiary))]">Muted foreground</p>
            </div>
            <div>
              <small className="text-[rgb(var(--foreground-tertiary))]">Small text</small>
              <p className="text-xs text-[rgb(var(--foreground-tertiary))]">0.875rem • Regular</p>
            </div>
          </div>
        </KeystonCard>
      </div>
    </div>
  );
}