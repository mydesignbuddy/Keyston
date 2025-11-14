import React, { useState } from 'react';
import { KeystonCard } from '../KeystonCard';
import { KeystonButton } from '../KeystonButton';
import { KeystonInput } from '../KeystonInput';
import { Scan, Search, Camera, History } from 'lucide-react';

export function FoodScannerScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const recentScans = [
    { name: 'Banana', brand: 'Fresh Produce', calories: 105, time: '2 hours ago' },
    { name: 'Greek Yogurt', brand: 'Chobani', calories: 130, time: 'Yesterday' },
    { name: 'Protein Bar', brand: 'Quest', calories: 200, time: '2 days ago' },
  ];

  const popularFoods = [
    { name: 'Chicken Breast', calories: 165, serving: '100g' },
    { name: 'Brown Rice', calories: 216, serving: '1 cup' },
    { name: 'Broccoli', calories: 55, serving: '1 cup' },
    { name: 'Salmon', calories: 206, serving: '100g' },
  ];

  return (
    <div className="pb-24 px-4 pt-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[rgb(var(--foreground))] mb-1">Food Scanner</h1>
          <p className="text-[rgb(var(--foreground-secondary))]">
            Scan barcodes or search for foods
          </p>
        </div>

        {/* Scanner Card */}
        <KeystonCard className="mb-6" elevated>
          <div className="text-center py-8">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-[rgb(var(--primary))] to-[rgb(var(--secondary))] flex items-center justify-center">
              <Scan className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-[rgb(var(--foreground))] mb-2">Scan a Barcode</h3>
            <p className="text-sm text-[rgb(var(--foreground-secondary))] mb-4">
              Point your camera at a food product barcode
            </p>
            <KeystonButton variant="primary">
              <Camera className="w-5 h-5" />
              Open Camera
            </KeystonButton>
          </div>
        </KeystonCard>

        {/* Search */}
        <div className="mb-6">
          <KeystonInput
            placeholder="Search for food..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-5 h-5" />}
          />
        </div>

        {/* Recent Scans */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <History className="w-5 h-5 text-[rgb(var(--foreground-secondary))]" />
            <h3 className="text-[rgb(var(--foreground))]">Recent Scans</h3>
          </div>
          <div className="space-y-3">
            {recentScans.map((item, idx) => (
              <KeystonCard 
                key={idx}
                className="flex items-center justify-between cursor-pointer hover:shadow-md active:scale-[0.98] transition-all"
              >
                <div className="flex-1">
                  <p className="text-[rgb(var(--foreground))]">{item.name}</p>
                  <p className="text-sm text-[rgb(var(--foreground-secondary))]">{item.brand}</p>
                </div>
                <div className="text-right">
                  <p className="text-[rgb(var(--foreground))]">{item.calories} cal</p>
                  <p className="text-sm text-[rgb(var(--foreground-tertiary))]">{item.time}</p>
                </div>
              </KeystonCard>
            ))}
          </div>
        </div>

        {/* Popular Foods */}
        <div>
          <h3 className="text-[rgb(var(--foreground))] mb-3">Popular Foods</h3>
          <div className="grid grid-cols-2 gap-3">
            {popularFoods.map((food, idx) => (
              <KeystonCard 
                key={idx}
                className="cursor-pointer hover:shadow-md active:scale-95 transition-all"
              >
                <div className="text-center">
                  <p className="text-[rgb(var(--foreground))] mb-1">{food.name}</p>
                  <p className="text-sm text-[rgb(var(--foreground-secondary))] mb-2">{food.serving}</p>
                  <div className="inline-block px-3 py-1 rounded-full bg-[rgb(var(--primary))]20">
                    <p className="text-sm text-[rgb(var(--primary))]">{food.calories} cal</p>
                  </div>
                </div>
              </KeystonCard>
            ))}
          </div>
        </div>

        {/* Info Card */}
        <KeystonCard className="mt-6 bg-gradient-to-r from-[rgb(var(--info))] to-[rgb(var(--primary))]">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Scan className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-white mb-1">Scan any food product</p>
              <p className="text-sm text-white/80">
                Get instant nutrition info from our database of over 1M foods
              </p>
            </div>
          </div>
        </KeystonCard>
      </div>
    </div>
  );
}
