/** Shared Lucide icons — calm SF-style stroke, one set across SignSpace. */
export {
  Accessibility,
  AlertCircle,
  ArrowRight,
  BookOpen,
  BookMarked,
  Camera,
  Check,
  CheckCircle2,
  ChevronRight,
  Circle,
  ClipboardList,
  Clock3,
  Eye,
  FileText,
  Filter,
  Flame,
  Hand,
  Heart,
  Home,
  ImageOff,
  Languages,
  Lock,
  LogIn,
  LogOut,
  Mail,
  Map,
  MessageCircle,
  Mic,
  Moon,
  Play,
  RotateCcw,
  Search,
  Settings2,
  Sparkles,
  Star,
  Sun,
  Type,
  Upload,
  User,
  Users,
  Video,
  Volume2,
  X,
  Zap,
} from "lucide-react";

const SIZE = {
  xs: 14,
  sm: 16,
  md: 18,
  lg: 20,
  xl: 24,
};

/** Inline icon with consistent stroke for Apple-HIG chrome. */
export function Icon({ as: Glyph, size = "sm", className = "", strokeWidth = 1.75, ...props }) {
  const px = typeof size === "number" ? size : SIZE[size] || SIZE.sm;
  return (
    <Glyph
      size={px}
      strokeWidth={strokeWidth}
      absoluteStrokeWidth
      aria-hidden="true"
      className={`shrink-0 ${className}`}
      {...props}
    />
  );
}
