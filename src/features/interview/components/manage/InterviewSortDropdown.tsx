import { useState, useRef, useEffect } from 'react';

interface JobPost {
  id: number;
  title: string;
}

interface InterviewSortDropdownProps {
  jobPosts: JobPost[];
  /* eslint-disable-next-line no-unused-vars */
  onSelect: (jdId: number | null) => void;
}

export default function InterviewSortDropdown({ jobPosts, onSelect }: InterviewSortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string>('공고별 보기 ▾');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleSelect = (post: JobPost | null) => {
    if (post) {
      setSelected(post.title);
      onSelect(post.id);
    } else {
      setSelected('공고별 보기 ▾');
      onSelect(null);
    }
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="translate-y-17 text-sm text-jd-gray-black hover:text-jd-black border border-gray-300 rounded-md px-3 py-1.5 bg-white transition"
      >
        {selected}
      </button>

      {isOpen && (
        <div className="absolute translate-y-17 right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          {/* 전체 보기 */}
          <button
            onClick={() => handleSelect(null)}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            전체 보기
          </button>

          <div className="border-t border-gray-100 my-1" />

          {/* 공고 리스트 */}
          {jobPosts.map((post) => (
            <button
              key={post.id}
              onClick={() => handleSelect(post)}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              {post.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
