'use client';

import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { ImageIcon, Loader2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { isValidTemplateMediaUrl } from '@/lib/whatsapp/template-utils';

const ALLOWED_ACCEPT = 'image/jpeg,image/png,image/webp';
const MAX_BYTES = 5 * 1024 * 1024;

interface MarketingImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  headerType?: string | null;
  /** Show manual URL input below the upload button. */
  allowManualUrl?: boolean;
}

export function MarketingImageUpload({
  value,
  onChange,
  headerType = 'image',
  allowManualUrl = true,
}: MarketingImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  async function handleFilePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!ALLOWED_ACCEPT.split(',').includes(file.type)) {
      toast.error('Unsupported image type', {
        description: 'Use JPEG, PNG, or WebP.',
      });
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error('Image is too large', { description: 'Maximum 5 MB.' });
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));

    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/uploads/marketing-image', {
        method: 'POST',
        body: form,
      });
      const data = (await res.json().catch(() => ({}))) as {
        url?: string;
        error?: string;
      };
      if (!res.ok || !data.url) {
        throw new Error(data.error || 'Upload failed');
      }
      onChange(data.url);
      toast.success('Image uploaded');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      toast.error(msg);
      setPreviewUrl(null);
    } finally {
      setUploading(false);
    }
  }

  const displayUrl = value.trim() || previewUrl;
  const urlValid = value.trim() && isValidTemplateMediaUrl(value);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept={ALLOWED_ACCEPT}
          className="hidden"
          onChange={handleFilePick}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="border-slate-700 text-slate-300"
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          {uploading ? 'Uploading…' : 'Upload image'}
        </Button>
        <span className="text-xs text-slate-500">
          JPEG, PNG, or WebP · max 5 MB
        </span>
      </div>

      {allowManualUrl && (
        <div>
          <p className="mb-2 text-xs text-slate-500">
            Or paste a public HTTPS URL (Meta must be able to download it):
          </p>
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://example.com/promo.jpg"
            className="border-slate-700 bg-slate-800 text-white placeholder:text-slate-500"
          />
        </div>
      )}

      {displayUrl && (urlValid || previewUrl) && headerType === 'image' && (
        <div className="overflow-hidden rounded-lg border border-slate-700 bg-slate-950">
          <div className="flex items-center gap-2 border-b border-slate-800 px-3 py-2">
            <ImageIcon className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs text-slate-400">Header preview</span>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={displayUrl}
            alt="Header preview"
            className="max-h-40 w-full object-contain"
          />
        </div>
      )}
    </div>
  );
}
