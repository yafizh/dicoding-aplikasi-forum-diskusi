import Icon from './Icon';

const EmptyState = ({
  icon = 'info',
  title,
  description,
  action = null,
}) => (
  <div className="flex flex-col items-center rounded-xl border border-dashed border-slate-300 bg-white/60 px-6 py-14 text-center">
    <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-500">
      <Icon name={icon} className="h-5 w-5" />
    </span>
    <h3 className="text-base font-semibold text-slate-800">{title}</h3>
    {description && (
      <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>
    )}
    {action && <div className="mt-5">{action}</div>}
  </div>
);

export default EmptyState;
