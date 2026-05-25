'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'
import { Lock } from 'lucide-react'

export default function AdminLogin() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError('Credenciales incorrectas')
      setLoading(false)
      return
    }

    router.push('/admin')
  }

  return (
    <div className="min-h-screen bg-[#060606] flex items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <Image src="/logo.png" alt="KONTACT" width={140} height={42} className="mx-auto mb-6" />
          <h1 className="font-display text-3xl tracking-widest">ADMIN</h1>
          <p className="text-[12px] text-white/30 mt-2 tracking-wider uppercase">Panel de administración</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold tracking-[3px] uppercase text-white/40 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full bg-white/4 border border-white/10 focus:border-brand-red text-white px-4 py-3 outline-none text-[14px] transition-colors"
              placeholder="admin@kontact.mx"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold tracking-[3px] uppercase text-white/40 mb-2">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full bg-white/4 border border-white/10 focus:border-brand-red text-white px-4 py-3 outline-none text-[14px] transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-brand-red text-[12px] tracking-wider">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full gap-2 mt-2">
            {loading ? 'Ingresando...' : (<><Lock size={14} /> Ingresar</>)}
          </button>
        </form>
      </div>
    </div>
  )
}
