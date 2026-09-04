import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Link, useParams} from 'react-router-dom';

import Button from '../components/common/Button';
import CommentForm from '../components/comment/CommentForm';
import CommentList from '../components/comment/CommentList';
import EmptyState from '../components/common/EmptyState';
import Icon from '../components/common/Icon';
import Skeleton from '../components/common/Skeleton';
import ThreadDetailCard from '../components/thread/ThreadDetailCard';
import {
  asyncReceiveThreadDetail,
  clearDetail,
  selectThreadDetail,
  selectThreadDetailStatus,
} from '../states/threadDetail/threadDetailSlice';

const DetailSkeleton = () => (
  <div className="rounded-xl border border-slate-200 bg-white p-6">
    <Skeleton className="h-5 w-24 rounded-full" />
    <Skeleton className="mt-4 h-7 w-3/4" />
    <div className="mt-5 flex items-center gap-2">
      <Skeleton className="h-9 w-9 rounded-full" />
      <Skeleton className="h-4 w-32" />
    </div>
    <Skeleton className="mt-6 h-4 w-full" />
    <Skeleton className="mt-2 h-4 w-full" />
    <Skeleton className="mt-2 h-4 w-2/3" />
  </div>
);

const ThreadDetailPage = () => {
  const {threadId} = useParams();
  const thread = useSelector(selectThreadDetail);
  const status = useSelector(selectThreadDetailStatus);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(asyncReceiveThreadDetail(threadId));
    return () => {
      dispatch(clearDetail());
    };
  }, [dispatch, threadId]);

  return (
    <div className="space-y-6">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 transition-colors hover:text-brand-700"
      >
        <Icon name="back" className="h-4 w-4" />
        Kembali ke daftar thread
      </Link>

      {status === 'loading' && <DetailSkeleton />}

      {status === 'failed' && (
        <EmptyState
          icon="alert"
          title="Thread tidak ditemukan"
          description="Diskusi ini mungkin telah dihapus atau tautannya keliru."
          action={
            <Button as={Link} to="/">Kembali ke beranda</Button>
          }
        />
      )}

      {thread && (
        <>
          <ThreadDetailCard thread={thread} />

          <section className="space-y-4">
            <h2 className="text-base font-semibold text-slate-900">
              Komentar ({thread.comments.length})
            </h2>
            <CommentForm threadId={thread.id} />
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <CommentList comments={thread.comments} />
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default ThreadDetailPage;
