import { createBrowserClient } from '@supabase/ssr'

function getClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function signIn(email: string, password: string) {
  const { data, error } = await getClient().auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signUp(email: string, password: string) {
  const { data, error } = await getClient().auth.signUp({ email, password })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await getClient().auth.signOut()
  if (error) throw error
}

export async function getUser() {
  const { data: { user } } = await getClient().auth.getUser()
  return user
}

export async function updateEmail(newEmail: string) {
  const { error } = await getClient().auth.updateUser({ email: newEmail })
  if (error) throw error
}

export async function updatePassword(newPassword: string) {
  const { error } = await getClient().auth.updateUser({ password: newPassword })
  if (error) throw error
}
