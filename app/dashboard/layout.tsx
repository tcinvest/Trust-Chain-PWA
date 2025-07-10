import Nav from '@/components/Nav'
import { checkUser } from '@/lib/check-user'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await checkUser()
  return (
    <div className="flex flex-col h-screen bg-white dark:bg-slate-900">
      <main className="flex-1 overflow-y-auto bg-white dark:bg-slate-900 pb-20 relative z-10">
        {children}
      </main>
      <Nav />
    </div>
  )  
}