import Spinner from './Spinner';

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60';

const VARIANTS = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700',
  secondary: 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50',
  ghost: 'text-slate-600 hover:bg-slate-100',
  danger: 'bg-rose-600 text-white hover:bg-rose-700',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
};

const Button = ({
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  children,
  disabled,
  ...rest
}) => {
  const isNativeButton = Component === 'button';

  return (
    <Component
      className={`${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...(isNativeButton ? {disabled: disabled || isLoading} : {})}
      {...rest}
    >
      {isLoading && <Spinner className="h-4 w-4" />}
      {children}
    </Component>
  );
};

export default Button;
