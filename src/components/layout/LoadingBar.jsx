import {useSelector} from 'react-redux';

import {selectIsLoading} from '../../states/ui/loadingSlice';

const LoadingBar = () => {
  const isLoading = useSelector(selectIsLoading);

  if (!isLoading) return null;

  return (
    <div
      className="fixed inset-x-0 top-0 z-50 h-0.5 overflow-hidden bg-brand-100"
      role="progressbar"
      aria-label="Memuat data"
    >
      <div
        className="h-full w-full bg-brand-600"
        style={{animation: 'progress-slide 1.1s ease-in-out infinite'}}
      />
    </div>
  );
};

export default LoadingBar;
