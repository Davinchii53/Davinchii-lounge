'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'

type Pod = {
  id: string
  label: string
  zone: string
  specs: string | null
}

type ActiveSession = {
  id: string
  pod_id: string
  started_at: string
  podLabel: string | null
  podZone: string | null
  podSpecs: string | null
  time_balance_seconds: number
}

export default function SessionPanel({
  activeSession,
  idlePods,
}: {
  activeSession: ActiveSession | null
  idlePods: Pod[]
}) {
  const [selectedPod, setSelectedPod] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!activeSession) return
    const start = new Date(activeSession.started_at).getTime()
    
    const interval = setInterval(() => {
      const now = Date.now()
      setElapsed(Math.floor((now - start) / 1000))
    }, 1000)

    return () => clearInterval(interval)
  }, [activeSession])

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600)
    const m = Math.floor((totalSeconds % 3600) / 60)
    const s = totalSeconds % 60
    if (h > 0) return `${h}h ${m}m ${s}s`
    return `${m}m ${s}s`
  }

  const handleStart = async () => {
    if (!selectedPod) return
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { error: startError } = await supabase.rpc('start_session', {
      p_pod_id: selectedPod,
      p_customer_id: user?.id,
    })

    if (startError) {
      setError(startError.message)
      setLoading(false)
      return
    }

    setLoading(false)
    router.refresh()
  }

  const handleClose = async () => {
    if (!activeSession) return
    try {
      setError('')
      setLoading(true)

      const supabase = createClient()
      const { error: closeError } = await supabase.rpc('close_session', {
        p_session_id: activeSession.id,
        p_reason: 'manual',
      })

      if (closeError) {
        setError(closeError.message)
        setLoading(false)
        return
      }

      setLoading(false)
      router.refresh()
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred')
      setLoading(false)
    }
  }

  const getZoneColor = (zone: string | null) => {
    switch (zone) {
      case 'vip': return 'bg-purple-500/20 text-purple-400 border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.4)]'
      case 'console': return 'bg-orange-500/20 text-orange-400 border-orange-500/50 shadow-[0_0_10px_rgba(249,115,22,0.4)]'
      default: return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
    }
  }

  if (activeSession) {
    const remainingSeconds = Math.max(0, activeSession.time_balance_seconds - elapsed)
    
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 rounded-2xl border border-cyan-500/30 bg-black/60 p-6 shadow-[0_0_30px_rgba(6,182,212,0.15)] backdrop-blur-xl relative overflow-hidden group"
      >
        {/* Cyberpunk grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-50"></div>
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/20 rounded-full blur-[60px] -mr-10 -mt-10 pointer-events-none group-hover:bg-cyan-500/30 transition-all duration-700"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/20 rounded-full blur-[50px] -ml-10 -mb-10 pointer-events-none"></div>
        
        <div className="flex items-center justify-between relative z-10">
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] text-cyan-500 uppercase mb-2">System Active</p>
            <div className="flex items-center space-x-3">
              <h3 className="text-3xl font-black text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] tracking-tight">{activeSession.podLabel ?? 'Unknown pod'}</h3>
              {activeSession.podZone && (
                <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-sm border ${getZoneColor(activeSession.podZone)}`}>
                  {activeSession.podZone}
                </span>
              )}
            </div>
            {activeSession.podSpecs && <p className="text-xs text-neutral-400 mt-2 font-mono">{activeSession.podSpecs}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 py-6 border-y border-white/10 relative z-10">
          <div>
            <p className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase mb-2">Elapsed</p>
            <p className="text-2xl font-mono font-medium text-neutral-300">{formatTime(elapsed)}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase mb-2">Remaining</p>
            <p className={`text-2xl font-mono font-bold drop-shadow-md ${remainingSeconds < 300 ? 'text-red-400 drop-shadow-[0_0_10px_rgba(248,113,113,0.5)]' : 'text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]'}`}>
              {formatTime(remainingSeconds)}
            </p>
          </div>
        </div>

        {error && <p className="text-sm text-red-400 relative z-10 font-medium bg-red-500/10 p-2 rounded border border-red-500/20">{error}</p>}
        
        <button
          onClick={handleClose}
          disabled={loading}
          className="w-full rounded-lg bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-500/50 py-3 text-sm font-bold uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-50 relative z-10 shadow-[0_0_15px_rgba(220,38,38,0.2)] hover:shadow-[0_0_25px_rgba(220,38,38,0.4)]"
        >
          {loading ? 'Disengaging...' : 'End Session'}
        </button>
      </motion.div>
    )
  }

  const podsByZone = idlePods.reduce((acc, pod) => {
    if (!acc[pod.zone]) acc[pod.zone] = []
    acc[pod.zone].push(pod)
    return acc
  }, {} as Record<string, Pod[]>)

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5 rounded-2xl border border-white/10 bg-black/60 p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-50"></div>
      
      <p className="text-[10px] font-bold tracking-[0.2em] text-neutral-400 uppercase relative z-10">Initialize System</p>

      {idlePods.length === 0 ? (
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-4 text-center relative z-10">
          <p className="text-sm font-mono text-red-400">Error: No systems available.</p>
        </div>
      ) : (
        <div className="relative z-10">
          <select
            value={selectedPod}
            onChange={(e) => setSelectedPod(e.target.value)}
            className="w-full rounded-lg border border-cyan-500/30 bg-black/80 px-4 py-3.5 text-sm font-medium text-cyan-50 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 appearance-none shadow-[inset_0_0_20px_rgba(6,182,212,0.05)] transition-all"
          >
            <option value="" className="bg-neutral-900">Select a Pod to Initialize...</option>
            {Object.entries(podsByZone).map(([zone, pods]) => (
              <optgroup key={zone} label={`[ ${zone.toUpperCase()} ZONE ]`} className="bg-neutral-900 font-bold text-neutral-400">
                {pods.map((pod) => (
                  <option key={pod.id} value={pod.id} className="text-white font-normal">
                    {pod.label} {pod.specs ? `// ${pod.specs}` : ''}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      )}

      {error && <p className="text-sm text-red-400 bg-red-500/10 p-2 rounded border border-red-500/20 relative z-10">{error}</p>}

      <button
        onClick={handleStart}
        disabled={loading || !selectedPod}
        className="relative z-10 w-full rounded-lg bg-cyan-500 px-4 py-3.5 text-sm font-black uppercase tracking-widest text-black hover:bg-cyan-400 transition-all active:scale-[0.98] disabled:opacity-50 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] disabled:shadow-none"
      >
        {loading ? 'Initializing...' : 'Engage'}
      </button>
    </motion.div>
  )
}