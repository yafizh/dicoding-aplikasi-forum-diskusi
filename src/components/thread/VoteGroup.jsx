import Icon from '../common/Icon';
import {toggleVoteType, VOTE_TYPE} from '../../utils';

const SIZES = {
  sm: 'gap-1 px-2 py-1 text-xs',
  md: 'gap-1.5 px-2.5 py-1.5 text-sm',
};

const toneFor = (isActive, activeClass) =>
  `inline-flex items-center rounded-lg font-medium transition-colors ${
    isActive ?
      activeClass :
      'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
  }`;

const VoteGroup = ({
  upVotesBy,
  downVotesBy,
  userVote,
  onVote,
  size = 'md',
  className = '',
}) => {
  const isUpVoted = userVote === VOTE_TYPE.UP;
  const isDownVoted = userVote === VOTE_TYPE.DOWN;

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <button
        type="button"
        onClick={() => onVote(toggleVoteType(userVote, VOTE_TYPE.UP))}
        aria-pressed={isUpVoted}
        aria-label={isUpVoted ? 'Batalkan suka' : 'Suka'}
        className={`${toneFor(
            isUpVoted,
            'bg-emerald-50 text-emerald-600 hover:bg-emerald-100',
        )} ${SIZES[size]}`}
      >
        <Icon name="arrowUp" className="h-3.5 w-3.5" />
        {upVotesBy.length}
      </button>

      <button
        type="button"
        onClick={() => onVote(toggleVoteType(userVote, VOTE_TYPE.DOWN))}
        aria-pressed={isDownVoted}
        aria-label={isDownVoted ? 'Batalkan tidak suka' : 'Tidak suka'}
        className={`${toneFor(
            isDownVoted,
            'bg-rose-50 text-rose-600 hover:bg-rose-100',
        )} ${SIZES[size]}`}
      >
        <Icon name="arrowDown" className="h-3.5 w-3.5" />
        {downVotesBy.length}
      </button>
    </div>
  );
};

export default VoteGroup;
