export function weekDifference(date: Date) {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
  return diffWeeks;
}

export function isObjectContainUndefined(object: Record<string, any>) {
  return Object.keys(object).every(
    (key) => object[key] === "" || object[key] === undefined
  );
}
