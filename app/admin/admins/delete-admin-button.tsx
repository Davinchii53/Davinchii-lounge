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
        className="text-xs font-bold text-white bg-red-600 hover:bg-red-500 border border-transparent px-3 py-1.5 rounded transition-colors active:translate-y-px"
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
