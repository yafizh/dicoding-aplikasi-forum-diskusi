import {useDispatch, useSelector} from 'react-redux';
import {Link, NavLink, useNavigate} from 'react-router-dom';

import Avatar from '../common/Avatar';
import Button from '../common/Button';
import Icon from '../common/Icon';
import {logout, selectAuthUser} from '../../states/auth/authSlice';

const NAV_LINKS = [
  {to: '/', label: 'Beranda', icon: 'home', end: true},
  {to: '/leaderboards', label: 'Leaderboard', icon: 'trophy', end: false},
];

const navLinkClass = ({isActive}) =>
  `inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
    isActive ?
      'bg-brand-50 text-brand-700' :
      'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  }`;

const Navbar = () => {
  const authUser = useSelector(selectAuthUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center gap-3 px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm shadow-brand-600/30">
            <Icon name="chat" className="h-4.5 w-4.5" />
          </span>
          <span className="text-base font-semibold tracking-tight text-slate-900">
            Forum<span className="text-brand-600">Diskusi</span>
          </span>
        </Link>

        <nav className="ml-2 hidden items-center gap-1 sm:flex">
          {NAV_LINKS.map(({to, label, icon, end}) => (
            <NavLink key={to} to={to} end={end} className={navLinkClass}>
              <Icon name={icon} className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {authUser ? (
            <>
              <div className="flex items-center gap-2 rounded-full bg-slate-100 py-1 pr-3 pl-1">
                <Avatar src={authUser.avatar} name={authUser.name} size="sm" />
                <span className="max-w-28 truncate text-sm font-medium text-slate-700">
                  {authUser.name}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                aria-label="Keluar"
              >
                <Icon name="logout" className="h-4 w-4" />
                <span className="hidden sm:inline">Keluar</span>
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/login')}
              >
                Masuk
              </Button>
              <Button size="sm" onClick={() => navigate('/register')}>
                Daftar
              </Button>
            </>
          )}
        </div>
      </div>

      <nav className="flex items-center gap-1 border-t border-slate-100 px-4 py-2 sm:hidden">
        {NAV_LINKS.map(({to, label, icon, end}) => (
          <NavLink key={to} to={to} end={end} className={navLinkClass}>
            <Icon name={icon} className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
};

export default Navbar;
