const Spinner = ({className = 'h-5 w-5', label}) => (
  <span className="inline-flex items-center gap-2" role="status">
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
      />
    </svg>
    <span className={label ? 'text-sm' : 'sr-only'}>
      {label ?? 'Memuat…'}
    </span>
  </span>
);

export default Spinner;
