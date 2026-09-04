import {useDispatch, useSelector} from 'react-redux';

import Icon from '../common/Icon';
import {
  selectKeywordFilter,
  setKeyword,
} from '../../states/filter/filterSlice';

const ThreadSearch = () => {
  const keyword = useSelector(selectKeywordFilter);
  const dispatch = useDispatch();

  return (
    <div className="relative">
      <Icon
        name="search"
        className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400"
      />
      <input
        type="search"
        value={keyword}
        onChange={(event) => dispatch(setKeyword(event.target.value))}
        placeholder="Cari thread berdasarkan judul atau isi…"
        aria-label="Cari thread"
        className="w-full rounded-lg border border-slate-200 bg-white py-2 pr-3 pl-9 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
      />
    </div>
  );
};

export default ThreadSearch;
