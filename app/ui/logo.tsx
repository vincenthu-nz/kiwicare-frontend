import { lusitana } from '@/app/ui/fonts';
import Image from 'next/image';

export default function Logo() {
  return (
    <div
      className={`${lusitana.className} flex w-full flex-col items-center justify-between text-white`}
    >
      <Image
        src="/kiwicare-white.png"
        alt="Kiwicare"
        width={72}
        height={72}
        className="h-10 w-10 md:h-16 md:w-16"
      />
      <p className="text-[23px] md:text-[42px]">KiwiCare</p>
    </div>
  );
}
