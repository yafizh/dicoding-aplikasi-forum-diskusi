import LoadingSkeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Skeleton = ({className = '', ...props}) => (
  <LoadingSkeleton
    inline
    containerClassName={`flex ${className}`.trim()}
    {...props}
  />
);

export default Skeleton;
