/**
 * Utility function to combine CSS classes conditionally
 * Similar to the popular 'clsx' library but simplified for our needs
 * 
 * @param classes - Array of class names, objects with conditions, or conditional strings
 * @returns Combined class string
 * 
 * @example
 * cn('base-class', condition && 'conditional-class', { 'active': isActive })
 * cn(styles.button, styles.primary, isLoading && styles.loading)
 */
export function cn(...classes: (string | undefined | null | false | Record<string, boolean>)[]): string {
  const result: string[] = [];
  
  for (const cls of classes) {
    if (!cls) continue;
    
    if (typeof cls === 'string') {
      result.push(cls);
    } else if (typeof cls === 'object') {
      for (const [key, condition] of Object.entries(cls)) {
        if (condition) {
          result.push(key);
        }
      }
    }
  }
  
  return result.join(' ');
}

/**
 * Alternative approach using the filter method (current approach)
 * Keep this for backward compatibility
 */
export function combineClasses(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
