import {useCallback, useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import Avatar from '../common/Avatar';
import Icon from '../common/Icon';
import VoteGroup from '../thread/VoteGroup';
import useVoteGuard from '../../hooks/useVoteGuard';
import {sanitizeHtml, showFormattedDate, showFullDate} from '../../utils';
import {
  asyncVoteComment,
  makeSelectCommentVote,
} from '../../states/threadDetail/threadDetailSlice';

const CommentItem = ({comment}) => {
  const {id, content, createdAt, owner} = comment;
  const userVote = useSelector(makeSelectCommentVote(id));
  const dispatch = useDispatch();

  const onVote = useVoteGuard(useCallback((voteType) => {
    dispatch(asyncVoteComment({commentId: id, voteType}));
  }, [dispatch, id]));

  const body = useMemo(() => sanitizeHtml(content), [content]);

  return (
    <article className="border-t border-slate-100 py-5 first:border-t-0 first:pt-0">
      <div className="flex items-center gap-2">
        <Avatar src={owner.avatar} name={owner.name} size="sm" />
        <span className="text-sm font-medium text-slate-800">
          {owner.name}
        </span>
        <span className="text-slate-300">·</span>
        <time
          dateTime={createdAt}
          title={showFullDate(createdAt)}
          className="inline-flex items-center gap-1 text-xs text-slate-500"
        >
          <Icon name="clock" className="h-3.5 w-3.5" />
          {showFormattedDate(createdAt)}
        </time>
      </div>

      <div
        className="mt-2.5 text-sm leading-relaxed break-words text-slate-700 [&_a]:text-brand-600 [&_a]:underline"
        dangerouslySetInnerHTML={{__html: body}}
      />

      <VoteGroup
        className="mt-3"
        upVotesBy={comment.upVotesBy}
        downVotesBy={comment.downVotesBy}
        userVote={userVote}
        onVote={onVote}
        size="sm"
      />
    </article>
  );
};

export default CommentItem;
