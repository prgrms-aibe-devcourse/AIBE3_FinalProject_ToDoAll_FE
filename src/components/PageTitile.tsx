import type { MouseEventHandler, ReactNode } from 'react';
import cn from '@lib/utils/cn.ts';

export default function PageTitle({
  title,
  description,
  children,
  buttonOnClickFn,
}: {
  title: string;
  description: string;
  children: ReactNode;
  buttonOnClickFn?: MouseEventHandler<HTMLButtonElement> | undefined;
}) {
  return (
    <section className="bg-jd-white flex pb-20">
      <section className="flex w-full flex-col p-[2rem]">
        <section className="flex justify-between">
          <section className="flex flex-col">
            <h1 className="text-2xl font-semibold">{title}</h1>
            <p className="mb-[20px]">{description}</p>
          </section>
          <button
            className={cn(
              !buttonOnClickFn && 'hidden',
              'h-fit cursor-pointer rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none'
            )}
            onClick={buttonOnClickFn}
          >
            공고 등록
          </button>
        </section>
        <section className="w-full">{children}</section>
      </section>
    </section>
  );
}
