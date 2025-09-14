import { cn } from "../utils/cn"; // if you don't have a cn util, remove cn() and use className directly
import { Inbox } from "lucide-react";

/**
 * EmptyState
 * Props:
 *  - icon?: ReactNode (default Inbox)
 *  - title: string
 *  - message?: string
 *  - action?: ReactNode (e.g., a <Link> or <button>)
 *  - className?: string
 */
export default function EmptyState({ icon, title, message, action, className }) {
  const Icon = icon || Inbox;
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/40 dark:border-slate-800 p-8 text-center",
        "bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm",
        className
      )}
    >
      <div className="mx-auto h-12 w-12 rounded-2xl grid place-items-center bg-slate-100 dark:bg-slate-800 text-slate-500 mb-4">
        <Icon size={22} />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      {message && <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{message}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
