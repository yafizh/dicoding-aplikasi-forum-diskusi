import Skeleton from '../common/Skeleton';

const ThreadListSkeleton = ({count = 3}) => (
  <div className="space-y-4" aria-hidden="true">
    {Array.from({length: count}, (_, index) => (
      <div
        key={index}
        className="rounded-xl border border-slate-200 bg-white p-5"
      >
        <div className="flex items-center gap-2">
          <Skeleton className="h-7 w-7 rounded-full" />
          <Skeleton className="h-3.5 w-28" />
        </div>
        <Skeleton className="mt-4 h-5 w-3/5" />
        <Skeleton className="mt-3 h-3.5 w-full" />
        <Skeleton className="mt-2 h-3.5 w-4/5" />
        <Skeleton className="mt-5 h-6 w-40" />
      </div>
    ))}
  </div>
);

export default ThreadListSkeleton;
