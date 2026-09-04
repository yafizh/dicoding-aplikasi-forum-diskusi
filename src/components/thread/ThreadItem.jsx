import {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Link} from 'react-router-dom';

import Avatar from '../common/Avatar';
import Icon from '../common/Icon';
import VoteGroup from './VoteGroup';
import useVoteGuard from '../../hooks/useVoteGuard';
import {showFormattedDate, truncate} from '../../utils';
import {
  asyncVoteThread,
  makeSelectThreadVote,
} from '../../states/threads/threadsSlice';

const ThreadItem = ({thread}) => {
  const {id, title, category, excerpt, createdAt, owner} = thread;
  const userVote = useSelector(makeSelectThreadVote(id));
  const dispatch = useDispatch();

  const onVote = useVoteGuard(useCallback((voteType) => {
    dispatch(asyncVoteThread({threadId: id, voteType}));
  }, [dispatch, id]));

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-md hover:shadow-slate-900/5">
      <div className="flex items-center gap-2">
        <Avatar src={owner.avatar} name={owner.name} size="sm" />
        <span className="text-sm font-medium text-slate-700">
          {owner.name}
        </span>
        <span className="text-slate-300">·</span>
        <time
          dateTime={createdAt}
          className="inline-flex items-center gap-1 text-xs text-slate-500"
        >
          <Icon name="clock" className="h-3.5 w-3.5" />
          {showFormattedDate(createdAt)}
        </time>
      </div>

      <h2 className="mt-3 text-lg font-semibold text-slate-900">
        <Link
          to={`/threads/${id}`}
          className="transition-colors hover:text-brand-700"
        >
          {title}
        </Link>
      </h2>

      {category && (
        <span className="mt-2 inline-flex rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700">
          #{category}
        </span>
      )}

      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        {truncate(excerpt)}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-3">
        <VoteGroup
          upVotesBy={thread.upVotesBy}
          downVotesBy={thread.downVotesBy}
          userVote={userVote}
          onVote={onVote}
          size="sm"
        />
        <Link
          to={`/threads/${id}`}
          className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
        >
          <Icon name="chat" className="h-3.5 w-3.5" />
          {thread.totalComments} komentar
        </Link>
      </div>
    </article>
  );
};

export default ThreadItem;
