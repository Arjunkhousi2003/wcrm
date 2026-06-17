'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader2, Mail, MessageSquareText, Phone, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { UserMessage } from '@/types';

export function UserMessagesPanel() {
  const [messages, setMessages] = useState<UserMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/user-messages', { method: 'GET' });
      const body = (await response.json()) as {
        error?: string;
        messages?: UserMessage[];
      };

      if (!response.ok) {
        throw new Error(body.error ?? 'Failed to load messages');
      }

      setMessages(body.messages ?? []);
    } catch (err) {
      console.error('Failed to load landing contact messages:', err);
      setError(err instanceof Error ? err.message : 'Failed to load messages');
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return (
    <div className="space-y-6">
      <Card className="bg-slate-900/40 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Landing Page Contact Messages</CardTitle>
          <CardDescription className="text-slate-400">
            Messages submitted through the &quot;Send us a Message&quot; section on your home page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="rounded-lg border border-red-900/40 bg-red-950/40 px-3 py-2 text-sm text-red-200">
              {error}
            </div>
          ) : null}
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="size-5 animate-spin text-primary" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
              <MessageSquareText className="size-8 text-slate-600" />
              <p className="text-sm text-slate-400">No contact messages yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-3"
                >
                  <div className="grid gap-2 text-sm sm:grid-cols-2">
                    <p className="flex items-center gap-2 text-slate-300">
                      <User className="size-4 text-slate-500" />
                      {item.full_name}
                    </p>
                    <p className="flex items-center gap-2 text-slate-300">
                      <Mail className="size-4 text-slate-500" />
                      {item.email}
                    </p>
                    <p className="flex items-center gap-2 text-slate-400 sm:col-span-2">
                      <Phone className="size-4 text-slate-500" />
                      {item.phone || 'Not provided'}
                    </p>
                  </div>
                  <p className="mt-3 text-xs font-medium uppercase tracking-wide text-slate-500">
                    Subject
                  </p>
                  <p className="text-sm text-slate-200">{item.subject}</p>
                  <p className="mt-3 text-xs font-medium uppercase tracking-wide text-slate-500">
                    Message
                  </p>
                  <p className="whitespace-pre-wrap text-sm text-slate-200">
                    {item.message}
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    {new Date(item.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
