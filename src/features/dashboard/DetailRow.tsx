import type { ReactNode } from 'react';

export default function DetailRow({ children }: { children: ReactNode }) {
  return (
    <section className="flex w-full flex-row flex-wrap justify-center gap-4">{children}</section>
  );
}
