import {useCallback, useState} from 'react';

export default function useInput(initialValue = '') {
  const [value, setValue] = useState(initialValue);

  const onChange = useCallback((event) => {
    setValue(event.target.value);
  }, []);

  const reset = useCallback(() => setValue(initialValue), [initialValue]);

  return [value, onChange, reset];
}
