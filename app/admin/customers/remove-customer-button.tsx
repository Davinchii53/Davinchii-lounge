'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { removeCustomer } from '@/app/actions/admin'
import { ConfirmModal } from '@/components/ui/confirm-modal'

export default function RemoveCustomerButton({ customerId, customerName }: { customerId: string, customerName: string }) {
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()

  const handleConfirmRemove = async () => {
    setLoading(true)
    const { error } = await removeCustomer(customerId)
    
    if (error) {
      alert(`Failed to remove customer: ${error}`)
      setLoading(false)
      setIsModalOpen(false)
      return
    }

    setLoading(false)
    setIsModalOpen(false)
    router.refresh()
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        disabled={loading}
        className="bg-red-500/10 hover:bg-red-500/20 text-red-500 px-3 py-1.5 rounded text-sm font-medium disabled:opacity-50 transition-colors border border-red-500/20 ml-2"
        title={`Remove ${customerName}`}
      >
        {loading ? '...' : 'Remove'}
      </button>

      <ConfirmModal
        isOpen={isModalOpen}
        title="Remove Customer"
        description={`Are you sure you want to completely remove ${customerName}? This action cannot be undone and will erase all their history.`}
        confirmText="Remove Customer"
        onConfirm={handleConfirmRemove}
        onCancel={() => setIsModalOpen(false)}
        isLoading={loading}
      />
    </>
  )
}
