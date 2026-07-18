import { createClient } from '@/lib/supabase/server'
import AdminPodCard from './pod-card'

export const dynamic = 'force-dynamic'

export default async function AdminPodsPage() {
  const supabase = await createClient()

  // Fetch pods and active sessions in parallel
  const [podsRes, activeSessionsRes] = await Promise.all([
    supabase
      .from('pods')
      .select('*')
      .order('zone')
      .order('label'),
    supabase
      .from('sessions')
      .select('id, pod_id, started_at, customer_id')
      .is('ended_at', null)
  ])

  const pods = podsRes.data
  const activeSessions = activeSessionsRes.data

  const activeSessionsByPod = activeSessions?.reduce((acc: any, session) => {
    acc[session.pod_id] = session
    return acc
  }, {}) || {}

  return (
    <div className="p-8 space-y-8 relative z-10">
      <div className="relative z-10">
        <h2 className="text-3xl font-bold text-white tracking-tight">Pods Management</h2>
        <p className="text-cyan-400/80 font-medium tracking-wide">Monitor and manage lounge pods</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {pods?.map(pod => (
          <AdminPodCard 
            key={pod.id} 
            pod={pod} 
            activeSession={activeSessionsByPod[pod.id]} 
          />
        ))}
      </div>
    </div>
  )
}
