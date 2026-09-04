import {useDispatch, useSelector} from 'react-redux';

import {
  selectCategoryFilter,
  setCategory,
} from '../../states/filter/filterSlice';
import {selectCategories} from '../../states/threads/threadsSlice';

const chipClass = (isActive) =>
  `rounded-full px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors ${
    isActive ?
      'bg-brand-600 text-white' :
      'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
  }`;

const CategoryFilter = () => {
  const categories = useSelector(selectCategories);
  const activeCategory = useSelector(selectCategoryFilter);
  const dispatch = useDispatch();

  if (categories.length === 0) return null;

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
      <span className="shrink-0 text-sm text-slate-500">Kategori:</span>
      <button
        type="button"
        onClick={() => dispatch(setCategory(null))}
        aria-pressed={activeCategory === null}
        className={chipClass(activeCategory === null)}
      >
        Semua
      </button>
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => dispatch(setCategory(
            activeCategory === category ? null : category,
          ))}
          aria-pressed={activeCategory === category}
          className={chipClass(activeCategory === category)}
        >
          #{category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
