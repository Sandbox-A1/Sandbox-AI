export default function DashboardLoading() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-9 w-64 rounded-lg bg-white/10" />
      <div className="h-4 w-96 rounded bg-white/5" />
      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
        <div className="h-5 w-32 rounded bg-white/10" />
        <div className="mt-3 h-4 w-full max-w-md rounded bg-white/5" />
        <div className="mt-4 flex gap-2">
          <div className="h-10 w-24 rounded-lg bg-white/10" />
          <div className="h-10 w-32 rounded-lg bg-white/10" />
        </div>
      </div>
      <div className="rounded-xl border border-[#333] bg-[#111] p-6">
        <div className="mb-4 h-5 w-40 rounded bg-white/10" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="h-4 w-16 rounded bg-white/5" />
              <div className="h-4 w-24 rounded bg-white/5" />
              <div className="h-4 flex-1 rounded bg-white/5" />
              <div className="h-4 w-20 rounded bg-white/5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
