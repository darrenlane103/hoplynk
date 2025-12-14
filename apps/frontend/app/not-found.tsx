import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center max-w-md p-8">
        <div className="mb-6">
          <h2 className="mb-3 text-2xl font-bold text-gray-900">Page Not Found</h2>
          <p className="mb-2 text-gray-600">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>
        <Link
          href="/"
          className="inline-block rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 transition-colors font-medium shadow-sm"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}

