'use server'

import { createClient } from '@supabase/supabase-js'

export async function createAdminAccount(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  // Use the service role key to bypass RLS and avoid logging out the current user
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )

  // 1. Create the user in auth.users
  const { data: userData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { is_admin: true }
  })

  if (authError) {
    return { error: authError.message }
  }

  if (!userData.user) {
    return { error: 'Failed to create user' }
  }

  // 2. Insert into admin_users table
  const { error: dbError } = await supabaseAdmin
    .from('admin_users')
    .insert({
      id: userData.user.id,
      email: userData.user.email
    })

  if (dbError) {
    // If this fails, we should ideally rollback auth.users, but for this prototype returning the error is okay.
    return { error: dbError.message }
  }

  return { success: true }
}

export async function removeCustomer(customerId: string) {
  if (!customerId) return { error: 'Customer ID is required' }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )

  // First delete the auth user. Because of our foreign keys and triggers,
  // we might need to delete from the customers table first if ON DELETE CASCADE isn't set everywhere,
  // but let's try auth first. Actually, deleting from auth.users automatically deletes from customers 
  // if there is an ON DELETE CASCADE on customers(id) referencing auth.users(id).
  // Wait, customers(id) does have ON DELETE CASCADE!
  const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(customerId)

  if (deleteError) {
    return { error: deleteError.message }
  }

  return { success: true }
}

export async function deleteAdminAccount(adminId: string) {
  if (!adminId) return { error: 'Admin ID is required' }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )

  // This will cascade delete from admin_users as well
  const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(adminId)

  if (deleteError) {
    return { error: deleteError.message }
  }

  return { success: true }
}
