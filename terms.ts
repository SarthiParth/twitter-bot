const SEARCH_TERMS = [
  "suicide",
  "depression",
  "anxiety",
  "relationship",
  "mental health",
  "mental wellness",
]

const INITIAL_TERM = SEARCH_TERMS[0]
SEARCH_TERMS.shift()

export const searchString = SEARCH_TERMS.reduce(
  (acc, curr) => acc + " OR " + curr,
  INITIAL_TERM
)
