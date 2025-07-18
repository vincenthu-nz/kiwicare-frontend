'use client';

import { useActionState, useState } from 'react';
import { lusitana } from '@/app/ui/fonts';
import { AtSymbolIcon, KeyIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from './button';
import { useSearchParams } from 'next/navigation';
import { ExclamationCircleIcon } from '@heroicons/react/16/solid';
import { authenticate } from '@/app/lib/actions';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined);

  return (
    <form action={formAction} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          Please log in to continue.
        </h1>

        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 pr-10 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <AtSymbolIcon
                className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
              {email && (
                <button
                  type="button"
                  onClick={() => setEmail('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  <XMarkIcon className="h-5 w-5"/>
                </button>
              )}
            </div>
          </div>

          <input type="hidden" name="redirectTo" value={callbackUrl}/>

          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 pr-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <KeyIcon
                className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
              {password && (
                <button
                  type="button"
                  onClick={() => setPassword('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  <XMarkIcon className="h-5 w-5"/>
                </button>
              )}
            </div>
          </div>
        </div>

        <Button className="mt-4 w-full" aria-disabled={isPending}>
          Log in <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50"/>
        </Button>

        <div
          className="mt-2 flex h-auto items-start space-x-2"
          aria-live="polite"
          aria-atomic="true"
        >
          {errorMessage && (
            <div className="flex items-start gap-2 pt-2 text-sm text-red-600">
              <ExclamationCircleIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500"/>
              <div>
                <p>{errorMessage}</p>
                <a
                  href="mailto:admin@kiwicare.co.nz"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  Contact administrator
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
