import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Link} from 'react-router-dom';

import Button from '../components/common/Button';
import CategoryFilter from '../components/thread/CategoryFilter';
import EmptyState from '../components/common/EmptyState';
import Icon from '../components/common/Icon';
import ThreadList from '../components/thread/ThreadList';
import ThreadListSkeleton from '../components/thread/ThreadListSkeleton';
import ThreadSearch from '../components/thread/ThreadSearch';
import {clearFilter} from '../states/filter/filterSlice';
import {selectIsAuthenticated} from '../states/auth/authSlice';
import {asyncPopulateThreadsAndUsers} from '../states/shared/sharedThunks';
import {
  selectThreadsStatus,
  selectVisibleThreads,
} from '../states/threads/threadsSlice';

const HomePage = () => {
  const threads = useSelector(selectVisibleThreads);
  const status = useSelector(selectThreadsStatus);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(asyncPopulateThreadsAndUsers());
  }, [dispatch]);

  const isInitialLoading = status === 'loading' && threads.length === 0;

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-linear-to-br from-brand-600 to-brand-800 px-6 py-8 text-white">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Diskusikan apa pun bersama komunitas
        </h1>
        <p className="mt-2 max-w-xl text-sm text-brand-100">
          Ajukan pertanyaan, bagikan pengalaman, dan temukan sudut pandang
          baru dari pengguna lain.
        </p>
        {!isAuthenticated && (
          <Button
            as={Link}
            to="/register"
            variant="secondary"
            className="mt-5"
          >
            Gabung sekarang
          </Button>
        )}
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <ThreadSearch />
        </div>
        <Button
          as={Link}
          to="/threads/new"
          className="w-full shrink-0 sm:w-auto"
        >
          <Icon name="plus" className="h-4 w-4" />
          Buat thread
        </Button>
      </div>

      <CategoryFilter />

      <section aria-live="polite">
        {isInitialLoading ? (
          <ThreadListSkeleton />
        ) : threads.length > 0 ? (
          <ThreadList threads={threads} />
        ) : status === 'failed' ? (
          <EmptyState
            icon="alert"
            title="Gagal memuat thread"
            description="Periksa koneksi Anda, lalu muat ulang daftar diskusi."
            action={
              <Button
                onClick={() => dispatch(asyncPopulateThreadsAndUsers())}
              >
                Coba lagi
              </Button>
            }
          />
        ) : (
          <EmptyState
            icon="search"
            title="Tidak ada thread yang cocok"
            description="Ubah kata kunci atau pilih kategori lain untuk melihat diskusi lainnya."
            action={
              <Button
                variant="secondary"
                onClick={() => dispatch(clearFilter())}
              >
                Atur ulang filter
              </Button>
            }
          />
        )}
      </section>
    </div>
  );
};

export default HomePage;
