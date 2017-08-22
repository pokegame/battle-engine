export function deepClone<T>(object: T): T {
  return <T>JSON.parse(JSON.stringify(object));
}
