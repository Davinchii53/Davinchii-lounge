'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function AdminLoading() {
  const [text, setText] = useState('ACCESSING DATABANKS...')

  useEffect(() => {
    const texts = [
      'ACCESSING DATABANKS...',
      'DECRYPTING RECORDS...',
      'ESTABLISHING SECURE LINK...',
      'INITIALIZING MODULE...'
    ]
    let i = 0
    const interval = setInterval(() => {
      i = (i + 1) % texts.length
      setText(texts[i])
    }, 600)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex h-full min-h-[60vh] w-full flex-col items-center justify-center space-y-12">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute h-40 w-40 rounded-full border border-cyan-500/20 border-t-cyan-500/80 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
        />
        {/* Inner reverse rotating ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
          className="absolute h-28 w-28 rounded-full border border-purple-500/20 border-b-purple-500/80 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
        />
        {/* Center pulse */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="h-12 w-12 rounded-full bg-cyan-500/40 blur-md shadow-[0_0_30px_rgba(6,182,212,0.6)]"
        />
      </div>

      <div className="flex flex-col items-center space-y-3">
        <div className="flex items-center space-x-3">
          <motion.div
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="h-2 w-2 bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]"
          />
          <h3 className="font-mono text-sm font-bold tracking-[0.3em] text-cyan-400 uppercase drop-shadow-[0_0_8px_rgba(6,182,212,0.5)] w-[280px]">
            {text}
          </h3>
        </div>
        <p className="font-mono text-[10px] text-neutral-600 uppercase tracking-widest">
          System Synchronization in Progress
        </p>
      </div>
    </div>
  )
}
