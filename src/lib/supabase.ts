import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ejaaynmdtbkskddxmoxr.supabase.co'
const supabaseKey = 'sb_publishable_ujFucOu3HozYuu-BAVspHQ_oJnCyiaS'

export const supabase = createClient(supabaseUrl, supabaseKey)