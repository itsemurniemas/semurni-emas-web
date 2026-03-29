export function camelToSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`).replace(/^_/, '');
}

export function toSnakeCaseDictionary<T>(obj: T): Record<string, any> {
  if (Array.isArray(obj)) {
    return obj.map((v) => toSnakeCaseDictionary(v)) as any;
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((result, key) => {
      const snakeKey = camelToSnakeCase(key);
      const value = (obj as any)[key];
      result[snakeKey] = toSnakeCaseDictionary(value);
      return result;
    }, {} as Record<string, any>);
  }
  return obj as any;
}
