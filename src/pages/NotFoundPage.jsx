import {Link} from 'react-router-dom';

import Button from '../components/common/Button';

const NotFoundPage = () => (
  <div className="flex flex-col items-center py-20 text-center">
    <p className="text-6xl font-bold tracking-tight text-brand-600">404</p>
    <h1 className="mt-4 text-xl font-semibold text-slate-900">
      Halaman tidak ditemukan
    </h1>
    <p className="mt-2 max-w-sm text-sm text-slate-500">
      Tautan yang Anda buka mungkin sudah dipindahkan atau tidak pernah ada.
    </p>
    <Button as={Link} to="/" className="mt-6">
      Kembali ke beranda
    </Button>
  </div>
);

export default NotFoundPage;
