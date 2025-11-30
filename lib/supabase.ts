"use client"

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables are not set. Please check your .env.local file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
    },
})

// Auth functions
export const loginWithEmailAndPassword = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })
    return { user: data.user, error: error?.message || null }
}

export const registerWithEmailAndPassword = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`,
        },
    })
    return { user: data.user, error: error?.message || null }
}

export const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`,
            queryParams: {
                access_type: 'offline',
                prompt: 'consent',
            },
        },
    })
    return { data, error: error?.message || null }
}

export const logOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
        // Clear any stored auth data
        if (typeof window !== 'undefined') {
            localStorage.removeItem('userSignedIn')
        }
    }
    return { error: error?.message || null }
}

export const onAuthStateChange = (callback: (user: any) => void) => {
    return supabase.auth.onAuthStateChange((_event, session) => {
        callback(session?.user ?? null)
    })
}

export const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/reset-password`,
    })
    return { error: error?.message || null }
}

// For backwards compatibility with existing code
export const auth = {
    currentUser: null as any,
}

// Get current session
export const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    return user
}

export default supabase
