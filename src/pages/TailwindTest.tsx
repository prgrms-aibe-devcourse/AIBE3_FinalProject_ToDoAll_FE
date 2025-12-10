import { useState } from 'react';

const TailwindTest = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="mb-4 text-4xl font-bold">Tailwind Test</h1>
      <p className="mb-4">Count: {count}</p>
      <button
        className="rounded bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
        onClick={() => setCount(count + 1)}
      >
        Increment
      </button>
    </div>
  );
};

export default TailwindTest;
