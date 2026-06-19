const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'palworld@gmail.com',
    password: '1234567890'
  })

  if (authError) return console.error('Login error:', authError)

  console.log('Testing UPDATE menu_items...')
  const { data, error } = await supabase
    .from('menu_items')
    .update({ available: false })
    .eq('name', 'Air Mineral')
    .select()

  console.log('Update Data:', data)
  console.log('Update Error:', error)
}

test()
