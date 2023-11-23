import { ChipPropsColorOverrides } from "@mui/material";
import { Check, Result } from "../types";
import { OverridableStringUnion } from "@mui/types";

type Color = OverridableStringUnion<
  | "primary"
  | "default"
  | "secondary"
  | "error"
  | "info"
  | "success"
  | "warning",
  ChipPropsColorOverrides
>;

export type ChipStatusCodeType = { label: string; color: Color };

/**
 * Generates an array of numbers from an array of strings. Each string can be in the format
 * "[start - end]" or be a standalone number.
 *
 * @param {string[]} inputs - Array of strings in either "[start - end]" format or standalone numbers.
 * @returns {number[]} An array of numbers generated from the input strings.
 * @throws {Error} Throws an error if a string does not match the expected formats.
 */
function generateStatusCodesList(statusCodes: string[]): number[] {
  const output: number[] = [];

  if (!statusCodes) return output;

  for (const sc of statusCodes) {
    const rangeMatch = sc.match(/\[(\d+) - (\d+)\]/);

    if (rangeMatch) {
      const start = parseInt(rangeMatch[1], 10);
      const end = parseInt(rangeMatch[2], 10);

      for (let i = start; i <= end; i++) {
        output.push(i);
      }
    } else if (!isNaN(Number(sc))) {
      output.push(Number(sc));
    } else {
      throw new Error(`Invalid format: ${sc}`);
    }
  }

  return output;
}

/**
 * Determines the status and corresponding color for a chip based on the provided check and result.
 *
 * @function
 * @param {Check} check - The check object containing data related to status codes.
 * @param {Result | undefined} result - The result object which may or may not contain status code data.
 * @returns {ChipStatusCodeType} Returns an object with label and color properties. The label can be "Up" or "Down",
 *                               and the color can be "success" or "error" based on the comparison of status codes.
 *
 * @example
 * const check = { data: { status_code: "200" } };
 * const result = { data: { status_code: "200" } };
 *
 * // Returns { label: "Up", color: "success" }
 * ChipStatusCode(check, result);
 *
 * @example
 * const check = { data: { status_code: "404" } };
 *
 * // Returns { label: "Down", color: "error" }
 * ChipStatusCode(check, undefined);
 *
 *
 * TODO: include All the following labels/colours
 * const TEMP_COLORS: Color[]  = ["error", "success", "warning", "secondary"];
 * const TEMP_LABELS: string[] = ["Down", "Up", "Pending", "Maintenance"];
 */
export const ChipStatusCode = (
  check: Check,
  result: Result | undefined
): ChipStatusCodeType => {
  const statusCodes = generateStatusCodesList(check?.data.status_code);
  for (const sc of statusCodes) {
    switch (sc === result?.data.status_code) {
      case true:
        return { label: "Up", color: "success" };
      default:
        return { label: "Down", color: "error" };
    }
  }
  return { label: "Down", color: "error" };
};
