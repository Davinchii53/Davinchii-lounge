'use client'

type Adjustment = {
  id: string
  created_at: string
  type: string
  seconds_delta: number
  note: string | null
}

export default function BalanceHistory({ adjustments }: { adjustments: Adjustment[] }) {
  const formatDelta = (seconds: number) => {
    const isPositive = seconds > 0
    const sign = isPositive ? '+' : '-'
    const abs = Math.abs(seconds)
    const m = Math.floor(abs / 60)
    const s = abs % 60
    return `${sign}${m}m ${s}s`
  }

  const formatType = (type: string) => {
    return type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  }

  return (
    <div className="space-y-4 rounded-xl border border-white/5 bg-neutral-900/50 p-6 backdrop-blur-sm">
      <h2 className="text-sm font-semibold tracking-wide text-neutral-400 uppercase">Recent Activity</h2>
      
      {adjustments.length === 0 ? (
        <p className="text-sm text-neutral-500">No recent activity.</p>
      ) : (
        <div className="divide-y divide-white/5">
          {adjustments.map((adj) => (
            <div key={adj.id} className="py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-200">{formatType(adj.type)}</p>
                <p className="text-xs text-neutral-500" suppressHydrationWarning>
                  {new Date(adj.created_at).toLocaleDateString()} at {new Date(adj.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p>
              </div>
              <div className={`text-sm font-mono font-medium ${adj.seconds_delta > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatDelta(adj.seconds_delta)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
