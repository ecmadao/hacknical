
export const contributionLevel = (percentage) => {
  if (percentage >= 90) { return 5 }
  if (percentage >= 80) { return 4 }
  if (percentage >= 70) { return 3 }
  if (percentage >= 50) { return 2 }
  if (percentage >= 30) { return 1 }
  return 0
}
