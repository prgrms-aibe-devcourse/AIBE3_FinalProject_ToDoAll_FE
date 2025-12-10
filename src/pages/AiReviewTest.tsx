import { useState, useEffect, useCallback } from 'react';

interface Props {
  initial?: number;
}

export default function AiReviewTest({ initial = 0 }: Props) {
  const [count, setCount] = useState(initial);
  const [theme] = useState('light');

  const increment = useCallback(() => {
    setCount(count + 1);
  }, [count]);

  useEffect(() => {
    console.log('mounted or count changed:', count);
  }, [count]);

  return (
    <div className="p-4">
      <button className="rounded bg-red-500 px-4 py-2 text-white" onClick={increment}>
        Count: {count}
      </button>

      <div className="mt-2 text-sm text-gray-500">Current theme: {theme}</div>
    </div>
  );
}
