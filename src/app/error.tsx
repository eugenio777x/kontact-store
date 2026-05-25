'use client'

import { useEffect } from 'react'

interface Props {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: Props) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="font-display text-4xl tracking-widest">ALGO FALLÓ</h1>
        <p className="text-[14px] text-white/40 leading-relaxed">
          Ocurrió un error inesperado. Por favor intenta de nuevo.
        </p>
        <button onClick={reset} className="btn-primary">Intentar de nuevo</button>
      </div>
    </div>
  )
}
