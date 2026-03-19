"use client";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <div className="max-w-xl w-full space-y-6 text-center">
        {/* Logo / wordmark */}
        <div className="inline-block border border-black px-3 py-1 text-xs font-medium tracking-widest uppercase">
          Coming Soon
        </div>

        {/* Heading */}
        <h1 className="text-5xl font-semibold tracking-tight text-black leading-tight">
          Something is in the works.
        </h1>

        {/* Subtext */}
        <p className="text-base text-neutral-500 leading-relaxed">
          We&apos;re building something worth waiting for.
          <br />
          Check back soon.
        </p>

        {/* Divider */}
        <div className="border-t border-neutral-200 w-16 mx-auto" />

        {/* Notify form */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col sm:flex-row gap-2 max-w-sm mx-auto"
        >
          <label htmlFor="email" className="sr-only">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="your@email.com"
            className="flex-1 border border-neutral-300 rounded px-3 py-2 text-sm outline-none focus:border-black transition-colors placeholder:text-neutral-400"
          />
          <button
            type="submit"
            className="bg-black text-white text-sm px-4 py-2 rounded hover:bg-neutral-800 transition-colors whitespace-nowrap"
          >
            Notify me
          </button>
        </form>
      </div>
    </main>
  );
}
