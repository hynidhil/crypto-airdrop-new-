import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mlsokdxukpwyhuorsjcb.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sc29rZHh1a3B3eWh1b3JzamNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwNzUzODIsImV4cCI6MjA2NzY1MTM4Mn0.j2ZVhH6bFoYM_KD8CbdpWRcwKiAxJwYCagf7JY9rVGQ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for better TypeScript support
export interface Airdrop {
  id: string
  title: string
  chain: string
  reward: string
  description: string
  link: string
  tags: string[]
  image_url: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  participants: number
  time_left: string
  featured: boolean
  created_at: string
}