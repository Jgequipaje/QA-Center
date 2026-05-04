export type { QACenterButtonColor, QACenterShape } from "./features/qa-center/types/index";
export type { QACenterProps } from "./features/qa-center/components/QACenter";
export { QACenter } from "./features/qa-center/components/QACenter";

/**
 * qaTest — wraps a test title with a stable [id:xxx] tag for DDT support.
 *
 * QA Center uses this ID to reliably link and run a specific test variant
 * even when the title contains dynamic values (e.g. from a data-driven loop).
 *
 * @example
 * // In a DDT loop:
 * test(qaTest("feat-001", `Can Add Feature — ${feature.name}`), async ({ page }) => { ... });
 *
 * // Produces: "[id:feat-001] Can Add Feature — Dark mode toggle"
 * // QA Center greps by [id:feat-001] — the dynamic part is ignored.
 */
export function qaTest(id: string, title: string): string {
  if (!id || typeof id !== "string") throw new Error("qaTest: id must be a non-empty string");
  if (!title || typeof title !== "string")
    throw new Error("qaTest: title must be a non-empty string");
  return `[id:${id}] ${title}`;
}
