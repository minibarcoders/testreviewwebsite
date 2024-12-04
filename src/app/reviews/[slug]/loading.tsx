export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl animate-pulse">
      <div className="aspect-[21/9] w-full rounded-xl bg-gray-200" />
      
      <div className="mt-8 flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          <div className="h-10 w-10 rounded-full bg-gray-200" />
          <div className="space-y-2">
            <div className="h-4 w-24 rounded bg-gray-200" />
            <div className="h-3 w-32 rounded bg-gray-200" />
          </div>
        </div>
        <div className="h-32 w-32 rounded-full bg-gray-200" />
      </div>

      <div className="mt-8 h-8 w-2/3 rounded bg-gray-200" />

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <div className="space-y-4 rounded-lg bg-gray-50 p-6">
          <div className="h-6 w-20 rounded bg-gray-200" />
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-4 w-full rounded bg-gray-200" />
            ))}
          </div>
        </div>

        <div className="space-y-4 rounded-lg bg-gray-50 p-6">
          <div className="h-6 w-20 rounded bg-gray-200" />
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-4 w-full rounded bg-gray-200" />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-4 w-full rounded bg-gray-200" />
        ))}
      </div>
    </div>
  );
}
