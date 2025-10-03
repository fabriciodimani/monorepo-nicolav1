export const getCssVariable = (variableName, fallback = "") => {
  if (typeof window === "undefined" || !window.document) {
    return fallback;
  }

  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(variableName)
    .trim();

  return value || fallback;
};
