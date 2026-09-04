import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import Icon from '../common/Icon';
import {dismissToast, selectToasts} from '../../states/ui/toastSlice';

const TONES = {
  success: {
    icon: 'check',
    className: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  },
  error: {
    icon: 'alert',
    className: 'border-rose-200 bg-rose-50 text-rose-800',
  },
  info: {
    icon: 'info',
    className: 'border-slate-200 bg-white text-slate-700',
  },
};

const AUTO_DISMISS_MS = 4500;

const Toaster = () => {
  const toasts = useSelector(selectToasts);
  const dispatch = useDispatch();

  useEffect(() => {
    const timers = toasts.map((toast) =>
      setTimeout(() => dispatch(dismissToast(toast.id)), AUTO_DISMISS_MS),
    );
    return () => timers.forEach(clearTimeout);
  }, [toasts, dispatch]);

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex flex-col items-center gap-2 px-4">
      {toasts.map((toast) => {
        const tone = TONES[toast.type] ?? TONES.info;
        return (
          <div
            key={toast.id}
            role="alert"
            style={{animation: 'toast-in 0.2s ease-out'}}
            className={`pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-lg border px-4 py-3 text-sm shadow-lg shadow-slate-900/5 ${tone.className}`}
          >
            <Icon name={tone.icon} className="mt-0.5 h-4 w-4 shrink-0" />
            <p className="flex-1">{toast.message}</p>
            <button
              type="button"
              onClick={() => dispatch(dismissToast(toast.id))}
              className="rounded p-0.5 opacity-60 transition-opacity hover:opacity-100"
              aria-label="Tutup notifikasi"
            >
              <Icon name="close" className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Toaster;
