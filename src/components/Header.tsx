import { useApp } from '../store';

export function Header() {
  const { view, setView, interest, childName } = useApp();

  return (
    <header className="flex justify-between items-center px-6 py-4 max-w-5xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#5D5FEF] rounded-2xl flex items-center justify-center text-white font-bold text-xl">
          У
        </div>
        <span className="font-bold text-2xl tracking-tight text-[#1F2937]">
          ulka<span className="text-[#5D5FEF]">.platform</span>
        </span>
      </div>
      <div className="flex gap-2">
        {view !== 'onboarding' && (
          <>
            <button
              onClick={() => setView('child')}
              className={`px-4 py-2 text-sm font-semibold rounded-2xl transition ${
                view === 'child' ? 'bg-[#5D5FEF] text-white' : 'bg-white text-[#6B7280] hover:bg-gray-50'
              }`}
            >
              {childName ? `${childName}` : '👤 Ребёнок'}
            </button>
            <button
              onClick={() => setView('parent')}
              className={`px-4 py-2 text-sm font-semibold rounded-2xl transition ${
                view === 'parent' ? 'bg-[#5D5FEF] text-white' : 'bg-white text-[#6B7280] hover:bg-gray-50'
              }`}
            >
              👨‍👩‍👧 Родитель
            </button>
          </>
        )}
      </div>
    </header>
  );
}
