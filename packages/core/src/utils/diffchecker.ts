/**
 * Deep compare two objects and return only the properties that have changed
 * @param original - The original object
 * @param updated - The updated object
 * @returns Object containing only the changed properties
 */
export function diffchecker<T extends Record<string, any>>(
  original: T,
  updated: T,
): Partial<T> {
  const changes: Partial<T> = {};

  // Compare each key in updated against original
  for (const key in updated) {
    if (updated.hasOwnProperty(key)) {
      const originalValue = original[key];
      const updatedValue = updated[key];

      // Skip if values are identical
      if (JSON.stringify(originalValue) === JSON.stringify(updatedValue)) {
        continue;
      }

      // Add to changes if different
      changes[key] = updatedValue;
    }
  }

  return changes;
}

/**
 * Check if two objects are equal (deep comparison)
 * @param obj1 - First object
 * @param obj2 - Second object
 * @returns true if objects are equal, false otherwise
 */
export function isDeepEqual(obj1: any, obj2: any): boolean {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}
