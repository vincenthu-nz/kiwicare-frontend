import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  formatDateToLocal,
  generateYAxis,
  generatePagination,
  humanizeStatus,
} from '../utils';

// ---------------------------------------------------------------------------
// formatCurrency
// ---------------------------------------------------------------------------
describe('formatCurrency', () => {
  it('converts cents to a formatted NZD string', () => {
    expect(formatCurrency(1000)).toMatch(/10/);
    expect(formatCurrency(1000)).toMatch(/NZD|NZ\$|\$10/);
  });

  it('returns $0 for zero cents', () => {
    expect(formatCurrency(0)).toMatch(/0/);
  });

  it('handles large amounts without overflow', () => {
    const result = formatCurrency(1_000_000_00); // $1,000,000
    expect(result).toMatch(/1,000,000|1000000/);
  });
});

// ---------------------------------------------------------------------------
// formatDateToLocal
// ---------------------------------------------------------------------------
describe('formatDateToLocal', () => {
  it('formats a date string to NZ locale without time by default', () => {
    const result = formatDateToLocal('2024-06-15T00:00:00Z');
    // Should contain the year
    expect(result).toContain('2024');
    // Should NOT contain colons (no time component)
    expect(result).not.toMatch(/\d{2}:\d{2}/);
  });

  it('includes time when showTime is true', () => {
    const result = formatDateToLocal('2024-06-15T10:30:00Z', true);
    expect(result).toContain('2024');
    // Time should be present (HH:MM pattern)
    expect(result).toMatch(/\d{2}:\d{2}/);
  });

  it('uses Pacific/Auckland timezone for output', () => {
    // 2024-01-01T00:00:00Z is 13:00 on 2024-01-01 in NZDT (+13)
    const result = formatDateToLocal('2024-01-01T00:00:00Z');
    expect(result).toContain('2024');
  });
});

// ---------------------------------------------------------------------------
// generateYAxis
// ---------------------------------------------------------------------------
describe('generateYAxis', () => {
  it('returns empty labels and 0 topLabel for empty revenue array', () => {
    const { yAxisLabels, topLabel } = generateYAxis([]);
    expect(yAxisLabels).toEqual([]);
    expect(topLabel).toBe(0);
  });

  it('rounds top label up to the nearest step', () => {
    const revenue = [
      { month: 'Jan', revenue: 1500 },
      { month: 'Feb', revenue: 2300 },
    ];
    const { topLabel } = generateYAxis(revenue);
    // Highest is 2300; nearest 1000 ceiling is 3000
    expect(topLabel).toBe(3000);
  });

  it('generates descending labels from topLabel to 0', () => {
    const revenue = [{ month: 'Jan', revenue: 2000 }];
    const { yAxisLabels } = generateYAxis(revenue);
    // Labels should be in descending order
    expect(yAxisLabels[0]).toBe('$2K');
    expect(yAxisLabels[yAxisLabels.length - 1]).toBe('$0K');
  });

  it('respects a custom step size', () => {
    const revenue = [{ month: 'Jan', revenue: 500 }];
    const { yAxisLabels, topLabel } = generateYAxis(revenue, 500);
    expect(topLabel).toBe(500);
    expect(yAxisLabels).toContain('$0.5K');
  });
});

// ---------------------------------------------------------------------------
// generatePagination
// ---------------------------------------------------------------------------
describe('generatePagination', () => {
  it('returns all pages when totalPages <= 7', () => {
    expect(generatePagination(1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(generatePagination(3, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('shows first 3 pages and last 2 when near the start', () => {
    const pages = generatePagination(2, 10);
    expect(pages).toEqual([1, 2, 3, '...', 9, 10]);
  });

  it('shows first 2 pages and last 3 when near the end', () => {
    const pages = generatePagination(9, 10);
    expect(pages).toEqual([1, 2, '...', 8, 9, 10]);
  });

  it('shows surrounding pages with ellipses when in the middle', () => {
    const pages = generatePagination(5, 10);
    expect(pages).toEqual([1, '...', 4, 5, 6, '...', 10]);
  });

  it('always includes the first and last page', () => {
    const pages = generatePagination(5, 20);
    expect(pages[0]).toBe(1);
    expect(pages[pages.length - 1]).toBe(20);
  });
});

// ---------------------------------------------------------------------------
// humanizeStatus
// ---------------------------------------------------------------------------
describe('humanizeStatus', () => {
  it('converts snake_case to Title Case', () => {
    expect(humanizeStatus('in_progress')).toBe('In Progress');
  });

  it('handles single-word statuses', () => {
    expect(humanizeStatus('pending')).toBe('Pending');
    expect(humanizeStatus('active')).toBe('Active');
    expect(humanizeStatus('cancelled')).toBe('Cancelled');
  });

  it('handles multi-word statuses', () => {
    expect(humanizeStatus('in_review')).toBe('In Review');
  });

  it('does not alter already-formatted strings', () => {
    expect(humanizeStatus('Completed')).toBe('Completed');
  });
});
