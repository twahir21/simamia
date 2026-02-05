export function applyFilters<T>(
  data: T[],
  filters: Record<string, string>
): T[] {

  return data.filter(item => {

    for (const key in filters) {

      const value = filters[key];

      if (value === "all") continue;

      // generic matching
      if ((item as any)[key] !== value)
        return false;
    }

    return true;
  });
}
