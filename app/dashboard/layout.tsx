import Nav from '@/components/Nav'
import { checkUser } from '@/lib/check-user'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await checkUser()
  return (
    <div className="flex flex-col h-screen">
      <main className="flex-1 overflow-y-auto pb-20 relative z-10">
        {children}
      </main>
      <Nav />
    </div>
  )  
}