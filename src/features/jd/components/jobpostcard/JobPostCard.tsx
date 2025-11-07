import React from 'react';

export type JobPostCardProps = {
  title: string;
  location: string;
  applicantsLabel?: string;
  statusLabel?: string; // '진행중' | '마감'
  thumbnailUrl?: string;
  skills?: string[];
  updatedAt?: string;
  postedAt?: string;
  onClick?: () => void;
  className?: string;
};

export default function JobPostCard({
  title,
  location,
  applicantsLabel,
  statusLabel = '진행중',
  thumbnailUrl = 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=800&auto=format&fit=crop',
  skills = [],
  updatedAt,
  postedAt,
  onClick,
  className = '',
}: JobPostCardProps) {
  return (
    <article
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (!onClick) return;
        if (e.key === 'Enter' || e.key === ' ') onClick();
      }}
      className={
        'group relative w-full overflow-hidden rounded-2xl bg-white p-3 sm:p-4 shadow-sm ring-1 ring-gray-200 transition hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ' +
        className
      }
    >
      <div className="flex gap-3 sm:gap-4">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl sm:h-20 sm:w-20 bg-gray-100">
          <img src={thumbnailUrl} alt="공고 대표 이미지" className="h-full w-full object-cover" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <h3 className="truncate text-base sm:text-lg font-semibold text-gray-900">{title}</h3>
            <span
              className={
                'ml-1 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ' +
                (statusLabel === '진행중' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600')
              }
            >
              {statusLabel}
            </span>
          </div>

          <p className="mt-1 text-xs sm:text-sm text-gray-600">
            {location}
            {applicantsLabel ? <span className="mx-2">·</span> : null}
            {applicantsLabel}
          </p>

          {skills?.length ? (
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {skills.map((s, i) => (
                <li
                  key={`${s}-${i}`}
                  className="rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-[10px] sm:text-xs text-gray-700"
                >
                  {s}
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {(updatedAt || postedAt) && (
          <div className="ml-auto hidden shrink-0 text-right sm:block">
            {updatedAt && <div className="text-[10px] text-gray-500">{updatedAt}</div>}
            {postedAt && <div className="mt-1 text-[10px] text-gray-400">{postedAt}</div>}
          </div>
        )}
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-0 ring-indigo-400/0 group-hover:ring-2 group-active:ring-4" />
    </article>
  );
}

export function JobPostCardSkeleton() {
  return (
    <div className="w-full animate-pulse rounded-2xl border border-gray-200 bg-white p-3 sm:p-4">
      <div className="flex gap-3 sm:gap-4">
        <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-1/2 rounded bg-gray-200" />
          <div className="h-3 w-1/3 rounded bg-gray-200" />
          <div className="flex gap-2 pt-1">
            <div className="h-5 w-14 rounded-full bg-gray-200" />
            <div className="h-5 w-12 rounded-full bg-gray-200" />
            <div className="h-5 w-16 rounded-full bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
  );
}
