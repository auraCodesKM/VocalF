'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
    const router = useRouter()

    useEffect(() => {
        const handleCallback = async () => {
            const { error } = await supabase.auth.getSession()

            if (error) {
                console.error('Error during auth callback:', error)
                router.push('/signin?error=auth_failed')
            } else {
                router.push('/dashboard')
            }
        }

        handleCallback()
    }, [router])

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
            <div className="text-center">
                <div className="mb-4">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto"></div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Completing sign in...</h2>
                <p className="text-gray-600 dark:text-gray-300">Please wait while we redirect you</p>
            </div>
        </div>
    )
}
