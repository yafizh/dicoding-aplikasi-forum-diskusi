import {useDispatch, useSelector} from 'react-redux';
import {Link, useNavigate} from 'react-router-dom';

import AuthShell from '../components/layout/AuthShell';
import Button from '../components/common/Button';
import TextField from '../components/common/TextField';
import useInput from '../hooks/useInput';
import {
  asyncRegisterUser,
  selectIsAuthSubmitting,
} from '../states/auth/authSlice';
import {pushToast} from '../states/ui/toastSlice';

const RegisterPage = () => {
  const [name, onNameChange] = useInput();
  const [email, onEmailChange] = useInput();
  const [password, onPasswordChange] = useInput();
  const isSubmitting = useSelector(selectIsAuthSubmitting);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (event) => {
    event.preventDefault();

    const result = await dispatch(
        asyncRegisterUser({name, email, password}),
    );

    if (asyncRegisterUser.fulfilled.match(result)) {
      dispatch(pushToast({
        type: 'success',
        message: 'Pendaftaran berhasil. Silakan masuk.',
      }));
      navigate('/login', {replace: true});
    }
  };

  return (
    <AuthShell
      title="Buat akun baru"
      description="Daftar gratis untuk mulai membuat thread dan berkomentar."
      footer={
        <>
          Sudah punya akun?{' '}
          <Link
            to="/login"
            className="font-medium text-brand-700 hover:underline"
          >
            Masuk di sini
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <TextField
          id="name"
          label="Nama"
          value={name}
          onChange={onNameChange}
          placeholder="Nama lengkap Anda"
          autoComplete="name"
          required
        />
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
          placeholder="Minimal 6 karakter"
          autoComplete="new-password"
          minLength={6}
          required
        />
        <Button
          type="submit"
          size="lg"
          className="w-full"
          isLoading={isSubmitting}
        >
          Daftar
        </Button>
      </form>
    </AuthShell>
  );
};

export default RegisterPage;
