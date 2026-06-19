'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ConfirmModal } from '@/components/ui/confirm-modal'

export default function LogoutButton({ hasActiveSession }: { hasActiveSession?: boolean }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()

  const executeLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const handleLogoutClick = () => {
    if (hasActiveSession) {
      setIsModalOpen(true)
    } else {
      executeLogout()
    }
  }

  return (
    <>
      <button
        onClick={handleLogoutClick}
        className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
      >
        Sign out
      </button>

      <ConfirmModal
        isOpen={isModalOpen}
        title="Active Session Running"
        description="You have an active session! Are you sure you want to sign out? Your session will continue running and deducting time until you end it."
        confirmText="Sign Out Anyway"
        onConfirm={executeLogout}
        onCancel={() => setIsModalOpen(false)}
      />
    </>
  )
}