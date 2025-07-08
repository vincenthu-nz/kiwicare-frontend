import { CheckIcon, ClockIcon, XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { humanizeStatus } from "@/app/lib/utils";

export default function OrderStatus({ status, paymentStatus }: {status: string, paymentStatus?: string}) {
  let colorClass = "";
  let Icon = null;

  if (["accepted", "in_progress", "completed"].includes(status)) {
    colorClass = "bg-green-500 text-white";
    Icon = CheckIcon;
  } else if (status === "pending") {
    colorClass = "bg-gray-100 text-gray-600";
    Icon = ClockIcon;
  } else if (["cancelled", "rejected"].includes(status)) {
    colorClass = "bg-red-500 text-white";
    Icon = XMarkIcon;
  } else {
    colorClass = "bg-gray-200 text-gray-600";
  }

  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        colorClass
      )}
    >
      {humanizeStatus(status)}{paymentStatus ? ` | ${humanizeStatus(paymentStatus)}` : ''}
      {Icon && <Icon className="ml-1 h-4 w-4"/>}
    </span>
  );
}
