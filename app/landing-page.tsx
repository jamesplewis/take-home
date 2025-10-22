export function LandingPage() {
  return (
    <div className="flex size-full flex-col items-center justify-center bg-white px-4">
      {/* Google-like Landing Page */}
      <div className="flex size-full flex-col items-center justify-center py-12">
        {/* Logo Area */}
        <div className="mb-12 flex flex-col items-center gap-8">
          <div className="text-6xl font-bold tracking-tight">
            <span className="text-blue-500">G</span>
            <span className="text-red-500">o</span>
            <span className="text-yellow-500">o</span>
            <span className="text-blue-500">g</span>
            <span className="text-green-500">l</span>
            <span className="text-red-500">e</span>
          </div>
        </div>

        {/* Search Box */}
        <div className="mb-8 w-full max-w-2xl">
          <div className="flex rounded-full border border-gray-300 bg-white px-6 py-3 shadow-sm transition-shadow hover:shadow-md">
            <input
              type="text"
              placeholder="Search the web..."
              className="flex-1 text-base text-gray-900 outline-none placeholder:text-gray-500"
            />
            <svg
              className="size-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <button className="rounded-md bg-gray-100 px-6 py-3 font-medium text-gray-900 transition-colors hover:bg-gray-200">
            Google Search
          </button>
          <button className="rounded-md bg-gray-100 px-6 py-3 font-medium text-gray-900 transition-colors hover:bg-gray-200">
            I&apos;m Feeling Lucky
          </button>
        </div>

        {/* Suggestions */}
        <div className="mt-12 text-center text-sm text-gray-600">
          <p className="mb-3">Popular searches:</p>
          <div className="flex flex-wrap justify-center gap-2">
            <button className="rounded px-3 py-1 transition-colors hover:bg-gray-100">
              React tips
            </button>
            <button className="rounded px-3 py-1 transition-colors hover:bg-gray-100">
              TypeScript
            </button>
            <button className="rounded px-3 py-1 transition-colors hover:bg-gray-100">
              Web design
            </button>
            <button className="rounded px-3 py-1 transition-colors hover:bg-gray-100">
              JavaScript
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
