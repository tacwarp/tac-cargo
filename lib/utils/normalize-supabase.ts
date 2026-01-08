/**
 * Utility functions to normalize Supabase query results
 * Supabase foreign key joins can return arrays or single objects depending on the relationship
 */

/**
 * Normalize a Supabase join result to a single object or null
 * Handles both array and object returns from Supabase
 */
export function normalizeJoin<T>(value: T | T[] | null | undefined): T | null {
    if (value === null || value === undefined) return null;
    if (Array.isArray(value)) return value[0] || null;
    return value;
}

/**
 * Normalize an array of records with joined relations
 */
export function normalizeRecords<T extends Record<string, unknown>>(
    records: T[],
    joinFields: (keyof T)[]
): T[] {
    return records.map(record => {
        const normalized = { ...record };
        for (const field of joinFields) {
            (normalized as Record<string, unknown>)[field as string] = normalizeJoin(record[field] as unknown[]);
        }
        return normalized;
    });
}
