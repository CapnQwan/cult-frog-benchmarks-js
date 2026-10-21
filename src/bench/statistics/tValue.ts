/** Two-tailed Student's t critical values at 95% confidence for 1–30 degrees of freedom. */
const T_TABLE_95 = [
  12.706, 4.303, 3.182, 2.776, 2.571, 2.447, 2.365, 2.306, 2.262, 2.228, 2.201, 2.179, 2.16, 2.145,
  2.131, 2.12, 2.11, 2.101, 2.093, 2.086, 2.08, 2.074, 2.069, 2.064, 2.06, 2.056, 2.052, 2.048,
  2.045, 2.042,
];

/**
 * t critical value at 95% confidence. From 31 to 120 degrees of freedom the value at the lower
 * bound of each range is used, which slightly overstates the margin of error. Above 120 the
 * normal value 1.96 is used, which slightly understates it (t is 1.98 at 120).
 */
export function tValue95(degreesOfFreedom: number): number {
  if (degreesOfFreedom < 1) return Number.NaN;
  if (degreesOfFreedom <= 30) return T_TABLE_95[degreesOfFreedom - 1] ?? Number.NaN;
  if (degreesOfFreedom <= 40) return 2.042;
  if (degreesOfFreedom <= 60) return 2.021;
  if (degreesOfFreedom <= 120) return 2.0;
  return 1.96;
}
