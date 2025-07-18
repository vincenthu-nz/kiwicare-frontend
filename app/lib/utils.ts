import { Revenue } from './definitions';

export const formatCurrency = (amount: number) => {
  return (amount / 100).toLocaleString('en-NZ', {
    style: 'currency',
    currency: 'NZD',
  });
};

export const formatDateToLocal = (
  dateStr: string,
  showTime: boolean = false
): string => {
  const date = new Date(dateStr);

  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Pacific/Auckland',
  };

  if (showTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
    options.second = '2-digit';
    options.hour12 = false;
  }

  return new Intl.DateTimeFormat('en-NZ', options).format(date);
};


export const generateYAxis = (revenue: Revenue[], step: number = 1000) => {
  if (revenue.length === 0) return { yAxisLabels: [], topLabel: 0 };

  const yAxisLabels = [];
  const highestRecord = Math.max(...revenue.map((item) => item.revenue));
  const topLabel = Math.ceil(highestRecord / step) * step;

  for (let i = topLabel; i >= 0; i -= step) {
    yAxisLabels.push(`$${i / 1000}K`);
  }

  return { yAxisLabels, topLabel };
};

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page.tsx is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // If the current page.tsx is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page.tsx is somewhere in the middle,
  // show the first page.tsx, an ellipsis, the current page.tsx and its neighbors,
  // another ellipsis, and the last page.tsx.
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};

export function humanizeStatus(status: string): string {
  return status
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

