const SIZES = {
  sm: 'h-7 w-7',
  md: 'h-9 w-9',
  lg: 'h-12 w-12',
};

const Avatar = ({src, name, size = 'md', className = ''}) => (
  <img
    src={src}
    alt={`Avatar ${name}`}
    loading="lazy"
    className={`${SIZES[size]} shrink-0 rounded-full bg-slate-200 object-cover ring-1 ring-slate-900/5 ${className}`}
  />
);

export default Avatar;
