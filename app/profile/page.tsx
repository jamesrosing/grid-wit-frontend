import { auth, currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

export default async function ProfilePage() {
  const { userId } = auth()
  if (!userId) {
    redirect('/sign-in')
  }
  
  const user = await currentUser()

  return (
    <div className="mt-24 container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-6">Your Profile</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Saved Puzzles */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Saved Puzzles</h3>
          {/* Add saved puzzles list here */}
        </div>

        {/* Completed Puzzles */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Completed Puzzles</h3>
          <div className="space-y-2">
            {/* Add completed puzzles with completion times here */}
          </div>
        </div>
      </div>
    </div>
  )
}