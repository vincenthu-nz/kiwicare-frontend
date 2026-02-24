import { Revenue } from './definitions';

/**
 * Formats an integer-cent amount as a localised NZD currency string.
 *
 * @example formatCurrency(1050) // → "NZ$10.50"
 * @param amount - Amount in cents (e.g. 1050 = $10.50).
 */
export const formatCurrency = (amount: number) => {
  return (amount / 100).toLocaleString('en-NZ', {
    style: 'currency',
    currency: 'NZD',
  });
};

/**
 * Formats a date string for display in the New Zealand locale (Pacific/Auckland).
 *
 * @param dateStr  - ISO date string (e.g. "2024-06-15T10:00:00Z").
 * @param showTime - When `true`, appends 24-hour HH:MM:SS to the output.
 */
export const formatDateToLocal = (
  dateStr: string,
  showTime: boolean = false,
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

/**
 * Computes Y-axis labels and the top tick value for the revenue bar chart.
 * Labels are rendered top-to-bottom in `$NK` format (e.g. "$5K", "$4K", …).
 *
 * @param revenue - Array of monthly revenue data points (amounts already in dollars).
 * @param step    - Tick interval in dollars. Defaults to 1 000.
 */
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

/**
 * Returns an array of page numbers (and `'...'` ellipsis markers) for a
 * pagination control, capping at 7 visible items regardless of total pages.
 *
 * @param currentPage - The currently active page (1-based).
 * @param totalPages  - Total number of available pages.
 */
export const generatePagination = (currentPage: number, totalPages: number) => {
  // Show all pages when there are 7 or fewer — no truncation needed
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // Near the start: show first 3, ellipsis, last 2
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // Near the end: show first 2, ellipsis, last 3
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // Middle: show first page, ellipsis, current ±1, ellipsis, last page
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

/**
 * Converts a snake_case or kebab-case status string into a human-readable
 * Title Case label (e.g. `"in_progress"` → `"In Progress"`).
 *
 * @param status - Raw status string from the database.
 */
export function humanizeStatus(status: string): string {
  return status
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
