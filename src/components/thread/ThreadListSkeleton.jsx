import Skeleton from '../common/Skeleton';

const ThreadListSkeleton = ({count = 3}) => (
  <div className="space-y-4" aria-hidden="true">
    {Array.from({length: count}, (_, index) => (
      <div
        key={index}
        className="rounded-xl border border-slate-200 bg-white p-5"
      >
        <div className="flex items-center gap-2">
          <Skeleton circle width="1.75rem" height="1.75rem" />
          <Skeleton width="7rem" height="0.875rem" />
        </div>
        <Skeleton className="mt-4" width="60%" height="1.25rem" />
        <Skeleton className="mt-3" height="0.875rem" />
        <Skeleton className="mt-2" width="80%" height="0.875rem" />
        <Skeleton className="mt-5" width="10rem" height="1.5rem" />
      </div>
    ))}
  </div>
);

export default ThreadListSkeleton;
