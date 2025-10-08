/**
 * Formatting Utilities
 *
 * Purpose: 提供格式化函式（數字、時間、日期）
 */

/**
 * 格式化數字為千分位格式
 * @example formatNumber(1234567) // "1,234,567"
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}

/**
 * 格式化時長（毫秒 → mm:ss）
 * @example formatDuration(222973) // "3:43"
 */
export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * 格式化日期
 * @example formatDate('2005-05-23') // "May 23, 2005"
 */
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
