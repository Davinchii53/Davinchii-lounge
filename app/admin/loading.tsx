export default function AdminLoading() {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center space-y-4">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/10 border-t-cyan-500" />
      <p className="font-sans text-sm text-neutral-400">Loading data...</p>
    </div>
  )
}
