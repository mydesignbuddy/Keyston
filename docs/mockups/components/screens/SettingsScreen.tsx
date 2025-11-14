import React from 'react';
import { KeystonCard } from '../KeystonCard';
import { KeystonToggle } from '../KeystonToggle';
import { useTheme } from '../ThemeProvider';
import { Moon, Sun, Bell, Shield, Info, Heart } from 'lucide-react';

export function SettingsScreen() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="pb-24 px-4 pt-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[rgb(var(--foreground))] mb-1">Settings</h1>
          <p className="text-[rgb(var(--foreground-secondary))]">
            Customize your Keystõn experience
          </p>
        </div>

        {/* Appearance */}
        <div className="mb-6">
          <h3 className="text-[rgb(var(--foreground))] mb-3">Appearance</h3>
          <KeystonCard>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[rgb(var(--primary))]20">
                  {theme === 'dark' ? (
                    <Moon className="w-5 h-5 text-[rgb(var(--primary))]" />
                  ) : (
                    <Sun className="w-5 h-5 text-[rgb(var(--primary))]" />
                  )}
                </div>
                <div>
                  <p className="text-[rgb(var(--foreground))]">Dark Mode</p>
                  <p className="text-sm text-[rgb(var(--foreground-secondary))]">
                    {theme === 'dark' ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
              </div>
              <KeystonToggle
                checked={theme === 'dark'}
                onChange={toggleTheme}
              />
            </div>
          </KeystonCard>
        </div>

        {/* Notifications */}
        <div className="mb-6">
          <h3 className="text-[rgb(var(--foreground))] mb-3">Notifications</h3>
          <KeystonCard>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[rgb(var(--secondary))]20">
                    <Bell className="w-5 h-5 text-[rgb(var(--secondary))]" />
                  </div>
                  <div>
                    <p className="text-[rgb(var(--foreground))]">Meal Reminders</p>
                    <p className="text-sm text-[rgb(var(--foreground-secondary))]">
                      Get reminded to log your meals
                    </p>
                  </div>
                </div>
                <KeystonToggle
                  checked={true}
                  onChange={() => {}}
                />
              </div>

              <div className="h-px bg-[rgb(var(--border))]"></div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[rgb(var(--tertiary))]20">
                    <Bell className="w-5 h-5 text-[rgb(var(--tertiary))]" />
                  </div>
                  <div>
                    <p className="text-[rgb(var(--foreground))]">Workout Reminders</p>
                    <p className="text-sm text-[rgb(var(--foreground-secondary))]">
                      Stay on track with your fitness
                    </p>
                  </div>
                </div>
                <KeystonToggle
                  checked={false}
                  onChange={() => {}}
                />
              </div>
            </div>
          </KeystonCard>
        </div>

        {/* Privacy */}
        <div className="mb-6">
          <h3 className="text-[rgb(var(--foreground))] mb-3">Privacy</h3>
          <KeystonCard className="bg-gradient-to-r from-[rgb(var(--success))] to-[rgb(var(--info))]">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white mb-1">Your data stays private</p>
                <p className="text-sm text-white/90">
                  All your health data is stored locally on your device. We don't track you or share your information with anyone.
                </p>
              </div>
            </div>
          </KeystonCard>
        </div>

        {/* About */}
        <div className="mb-6">
          <h3 className="text-[rgb(var(--foreground))] mb-3">About</h3>
          <div className="space-y-3">
            <KeystonCard className="flex items-center justify-between cursor-pointer hover:shadow-md active:scale-[0.98] transition-all">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[rgb(var(--border))]">
                  <Info className="w-5 h-5 text-[rgb(var(--foreground-secondary))]" />
                </div>
                <div>
                  <p className="text-[rgb(var(--foreground))]">App Version</p>
                  <p className="text-sm text-[rgb(var(--foreground-secondary))]">1.0.0</p>
                </div>
              </div>
            </KeystonCard>

            <KeystonCard className="flex items-center justify-between cursor-pointer hover:shadow-md active:scale-[0.98] transition-all">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[rgb(var(--border))]">
                  <Heart className="w-5 h-5 text-[rgb(var(--error))]" />
                </div>
                <div>
                  <p className="text-[rgb(var(--foreground))]">Support the Project</p>
                  <p className="text-sm text-[rgb(var(--foreground-secondary))]">Help us improve Keystõn</p>
                </div>
              </div>
            </KeystonCard>
          </div>
        </div>

        {/* Data Management */}
        <div>
          <h3 className="text-[rgb(var(--foreground))] mb-3">Data Management</h3>
          <KeystonCard>
            <div className="space-y-4">
              <button className="w-full text-left py-2 text-[rgb(var(--primary))]">
                Export Data
              </button>
              
              <div className="h-px bg-[rgb(var(--border))]"></div>
              
              <button className="w-full text-left py-2 text-[rgb(var(--error))]">
                Clear All Data
              </button>
            </div>
          </KeystonCard>
        </div>
      </div>
    </div>
  );
}
