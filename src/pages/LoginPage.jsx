import {useDispatch, useSelector} from 'react-redux';
import {Link, useLocation, useNavigate} from 'react-router-dom';

import AuthShell from '../components/layout/AuthShell';
import Button from '../components/common/Button';
import TextField from '../components/common/TextField';
import useInput from '../hooks/useInput';
import {
  asyncLoginUser,
  selectIsAuthSubmitting,
} from '../states/auth/authSlice';

const LoginPage = () => {
  const [email, onEmailChange] = useInput();
  const [password, onPasswordChange] = useInput();
  const isSubmitting = useSelector(selectIsAuthSubmitting);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit = async (event) => {
    event.preventDefault();

    const result = await dispatch(asyncLoginUser({email, password}));
    if (asyncLoginUser.fulfilled.match(result)) {
      navigate(location.state?.from ?? '/', {replace: true});
    }
  };

  return (
    <AuthShell
      title="Masuk ke akun Anda"
      description="Gunakan email dan kata sandi yang telah terdaftar."
      footer={
        <>
          Belum punya akun?{' '}
          <Link
            to="/register"
            className="font-medium text-brand-700 hover:underline"
          >
            Daftar sekarang
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <TextField
          id="email"
          type="email"
          label="Email"
          value={email}
          onChange={onEmailChange}
          placeholder="nama@email.com"
          autoComplete="email"
          required
        />
        <TextField
          id="password"
          type="password"
          label="Kata sandi"
          value={password}
          onChange={onPasswordChange}
          placeholder="••••••••"
          autoComplete="current-password"
          required
        />
        <Button
          type="submit"
          size="lg"
          className="w-full"
          isLoading={isSubmitting}
        >
          Masuk
        </Button>
      </form>
    </AuthShell>
  );
};

export default LoginPage;
