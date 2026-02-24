export function unwrap<T>(raw: any): T {
  return raw?.data ?? raw;
}
