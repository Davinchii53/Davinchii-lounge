'use client'

import { useState } from 'react'
import { deleteAdminAccount } from '@/app/actions/admin'
import { useRouter } from 'next/navigation'
import { ConfirmModal } from '@/components/ui/confirm-modal'

export default function DeleteAdminButton({ adminId, adminEmail }: { adminId: string, adminEmail: string }) {
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setLoading(true)
    const result = await deleteAdminAccount(adminId)
    
    if (result.error) {
      alert(`Error: ${result.error}`)
    } else {
      setIsModalOpen(false)
      router.refresh()
    }
    
    setLoading(false)
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="text-xs font-bold text-red-500 hover:text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 hover:shadow-[0_0_10px_rgba(239,68,68,0.3)] px-3 py-1.5 rounded transition-all"
      >
        Revoke Access
      </button>

      <ConfirmModal
        isOpen={isModalOpen}
        title="Revoke Admin Access"
        description={`Are you sure you want to permanently delete the admin account for ${adminEmail}? This action cannot be undone.`}
        confirmText="Revoke & Delete"
        onConfirm={handleDelete}
        onCancel={() => setIsModalOpen(false)}
        isLoading={loading}
      />
    </>
  )
}
