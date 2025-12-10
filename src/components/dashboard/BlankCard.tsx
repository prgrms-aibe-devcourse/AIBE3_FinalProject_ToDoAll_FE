import SelectIcon from '@components/SelectIcon.tsx';

export default function BlankCard({ text }: { text: string }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5 pt-10 pb-10 font-bold opacity-40">
      <SelectIcon name="circle-dashed" customize={{ size: 30, strokeWidth: 2.5 }} />
      {text}
    </div>
  );
}
