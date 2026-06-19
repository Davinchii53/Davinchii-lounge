'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function RealtimeSubscriber() {
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    let timeoutId: NodeJS.Timeout

    // Debounced refresh to prevent hammering the server if many rows update at once
    const handleRefresh = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        router.refresh()
      }, 500)
    }

    const channel = supabase
      .channel('global-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public' },
        (payload) => {
          console.log('Realtime change received:', payload)
          handleRefresh()
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to real-time database changes')
        }
      })

    return () => {
      clearTimeout(timeoutId)
      supabase.removeChannel(channel)
    }
  }, [router])

  return null // This component doesn't render any UI
}
