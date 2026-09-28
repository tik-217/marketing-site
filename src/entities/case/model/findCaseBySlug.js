import { cases } from './cases'

export function findCaseBySlug(slug) {
  return cases.find((item) => item.slug === slug)
}
