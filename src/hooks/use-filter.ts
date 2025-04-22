import { useMemo, useState } from "react";

export function useFilter<T>(
  items: T[],
  filterFn: (item: T, term: string) => boolean,
) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = useMemo(
    () => items.filter((item) => filterFn(item, searchTerm)),
    [items, searchTerm, filterFn],
  );

  return { searchTerm, setSearchTerm, filteredItems };
}
