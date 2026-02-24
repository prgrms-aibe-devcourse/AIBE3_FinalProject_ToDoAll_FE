import { useState, useEffect } from 'react';
import {
  createInterviewEvaluation,
  getInterviewEvaluation,
  updateInterviewEvaluation,
} from '@features/interview/api/evaluation.api.ts';
import { useAuthedClient } from '@shared/hooks/useAuthClient.ts';

interface Scores {
  tech: string;
  comm: string;
  total: string;
  comment: string;
}

interface ScoreInputCardProps {
  interviewId: number;
}

export default function ScoreInputCard({ interviewId }: ScoreInputCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [evaluationId, setEvaluationId] = useState<number | null>(null);
  const [scores, setScores] = useState<Scores>({
    tech: '',
    comm: '',
    total: '',
    comment: '',
  });
  const client = useAuthedClient();

  useEffect(() => {
    if (!interviewId) return;

    (async () => {
      try {
        const data = await getInterviewEvaluation(client, interviewId);
        if (!data) {
          // 아직 평가 없음 → 입력 모드
          setIsEditing(true);
          setEvaluationId(null);
          setScores({ tech: '', comm: '', total: '', comment: '' });
          return;
        }

        // 서버에서 가져온 값으로 채우기
        setEvaluationId(data.evaluationId);
        setScores({
          tech: data.scoreTech?.toString() ?? '',
          comm: data.scoreComm?.toString() ?? '',
          total: data.scoreOverall?.toString() ?? '',
          comment: data.comment ?? '',
        });
        setIsEditing(false);
      } catch (e) {
        console.error('⚠️ 점수 조회 실패:', e);
      }
    })();
  }, [interviewId]);

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
    if (
      scores.tech !== '' &&
      scores.comm !== '' &&
      !Number.isNaN(techNum) &&
      !Number.isNaN(commNum)
    ) {
      const avg = ((techNum + commNum) / 2).toFixed(1);
      setScores((prev) => ({ ...prev, total: avg }));
    } else {
      setScores((prev) => ({ ...prev, total: '' }));
    }
  }, [scores.tech, scores.comm]);

  // 2) 저장 버튼
  const handleSave = async () => {
    if (scores.tech === '' || scores.comm === '' || scores.total === '') {
      alert('기술 / 커뮤니케이션 / 종합 점수를 모두 입력해 주세요.');
      return;
    }

    const payload = {
      scoreTech: Number(scores.tech),
      scoreComm: Number(scores.comm),
      scoreOverall: Number(scores.total),
      comment: scores.comment,
    };

    try {
      if (evaluationId == null) {
        // 처음 저장 (POST)
        const created = await createInterviewEvaluation(client, interviewId, payload);
        setEvaluationId(created.evaluationId);
      } else {
        // 이미 있으면 수정 (PATCH)
        await updateInterviewEvaluation(client, interviewId, evaluationId, payload);
      }

      alert('면접 점수가 저장되었습니다.');
      setIsEditing(false);
    } catch (e) {
      console.error(e);
      alert('면접 점수 저장 실패!');
    }
  };

  return (
    <div className="flex flex-col items-start justify-center text-sm">
      {isEditing ? (
        // 입력 모드
        <div className="border-jd-gray-light flex w-full flex-col space-y-4 rounded-2xl border bg-white p-5 shadow-md">
          {/* 기술 점수 */}
          <div className="flex flex-col">
            <label className="text-jd-gray-dark mb-1 font-medium">기술 점수</label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="0"
                max="100"
                value={scores.tech}
                onChange={(e) => handleChange('tech', e.target.value)}
                className="border-jd-gray-light w-1/3 appearance-none rounded border px-3 py-1 text-right [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                placeholder="0"
              />
              <span className="text-jd-gray-dark text-sm">점</span>
            </div>
          </div>

          {/* 커뮤니케이션 점수 */}
          <div className="flex flex-col">
            <label className="text-jd-gray-dark mb-1 font-medium">커뮤니케이션 점수</label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="0"
                max="100"
                value={scores.comm}
                onChange={(e) => handleChange('comm', e.target.value)}
                className="border-jd-gray-light w-1/3 appearance-none rounded border px-3 py-1 text-right [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                placeholder="0"
              />
              <span className="text-jd-gray-dark text-sm">점</span>
            </div>
          </div>

          {/* 종합 점수 */}
          <div className="flex flex-col">
            <label className="text-jd-gray-dark mb-1 font-medium">종합 점수</label>
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={scores.total}
                readOnly
                placeholder="자동 계산"
                className="border-jd-gray-light text-jd-scarlet w-1/3 rounded border bg-gray-50 px-3 py-1 text-right font-semibold"
              />
              <span className="text-jd-gray-dark text-sm">점</span>
            </div>
          </div>

          {/* 평가 코멘트 */}
          <div className="flex flex-col">
            <label className="text-jd-gray-dark mb-1 font-medium">평가 코멘트</label>
            <textarea
              value={scores.comment}
              onChange={(e) => setScores({ ...scores, comment: e.target.value })}
              placeholder="면접 평가 내용을 입력하세요"
              rows={3}
              className="border-jd-gray-light focus:outline-jd-gray-dark resize-none rounded border px-3 py-1"
            />
          </div>

          {/* 저장 버튼 (회색, 오른쪽 정렬) */}
          <div className="mt-3 flex justify-end">
            <button
              onClick={handleSave}
              className="rounded-md bg-gray-200 px-4 py-1.5 text-sm text-gray-700 transition hover:bg-gray-300"
            >
              저장
            </button>
          </div>
        </div>
      ) : (
        // 표시 모드 (저장된 점수가 있을 때만)
        <div className="border-jd-gray-light flex w-full flex-col items-start rounded-2xl border bg-white p-4 text-left shadow-sm">
          <div className="text-jd-gray-dark -mx-3 mb-2 grid w-full grid-cols-3 gap-1 text-sm font-medium">
            <div className="flex flex-col items-center">
              <span className="whitespace-nowrap">기술 점수</span>
              <span className="text-jd-yellow text-2xl font-bold">{scores.tech}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="whitespace-nowrap">커뮤니케이션 점수</span>
              <span className="text-jd-scarlet text-2xl font-bold">{scores.comm}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="whitespace-nowrap">종합 점수</span>
              <span className="text-jd-violet text-2xl font-bold">{scores.total}</span>
            </div>
          </div>

          {scores.comment && (
            <div className="mt-3 w-full">
              <p className="text-jd-gray-dark mb-1 text-sm font-semibold">평가 코멘트</p>
              <p className="text-jd-black rounded-md border border-gray-200 bg-gray-50 p-3 text-sm leading-relaxed whitespace-pre-wrap">
                {scores.comment}
              </p>
            </div>
          )}

          <div className="mt-3 flex w-full justify-end">
            <button
              onClick={() => setIsEditing(true)}
              className="rounded-md bg-gray-200 px-4 py-1.5 text-sm text-gray-600 transition hover:bg-gray-300"
            >
              수정
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
