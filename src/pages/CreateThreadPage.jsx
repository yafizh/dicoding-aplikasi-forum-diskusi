import {useDispatch, useSelector} from 'react-redux';
import {Link, useNavigate} from 'react-router-dom';

import Button from '../components/common/Button';
import Icon from '../components/common/Icon';
import TextField from '../components/common/TextField';
import useInput from '../hooks/useInput';
import {
  asyncCreateThread,
  selectIsCreatingThread,
} from '../states/threads/threadsSlice';

const CreateThreadPage = () => {
  const [title, onTitleChange] = useInput();
  const [category, onCategoryChange] = useInput();
  const [body, onBodyChange] = useInput();
  const isCreating = useSelector(selectIsCreatingThread);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isValid = title.trim() !== '' && body.trim() !== '';

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!isValid) return;

    const result = await dispatch(asyncCreateThread({
      title: title.trim(),
      body: body.trim(),
      category: category.trim() || undefined,
    }));

    if (asyncCreateThread.fulfilled.match(result)) {
      navigate(`/threads/${result.payload.id}`);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 transition-colors hover:text-brand-700"
      >
        <Icon name="back" className="h-4 w-4" />
        Kembali ke daftar thread
      </Link>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Buat thread baru
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Mulai diskusi dengan judul yang jelas dan isi yang informatif.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="space-y-5 rounded-xl border border-slate-200 bg-white p-6"
      >
        <TextField
          id="title"
          label="Judul"
          value={title}
          onChange={onTitleChange}
          placeholder="Apa yang ingin Anda diskusikan?"
          required
        />

        <TextField
          id="category"
          label="Kategori"
          value={category}
          onChange={onCategoryChange}
          placeholder="misalnya: react, redux, karier"
          hint="Opsional. Kategori dipakai untuk memfilter daftar thread."
        />

        <TextField
          as="textarea"
          id="body"
          label="Isi thread"
          value={body}
          onChange={onBodyChange}
          rows={8}
          placeholder="Jelaskan topik diskusi Anda…"
          className="resize-y"
          required
        />

        <div className="flex justify-end gap-2">
          <Button as={Link} to="/" variant="secondary">Batal</Button>
          <Button type="submit" isLoading={isCreating} disabled={!isValid}>
            Publikasikan
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateThreadPage;
