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
  <div
    className="rounded-xl border border-slate-200 bg-white p-6"
    aria-hidden="true"
  >
    <Skeleton width="6rem" height="1.25rem" borderRadius="9999px" />
    <Skeleton className="mt-4" width="75%" height="1.75rem" />
    <div className="mt-5 flex items-center gap-2">
      <Skeleton circle width="2.25rem" height="2.25rem" />
      <Skeleton width="8rem" height="1rem" />
    </div>
    <Skeleton className="mt-6" height="1rem" />
    <Skeleton className="mt-2" height="1rem" />
    <Skeleton className="mt-2" width="66%" height="1rem" />
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
