/**
 * How many icons a filtered view will expand on its own before it stops opening
 * sections. Both sources honour it, so a broad query ("a") lands as a list of
 * categories with counts instead of thousands of live cells; anything past the
 * budget is one click away.
 */
export const OPEN_BUDGET = 400
