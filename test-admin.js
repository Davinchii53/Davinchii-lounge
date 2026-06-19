const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  console.log('Logging in...')
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'palworld@gmail.com',
    password: '1234567890'
  })

  if (authError) {
    console.error('Login error:', authError.message)
    return
  }

  const user = authData.user
  console.log('User logged in:', user.id)

  console.log('Checking admin_users...')
  const { data: adminData, error: adminError } = await supabase
    .from('admin_users')
    .select('id')
    .eq('id', user.id)
    .single()

  console.log('adminData:', adminData)
  console.log('adminError:', adminError)

  console.log('Checking MFA...')
  const { data: mfaData, error: mfaError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
  console.log('mfaData:', mfaData)
  console.log('mfaError:', mfaError)
}

test()
