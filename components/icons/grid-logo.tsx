export function GridLogo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="1" className="fill-white dark:fill-zinc-900" />
      <rect x="2" y="12" width="5" height="5" className="fill-zinc-900 dark:fill-white" />
      <rect x="7" y="12" width="5" height="5" className="fill-zinc-900 dark:fill-white" />
      <rect x="12" y="12" width="5" height="5" className="fill-zinc-900 dark:fill-white" />
      <rect x="17" y="12" width="5" height="5" className="fill-zinc-900 dark:fill-white" />
      <rect x="12" y="7" width="5" height="5" className="fill-zinc-900 dark:fill-white" />
      <rect x="12" y="17" width="5" height="5" className="fill-zinc-900 dark:fill-white" />
      <path d="M2 7h20" className="stroke-zinc-200 dark:stroke-zinc-700" />
      <path d="M2 12h20" className="stroke-zinc-200 dark:stroke-zinc-700" />
      <path d="M2 17h20" className="stroke-zinc-200 dark:stroke-zinc-700" />
      <path d="M7 2v20" className="stroke-zinc-200 dark:stroke-zinc-700" />
      <path d="M12 2v20" className="stroke-zinc-200 dark:stroke-zinc-700" />
      <path d="M17 2v20" className="stroke-zinc-200 dark:stroke-zinc-700" />
      <rect 
        width="20" 
        height="20" 
        x="2" 
        y="2" 
        rx="1" 
        className="stroke-zinc-200 dark:stroke-zinc-700" 
        fill="none" 
      />
    </svg>
  )
} 