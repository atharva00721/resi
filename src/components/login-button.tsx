'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'

export default function LoginButton() {
  const { data: session, status } = useSession()

  if (status === 'loading') return <p>Loading...</p>

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <p>Signed in as {session.user?.email}</p>
        <Button onClick={() => signOut()}>Sign out</Button>
      </div>
    )
  }
  
  return (
    <div>
      <p>Not signed in</p>
      <Button onClick={() => signIn('github')}>Sign in with GitHub</Button>
    </div>
  )
}
