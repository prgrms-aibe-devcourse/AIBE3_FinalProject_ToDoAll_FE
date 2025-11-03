import React from 'react';

const TailwindTest = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 text-white flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold mb-4">🚀 Tailwind 테스트 중!</h1>
      <p className="text-lg">Tailwind CSS가 적용 확인</p>
      <button className="mt-6 px-4 py-2 bg-white text-blue-600 font-semibold rounded shadow hover:bg-blue-100 transition">
        버튼 테스트
      </button>
    </div>
  );
};

export default TailwindTest;
