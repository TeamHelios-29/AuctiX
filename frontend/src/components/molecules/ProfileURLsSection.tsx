'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  FormDescription,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface UrlEntry {
  id: number;
  value: string;
  timestamp: number;
}

interface ProfileUrlsSectionProps {
  onChange?: (urls: { value: string; timestamp: number }[]) => void;
}

export function ProfileUrlsSection({ onChange }: ProfileUrlsSectionProps) {
  const [urls, setUrls] = useState<UrlEntry[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const idCounter = useRef(0);
  const urlContainerRef = useRef<HTMLDivElement>(null);

  const handleAppend = () => {
    if (isAdding) return;

    const newEntry: UrlEntry = {
      id: idCounter.current++,
      value: '',
      timestamp: Date.now(),
    };

    setUrls((prev) => [...prev, newEntry]);
    setIsAdding(true);

    setTimeout(() => {
      const inputs = urlContainerRef?.current?.querySelectorAll('input');
      inputs?.[inputs.length - 1]?.focus();
      setIsAdding(false);
    }, 100);
  };

  const handleRemove = (id: number) => {
    setUrls((prev) => prev.filter((url) => url.id !== id));
  };

  const handleChange = (id: number, value: string) => {
    setUrls((prev) =>
      prev.map((url) => (url.id === id ? { ...url, value } : url)),
    );
  };

  useEffect(() => {
    if (onChange) {
      onChange(urls.map(({ value, timestamp }) => ({ value, timestamp })));
    }
  }, [urls, onChange]);

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Social Media & Websites</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="border-yellow-500 text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700"
          onClick={handleAppend}
          disabled={isAdding}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add URL
        </Button>
      </div>

      <FormDescription>
        Add links to your website, blog, or social media profiles.
      </FormDescription>

      <div ref={urlContainerRef} className="space-y-3">
        <AnimatePresence initial={false}>
          {urls.map((url, index) => (
            <motion.div
              key={url.id}
              className="flex items-start gap-2 group"
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{
                opacity: 1,
                height: 'auto',
                marginBottom: 12,
                transition: {
                  opacity: { duration: 0.3 },
                  height: { duration: 0.3 },
                },
              }}
              exit={{
                opacity: 0,
                height: 0,
                marginBottom: 0,
                transition: {
                  opacity: { duration: 0.2 },
                  height: { duration: 0.2 },
                },
              }}
              layout
            >
              <div className="flex-shrink-0 text-yellow-500 mt-5">
                <LinkIcon className="h-5 w-5" />
              </div>
              <FormItem className="flex-1 mt-5">
                <FormControl>
                  <Input
                    value={url.value}
                    onChange={(e) => handleChange(url.id, e.target.value)}
                    placeholder="https://example.com"
                    className="transition-all focus-within:border-yellow-500 focus-within:ring-yellow-500/20"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="mt-5 h-10 w-10 flex-shrink-0 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-yellow-600 hover:bg-yellow-50"
                onClick={() => handleRemove(url.id)}
                aria-label="Remove URL"
              >
                <X className="h-4 w-4" />
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>

        {urls.length === 0 && (
          <motion.div
            className="text-center py-6 border-2 border-dashed border-gray-200 rounded-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-gray-500 mb-2">No URLs added yet</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-yellow-500 text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700"
              onClick={handleAppend}
              disabled={isAdding}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add your first URL
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
