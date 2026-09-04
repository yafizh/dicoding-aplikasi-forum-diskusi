import {useCallback, useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import Avatar from '../common/Avatar';
import Icon from '../common/Icon';
import VoteGroup from './VoteGroup';
import useVoteGuard from '../../hooks/useVoteGuard';
import {sanitizeHtml, showFormattedDate, showFullDate} from '../../utils';
import {
  asyncVoteThreadDetail,
  selectDetailVote,
} from '../../states/threadDetail/threadDetailSlice';

const ThreadDetailCard = ({thread}) => {
  const userVote = useSelector(selectDetailVote);
  const dispatch = useDispatch();

  const onVote = useVoteGuard(useCallback((voteType) => {
    dispatch(asyncVoteThreadDetail({voteType}));
  }, [dispatch]));

  const body = useMemo(() => sanitizeHtml(thread.body), [thread.body]);

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-6">
      {thread.category && (
        <span className="inline-flex rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700">
          #{thread.category}
        </span>
      )}

      <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
        {thread.title}
      </h1>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Avatar src={thread.owner.avatar} name={thread.owner.name} />
        <div>
          <p className="text-sm font-medium text-slate-800">
            {thread.owner.name}
          </p>
          <time
            dateTime={thread.createdAt}
            title={showFullDate(thread.createdAt)}
            className="inline-flex items-center gap-1 text-xs text-slate-500"
          >
            <Icon name="clock" className="h-3.5 w-3.5" />
            {showFormattedDate(thread.createdAt)}
          </time>
        </div>
      </div>

      <div
        className="mt-5 space-y-3 text-sm leading-relaxed break-words text-slate-700 [&_a]:text-brand-600 [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-slate-200 [&_blockquote]:pl-3 [&_code]:rounded [&_code]:bg-slate-100 [&_code]:px-1 [&_h1]:text-lg [&_h1]:font-semibold [&_h2]:text-base [&_h2]:font-semibold [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5"
        dangerouslySetInnerHTML={{__html: body}}
      />

      <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
        <VoteGroup
          upVotesBy={thread.upVotesBy}
          downVotesBy={thread.downVotesBy}
          userVote={userVote}
          onVote={onVote}
        />
        <span className="inline-flex items-center gap-1.5 text-sm text-slate-500">
          <Icon name="chat" className="h-4 w-4" />
          {thread.comments.length} komentar
        </span>
      </div>
    </article>
  );
};

export default ThreadDetailCard;
