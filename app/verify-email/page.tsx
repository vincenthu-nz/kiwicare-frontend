import { verifyEmailByToken } from '../lib/actions';
import Link from 'next/link';
import Image from 'next/image';

export default async function Page({ searchParams }: { searchParams?: any }) {
  const token = searchParams?.token ?? '';

  let result;
  if (token) {
    result = await verifyEmailByToken(token);
  } else {
    result = { status: 'error', message: 'No verification token provided.' };
  }

  const isSuccess = result.status === 'success';

  return (
    <div className="flex min-h-[100vh] items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-lg">
        <div className="flex justify-center">
          <Image
            src="/kiwicare-black.png"
            alt="Kiwicare"
            width={96}
            height={96}
            className="h-16 w-16 md:h-24 md:w-24"
          />
        </div>

        <h1 className="mb-4 text-center text-2xl font-bold">
          {isSuccess ? 'Email Verified' : 'Email Verification Failed'}
        </h1>

        <p
          className={`mb-6 text-center ${isSuccess ? 'text-green-600' : 'text-red-600'}`}
        >
          {isSuccess ? (
            <>
              Your email <strong>{result.email}</strong> has been successfully
              verified. You can now log in.
            </>
          ) : (
            <>{result.message}</>
          )}
        </p>

        <div className="flex justify-center">
          {isSuccess ? (
            <Link
              href="/login"
              className="inline-block rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
            >
              Go to Login
            </Link>
          ) : (
            <Link
              href="/"
              className="inline-block rounded bg-gray-600 px-4 py-2 text-white transition hover:bg-gray-700"
            >
              Back to Home
            </Link>
          )}
        </div>
        <p className="pt-5 text-center text-xs text-gray-400">
          &copy; 2025 KiwiCare
        </p>
      </div>
    </div>
  );
}
