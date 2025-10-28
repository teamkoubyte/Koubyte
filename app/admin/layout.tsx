import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminNavbar from '@/components/AdminNavbar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  // Redirect als niet ingelogd of geen admin
  if (!session || session.user.role !== 'admin') {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-white">
      <AdminNavbar userName={session.user.name} />
      <main className="bg-slate-50">
        {children}
      </main>
    </div>
  )
}

