'use client';

import { UserMessagesPanel } from '@/components/settings/user-messages-panel';

export default function UserMessagesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">User Messages</h1>
        <p className="mt-1 text-sm text-slate-400">
          Review messages sent by visitors through your landing page contact form.
        </p>
      </div>
      <UserMessagesPanel />
    </div>
  );
}
