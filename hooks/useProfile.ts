import { useCallback, useEffect, useState } from 'react'
import { useSupabase } from '@/contexts/AuthContext'
import { Database } from '@/types/supabase'

type Profile = Database['public']['Tables']['profiles']['Row']
type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export function useProfile(userId?: string) {
  const supabase = useSupabase()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = useCallback(async () => {
    if (!userId) return

    try {
      setLoading(true)
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      setProfile(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error fetching profile')
    } finally {
      setLoading(false)
    }
  }, [userId, supabase])

  const updateProfile = async (updates: ProfileUpdate) => {
    if (!userId) return

    try {
      setLoading(true)
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)

      if (error) throw error
      await fetchProfile()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error updating profile')
      throw e
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  return {
    profile,
    loading,
    error,
    updateProfile,
    refreshProfile: fetchProfile
  }
}
