import Avatar from '../common/Avatar';

const RANK_STYLES = [
  'bg-amber-100 text-amber-700 ring-amber-200',
  'bg-slate-200 text-slate-700 ring-slate-300',
  'bg-orange-100 text-orange-700 ring-orange-200',
];

const LeaderboardList = ({leaderboards, highlightUserId = null}) => (
  <ol className="divide-y divide-slate-100">
    {leaderboards.map(({user, score}, index) => (
      <li
        key={user.id}
        className={`flex items-center gap-3 px-5 py-4 ${
          user.id === highlightUserId ? 'bg-brand-50/60' : ''
        }`}
      >
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ring-1 ${
            RANK_STYLES[index] ?? 'bg-white text-slate-500 ring-slate-200'
          }`}
        >
          {index + 1}
        </span>

        <Avatar src={user.avatar} name={user.name} />

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-slate-800">
            {user.name}
            {user.id === highlightUserId && (
              <span className="ml-2 rounded bg-brand-100 px-1.5 py-0.5 text-xs font-medium text-brand-700">
                Anda
              </span>
            )}
          </p>
          <p className="truncate text-xs text-slate-500">{user.email}</p>
        </div>

        <span className="shrink-0 text-sm font-semibold text-brand-700">
          {score}
        </span>
      </li>
    ))}
  </ol>
);

export default LeaderboardList;
