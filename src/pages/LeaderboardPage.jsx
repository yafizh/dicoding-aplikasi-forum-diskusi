import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import LeaderboardList from '../components/leaderboard/LeaderboardList';
import Skeleton from '../components/common/Skeleton';
import {selectAuthUser} from '../states/auth/authSlice';
import {
  asyncReceiveLeaderboards,
  selectLeaderboards,
  selectLeaderboardsStatus,
} from '../states/leaderboards/leaderboardsSlice';

const LeaderboardSkeleton = () => (
  <div className="divide-y divide-slate-100" aria-hidden="true">
    {Array.from({length: 5}, (_, index) => (
      <div key={index} className="flex items-center gap-3 px-5 py-4">
        <Skeleton circle width="2rem" height="2rem" />
        <Skeleton circle width="2.25rem" height="2.25rem" />
        <Skeleton className="flex-1" height="1rem" />
        <Skeleton width="2rem" height="1rem" />
      </div>
    ))}
  </div>
);

const LeaderboardPage = () => {
  const leaderboards = useSelector(selectLeaderboards);
  const status = useSelector(selectLeaderboardsStatus);
  const authUser = useSelector(selectAuthUser);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(asyncReceiveLeaderboards());
  }, [dispatch]);

  const isInitialLoading = status === 'loading' && leaderboards.length === 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Klasemen pengguna aktif
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Skor bertambah setiap kali Anda membuat thread, berkomentar, dan
          menerima vote dari pengguna lain.
        </p>
      </div>

      <section
        aria-live="polite"
        className="overflow-hidden rounded-xl border border-slate-200 bg-white"
      >
        {isInitialLoading ? (
          <LeaderboardSkeleton />
        ) : leaderboards.length > 0 ? (
          <LeaderboardList
            leaderboards={leaderboards}
            highlightUserId={authUser?.id ?? null}
          />
        ) : (
          <EmptyState
            icon={status === 'failed' ? 'alert' : 'trophy'}
            title={
              status === 'failed' ?
                'Gagal memuat leaderboard' :
                'Leaderboard masih kosong'
            }
            description="Skor akan muncul setelah ada aktivitas di forum."
            action={
              status === 'failed' ? (
                <Button onClick={() => dispatch(asyncReceiveLeaderboards())}>
                  Coba lagi
                </Button>
              ) : null
            }
          />
        )}
      </section>
    </div>
  );
};

export default LeaderboardPage;
