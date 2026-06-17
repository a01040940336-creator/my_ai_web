import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? 'https://sxslckrtrrqldouxbqui.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4c2xja3J0cnJxbGRvdXhicXVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0NzgzNTMsImV4cCI6MjA2MTA1NDM1M30.qkRfOuiEjHHCGMKCKOoH2TGmWNW4OFiDp5yC_x7MDDE'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
