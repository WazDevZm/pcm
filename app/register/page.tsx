import { redirect } from 'next/navigation'

/** Members join with Google on the sign-in page (their account is created on first sign-in) */
export default function RegisterPage() {
  redirect('/login')
}
