export default function SkeletonCard() {
  return (
    <div className="card overflow-hidden animate-pulse">
      <div className="h-44 w-full bg-slate-200/60 dark:bg-slate-800/60" />
      <div className="p-4 space-y-3">
        <div className="h-4 w-3/5 bg-slate-200/60 dark:bg-slate-800/60 rounded" />
        <div className="h-3 w-4/5 bg-slate-200/60 dark:bg-slate-800/60 rounded" />
        <div className="h-3 w-2/5 bg-slate-200/60 dark:bg-slate-800/60 rounded" />
        <div className="h-9 w-full bg-slate-200/60 dark:bg-slate-800/60 rounded-xl" />
      </div>
    </div>
  );
}
