import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/dist/server/api-utils'
import React from 'react'

export default async function AppLayout({
    children
}:  Readonly<{children: React.ReactNode}>) 
    {
        const supabase = await createClient()

        const {data, error} = await supabase.auth.getUser()

        if (error || !data?.user) {
            redirect('/auth/login');
        }


    return (
      <div>
        <Header />
        {children}
      </div>
    )
  }
  