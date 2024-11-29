import {
  Sun,
  Moon,
  Laptop,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  Check,
  Search,
  Star,
  StarOff,
  Grid,
  Loader2,
  AlertCircle,
  Info,
  Bookmark,
  BookmarkX,
  BookmarkCheck,
  BookmarkPlus,
  BookmarkMinus,
  Settings,
  LogOut,
  User,
  Save,
  Github,
  type LucideIcon,
} from "lucide-react"

export type Icon = LucideIcon

export const Icons = {
  sun: Sun,
  moon: Moon,
  laptop: Laptop,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  chevronDown: ChevronDown,
  chevronUp: ChevronUp,
  menu: Menu,
  close: X,
  check: Check,
  search: Search,
  star: Star,
  starOff: StarOff,
  grid: Grid,
  spinner: Loader2,
  alert: AlertCircle,
  info: Info,
  bookmark: Bookmark,
  bookmarkX: BookmarkX,
  bookmarkCheck: BookmarkCheck,
  bookmarkPlus: BookmarkPlus,
  bookmarkMinus: BookmarkMinus,
  settings: Settings,
  logout: LogOut,
  user: User,
  logo: Grid,
  save: Save,
  gitHub: Github,
  google: ({ ...props }) => (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="fab"
      data-icon="google"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 488 512"
      {...props}
    >
      <path
        fill="currentColor"
        d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
      ></path>
    </svg>
  ),
}
