import {Link} from 'react-router-dom';

import Icon from '../common/Icon';

const AuthShell = ({title, description, children, footer}) => (
  <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4 py-12">
    <Link to="/" className="mb-8 flex items-center justify-center gap-2">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm shadow-brand-600/30">
        <Icon name="chat" className="h-5 w-5" />
      </span>
      <span className="text-lg font-semibold tracking-tight text-slate-900">
        Forum<span className="text-brand-600">Diskusi</span>
      </span>
    </Link>

    <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm shadow-slate-900/5">
      <h1 className="text-xl font-bold tracking-tight text-slate-900">
        {title}
      </h1>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
      <div className="mt-6">{children}</div>
    </div>

    <p className="mt-6 text-center text-sm text-slate-600">{footer}</p>
  </div>
);

export default AuthShell;
