import { redirect } from 'next/navigation'

/** Sign-up lives on the sign-in page (same form as the app) */
export default function RegisterPage() {
  redirect('/login?mode=signup')
}
