const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-pink-500 text-white flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">Tailwind 적용 테스트</h1>
      <p className="text-lg">Tailwind 작동 확인 완료.</p>
      <button className="px-6 py-2 bg-white text-indigo-600 font-semibold rounded shadow hover:bg-gray-100 transition">
        테스트 버튼
      </button>
    </div>
  );
};

export default App;
