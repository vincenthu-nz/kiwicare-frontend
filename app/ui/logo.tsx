import { lusitana } from '@/app/ui/fonts';
import { GlobeAltIcon } from '@heroicons/react/24/outline';

export default function Logo() {
  return (
    <div
      className={`${lusitana.className} flex w-full flex-col items-center justify-between text-white`}
    >
      <GlobeAltIcon className="h-8 w-8 rotate-[15deg] lg:h-14 lg:w-14" />
      <p className="text-[25px] lg:text-[44px]">KiwiCare</p>
    </div>
  );
}
