'use client';

import { StoreSettingsForm } from '@/components/dashboard/store-settings-form';
import { Separator } from '@/components/ui/separator';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Store Settings</h2>
        <p className="text-muted-foreground">
          Manage your store details, SEO preferences, and social media connections.
        </p>
      </div>
      <Separator />
      <div className="max-w-4xl">
        <StoreSettingsForm />
      </div>
    </div>
  );
}
