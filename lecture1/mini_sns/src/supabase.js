import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://sxslckrtrrqldouxbqui.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4c2xja3J0cnJxbGRvdXhicXVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4ODEzODAsImV4cCI6MjA5NjQ1NzM4MH0.l_gE1BVY3u3suu6qYW5yd6PNKhHkkSnHwIV9UwnZ15c'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
