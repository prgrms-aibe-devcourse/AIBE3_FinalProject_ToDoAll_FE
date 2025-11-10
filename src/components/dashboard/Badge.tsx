export default function Badge({
  text,
  color,
  className,
}: {
  text: string;
  color: 'scarlet' | 'violet' | 'gray';
  className?: string;
}) {
  return (
    <section
      className={
        `h-[30px] rounded-3xl text-sm font-light text-white pl-[20px] pr-[20px] pt-[5px] pb-[5px] bg-jd-${color} ` +
        className
      }
    >
      {text}
    </section>
  );
}
