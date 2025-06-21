'use client';

import { Dialog } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useState } from 'react';

export function ConfirmModal(
  {
    trigger,
    title,
    description,
    children,
  }: {
    trigger: React.ReactNode;
    title: string;
    description?: string;
    children: React.ReactNode;
  }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div onClick={() => setIsOpen(true)}>{trigger}</div>

      <AnimatePresence>
        {isOpen && (
          <Dialog
            as="div"
            static
            open={isOpen}
            onClose={() => setIsOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            <motion.div
              className="fixed inset-0 bg-black/30"
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="z-50 w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Dialog.Title className="text-xl font-semibold">{title}</Dialog.Title>
              {description && (
                <p className="mt-2 text-sm text-gray-600">{description}</p>
              )}

              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  className="rounded border px-3 py-1 text-sm hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </button>

                {children}
              </div>
            </motion.div>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
}
