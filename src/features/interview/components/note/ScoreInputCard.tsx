import { useState, useEffect } from 'react';

interface Scores {
  tech: string;
  comm: string;
  total: string;
  comment: string;
}

interface ScoreInputCardProps {
  initialScores?: Scores;
}

export default function ScoreInputCard({ initialScores }: ScoreInputCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [scores, setScores] = useState<Scores>(
    initialScores || { tech: '', comm: '', total: '', comment: '' }
  );

  useEffect(() => {
    if (initialScores) {
      setScores(initialScores);
    }
  }, [initialScores]);

  // 0~100 범위 제한
  const handleChange = (key: 'tech' | 'comm', value: string) => {
    const num = Number(value);
    if (value === '' || (!isNaN(num) && num >= 0 && num <= 100)) {
      setScores((prev) => ({ ...prev, [key]: value }));
    }
  };

  // 평균 자동 계산
  useEffect(() => {
    const techNum = Number(scores.tech);
    const commNum = Number(scores.comm);
    if (!isNaN(techNum) && !isNaN(commNum) && scores.tech !== '' && scores.comm !== '') {
      const avg = ((techNum + commNum) / 2).toFixed(1);
      setScores((prev) => ({ ...prev, total: avg }));
    } else {
      setScores((prev) => ({ ...prev, total: '' }));
    }
  }, [scores.tech, scores.comm]);

  const handleSave = () => {
    if (scores.tech !== '' && scores.comm !== '' && scores.total !== '') {
      setIsEditing(false);
    }
  };

  return (
    <div className="text-sm flex flex-col items-start justify-center">
      {isEditing ? (
        // 입력 모드
        <div className="bg-white border border-jd-gray-light rounded-2xl shadow-md p-5 flex flex-col w-full space-y-4">
          {/* 기술 점수 */}
          <div className="flex flex-col">
            <label className="font-medium mb-1 text-jd-gray-dark">기술 점수</label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="0"
                max="100"
                value={scores.tech}
                onChange={(e) => handleChange('tech', e.target.value)}
                className="w-1/3 border border-jd-gray-light rounded px-3 py-1 text-right
                   appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <span className="text-jd-gray-dark text-sm">점</span>
            </div>
          </div>

          {/* 커뮤니케이션 점수 */}
          <div className="flex flex-col">
            <label className="font-medium mb-1 text-jd-gray-dark">커뮤니케이션 점수</label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="0"
                max="100"
                value={scores.comm}
                onChange={(e) => handleChange('comm', e.target.value)}
                className="w-1/3 border border-jd-gray-light rounded px-3 py-1 text-right
                   appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <span className="text-jd-gray-dark text-sm">점</span>
            </div>
          </div>

          {/* 종합 점수 */}
          <div className="flex flex-col">
            <label className="font-medium mb-1 text-jd-gray-dark">종합 점수</label>
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={scores.total}
                readOnly
                className="w-1/3 border border-jd-gray-light rounded px-3 py-1 bg-gray-50 text-right font-semibold text-jd-scarlet"
              />
              <span className="text-jd-gray-dark text-sm">점</span>
            </div>
          </div>

          {/* 평가 코멘트 */}
          <div className="flex flex-col">
            <label className="font-medium mb-1 text-jd-gray-dark">평가 코멘트</label>
            <textarea
              value={scores.comment}
              onChange={(e) => setScores({ ...scores, comment: e.target.value })}
              placeholder="면접 평가 내용을 입력하세요"
              rows={3}
              className="border border-jd-gray-light rounded px-3 py-1 resize-none focus:outline-jd-gray-dark"
            />
          </div>

          {/* 저장 버튼 (회색, 오른쪽 정렬) */}
          <div className="flex justify-end mt-3">
            <button
              onClick={handleSave}
              className="bg-gray-200 text-gray-700 rounded-md px-4 py-1.5 text-sm hover:bg-gray-300 transition"
            >
              저장
            </button>
          </div>
        </div>
      ) : scores.tech && scores.comm && scores.total ? (
        // 표시 모드
        <div className="flex flex-col items-start text-left w-full p-2 bg-white rounded-2xl shadow-sm border border-jd-gray-light">
          <div className="flex justify-between w-full text-sm font-medium text-jd-gray-dark mb-2">
            <div className="flex flex-col items-center flex-1">
              <span>기술 점수</span>
              <span className="text-jd-yellow text-2xl font-bold">{scores.tech}</span>
            </div>
            <div className="flex flex-col items-center flex-1">
              <span>커뮤니케이션 점수</span>
              <span className="text-jd-scarlet text-2xl font-bold">{scores.comm}</span>
            </div>
            <div className="flex flex-col items-center flex-1">
              <span>종합 점수</span>
              <span className="text-jd-violet text-2xl font-bold">{scores.total}</span>
            </div>
          </div>

          {scores.comment && (
            <div className="w-full mt-3">
              <p className="text-sm font-semibold text-jd-gray-dark mb-1">평가 코멘트</p>
              <p className="text-sm text-jd-black leading-relaxed bg-gray-50 p-3 rounded-md border border-gray-200 whitespace-pre-wrap">
                {scores.comment}
              </p>
            </div>
          )}

          <div className="flex justify-end w-full mt-3">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-gray-200 text-gray-600 px-4 py-1.5 rounded-md text-sm hover:bg-gray-300 transition"
            >
              수정
            </button>
          </div>
        </div>
      ) : (
        // + 버튼
        <button
          onClick={() => setIsEditing(true)}
          className="flex items-center justify-center w-10 h-10 rounded-full border border-jd-gray-light hover:bg-gray-50 transition self-center"
        >
          <span className="text-2xl text-jd-gray-dark leading-none">＋</span>
        </button>
      )}
    </div>
  );
}
