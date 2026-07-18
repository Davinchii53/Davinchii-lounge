'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { ConfirmModal } from '@/components/ui/confirm-modal'

export default function AdminPodCard({ pod, activeSession }: { pod: any, activeSession?: any }) {
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()

  const handleToggleStatus = async (newStatus: string) => {
    setLoading(true)
    const supabase = createClient()
    await supabase.from('pods').update({ status: newStatus }).eq('id', pod.id)
    setLoading(false)
    router.refresh()
  }

  const handleForceClose = async () => {
    if (!activeSession) return
    
    setLoading(true)
    const supabase = createClient()
    await supabase.rpc('close_session', {
      p_session_id: activeSession.id,
      p_reason: 'admin_forced'
    })
    
    setLoading(false)
    setIsModalOpen(false)
    router.refresh()
  }

  return (
    <>
      <div className="bg-[var(--surface)] border border-white/10 rounded-xl p-5 flex flex-col justify-between h-48 relative overflow-hidden group transition-colors duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-white">{pod.label}</h3>
              <span className="text-xs text-cyan-500/70 font-bold">{pod.zone}</span>
            </div>
            <span className={`px-2 py-1 text-[10px] font-bold rounded border ${
              pod.status === 'active' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
              pod.status === 'maintenance' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
              'bg-neutral-500/10 text-neutral-400 border-neutral-500/20'
            }`}>
              {pod.status}
            </span>
          </div>
          {activeSession && (
            <div className="mt-4 text-xs text-neutral-400">
              <p>Session Active</p>
              <p>Started: {new Date(activeSession.started_at).toLocaleTimeString()}</p>
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-cyan-500/20 flex gap-2 relative z-10">
          {pod.status === 'active' ? (
            <button 
              onClick={() => setIsModalOpen(true)}
              disabled={loading}
              className="flex-1 bg-red-600 hover:bg-red-500 text-white border border-transparent py-1.5 rounded text-xs font-bold disabled:opacity-50 transition-colors active:translate-y-px"
            >
              {loading ? 'Closing...' : 'Force Close'}
            </button>
          ) : (
            <>
              <button
                onClick={() => handleToggleStatus('idle')}
                disabled={loading || pod.status === 'idle'}
                className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-cyan-300 py-1.5 rounded text-xs font-bold disabled:opacity-50 transition-colors active:translate-y-px"
              >
                Set Idle
              </button>
              <button
                onClick={() => handleToggleStatus('maintenance')}
                disabled={loading || pod.status === 'maintenance'}
                className="flex-1 bg-white/5 border border-white/10 hover:bg-amber-500 hover:border-transparent text-cyan-300 hover:text-amber-950 py-1.5 rounded text-xs font-bold disabled:opacity-50 transition-colors active:translate-y-px"
              >
                Set Maint.
              </button>
            </>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        title="Force Close Session"
        description={`Are you sure you want to force close the session for ${pod.label}? This will deduct the elapsed time from the customer's balance.`}
        confirmText="Force Close"
        onConfirm={handleForceClose}
        onCancel={() => setIsModalOpen(false)}
        isLoading={loading}
      />
    </>
  )
}
