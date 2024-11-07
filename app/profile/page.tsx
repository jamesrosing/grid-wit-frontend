import { auth } from '@clerk/nextjs/server'
import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

export default async function ProfilePage() {
  const { userId } = auth()
  if (!userId) {
    redirect('/sign-in')
  }import { auth } from '@clerk/nextjs/server'
import { currentUser } from '@clerk/nextjs'
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
}{/* Across Clues */}
<div className={cn(
  selectedDirection === 'across' || 'hidden lg:block'
)}>
  <h3 className="font-bold mb-4 text-lg hidden lg:block">Across</h3>
  <div className="space-y-1">
    {acrossClues.map(clue => (
      <button
        key={`across-${clue.number}`}
        className={cn(
          "w-full text-left px-2 py-1 rounded text-xs md:text-sm",
          activeClue?.number === clue.number && activeClue.direction === 'across'
            ? 'bg-zinc-100' 
            : 'hover:bg-zinc-50',
          "transition-colors"
        )}
        onClick={() => onClueSelect(clue)}
      >
        <span className="font-bold mr-2 inline-block">{clue.number}.</span>
        <span className="text-zinc-800">{clue.text}</span>
      </button>
    ))}
  </div>
</div>{/* Down Clues */}
<div className={cn(
  selectedDirection === 'down' || 'hidden lg:block'
)}>
  <h3 className="font-bold mb-4 text-lg hidden lg:block">Down</h3>
  <div className="space-y-1">
    {downClues.map(clue => (
      <button
        key={`down-${clue.number}`}
        className={cn(
          "w-full text-left px-2 py-1 rounded text-xs md:text-sm",
          activeClue?.number === clue.number && activeClue.direction === 'down'
            ? 'bg-zinc-100' 
            : 'hover:bg-zinc-50',
          "transition-colors"
        )}
        onClick={() => onClueSelect(clue)}
      >
        <span className="font-bold mr-2 inline-block">{clue.number}.</span>
        <span className="text-zinc-800">{clue.text}</span>
      </button>
    ))}
  </div>
</div>export function ClueList({ clues, activeClue, onClueSelect }: Props) {
  const [selectedDirection, setSelectedDirection] = useState<'across' | 'down'>('across')

  // Sort clues by number
  const acrossClues = clues
    .filter(clue => clue.direction === 'across')
    .sort((a, b) => a.number - b.number)

  const downClues = clues
    .filter(clue => clue.direction === 'down')
    .sort((a, b) => a.number - b.number)

  return (
    <div className="flex flex-col h-full">
      {/* Direction Tabs - Mobile Only */}
      <div className="flex gap-8 mb-4 border-b border-border lg:hidden">
        <button
          onClick={() => setSelectedDirection('across')}
          className={cn(
            "pb-2 text-sm font-medium transition-colors relative",
            selectedDirection === 'across' 
              ? "text-foreground border-b-2 border-foreground" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Across
        </button>
        <button
          onClick={() => setSelectedDirection('down')}
          className={cn(
            "pb-2 text-sm font-medium transition-colors relative",
            selectedDirection === 'down' 
              ? "text-foreground border-b-2 border-foreground" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Down
        </button>
      </div>

      {/* Clue Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Across Clues */}
        <div className={cn(
          selectedDirection === 'across' || 'hidden lg:block'
        )}>
          <h3 className="font-bold mb-4 text-lg hidden lg:block text-foreground">Across</h3>
          <div className="space-y-1">
            {acrossClues.map(clue => (
              <button
                key={`across-${clue.number}`}
                className={cn(
                  "w-full text-left px-2 py-1 rounded text-xs md:text-sm",
                  activeClue?.number === clue.number && activeClue.direction === 'across'
                    ? 'bg-muted' 
                    : 'hover:bg-muted/50',
                  "transition-colors"
                )}
                onClick={() => onClueSelect(clue)}
              >
                <span className="font-bold mr-2 inline-block text-foreground">{clue.number}.</span>
                <span className="text-foreground">{clue.text}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Down Clues */}
        <div className={cn(
          selectedDirection === 'down' || 'hidden lg:block'
        )}>
          <h3 className="font-bold mb-4 text-lg hidden lg:block text-foreground">Down</h3>
          <div className="space-y-1">
            {downClues.map(clue => (
              <button
                key={`down-${clue.number}`}
                className={cn(
                  "w-full text-left px-2 py-1 rounded text-xs md:text-sm",
                  activeClue?.number === clue.number && activeClue.direction === 'down'
                    ? 'bg-muted' 
                    : 'hover:bg-muted/50',
                  "transition-colors"
                )}
                onClick={() => onClueSelect(clue)}
              >
                <span className="font-bold mr-2 inline-block text-foreground">{clue.number}.</span>
                <span className="text-foreground">{clue.text}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
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
}import { auth, currentUser } from '@clerk/nextjs'
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