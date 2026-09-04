import {useDispatch, useSelector} from 'react-redux';
import {Link} from 'react-router-dom';

import Avatar from '../common/Avatar';
import Button from '../common/Button';
import useInput from '../../hooks/useInput';
import {selectAuthUser} from '../../states/auth/authSlice';
import {
  asyncCreateComment,
  selectIsCommenting,
} from '../../states/threadDetail/threadDetailSlice';

const CommentForm = ({threadId}) => {
  const [content, onContentChange, resetContent] = useInput();
  const authUser = useSelector(selectAuthUser);
  const isCommenting = useSelector(selectIsCommenting);
  const dispatch = useDispatch();

  if (!authUser) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-5 text-center text-sm text-slate-600">
        <Link
          to="/login"
          className="font-medium text-brand-700 hover:underline"
        >
          Masuk
        </Link>{' '}
        untuk ikut berkomentar pada diskusi ini.
      </div>
    );
  }

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!content.trim()) return;

    const result = await dispatch(asyncCreateComment({
      threadId,
      content: content.trim(),
    }));

    if (asyncCreateComment.fulfilled.match(result)) resetContent();
  };

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl border border-slate-200 bg-white p-5"
    >
      <div className="flex items-center gap-2">
        <Avatar src={authUser.avatar} name={authUser.name} size="sm" />
        <span className="text-sm font-medium text-slate-700">
          Berikan komentar
        </span>
      </div>

      <textarea
        value={content}
        onChange={onContentChange}
        rows={4}
        placeholder="Tulis komentar Anda…"
        aria-label="Isi komentar"
        className="mt-3 w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
      />

      <div className="mt-3 flex justify-end">
        <Button
          type="submit"
          isLoading={isCommenting}
          disabled={!content.trim()}
        >
          Kirim komentar
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;
