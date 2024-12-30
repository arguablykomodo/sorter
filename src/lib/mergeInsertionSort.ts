/**
 * Yields pairs of items, expecting a boolean to be passed on the following
 * `next` invocation, that should be `true` if the first item is lesser than the
 * second one. Returns a sorted array by the final iteration.
 */
export type Sorter<T, K> = Generator<[K, K], T[], boolean>;

export function* mergeInsertionSort<T, K>(
  items: T[],
  key: (item: T) => K,
): Sorter<T, K> {
  if (items.length <= 1) return items;

  // Split into pairs
  let pairs: [T, T][] = Array
    .from({ length: Math.floor(items.length / 2) })
    .map((_, i) => [items[i * 2], items[i * 2 + 1]]);

  // Order pairs
  for (const p of pairs) if (yield [key(p[0]), key(p[1])]) p.reverse();

  // Sort pairs by biggest element
  pairs = yield* mergeInsertionSort(pairs, (item) => key(item[1]));

  // Separate
  const sorted: T[] = [...pairs.shift()!]; // First pair + big element of pairs
  const unsorted: T[] = []; // Small element of pairs + leftover
  const indices: number[] = []; // Keeps track of binary search boundary
  for (const [a, b] of pairs) {
    indices.push(sorted.length);
    unsorted.push(a);
    sorted.push(b);
  }
  if (items.length % 2 === 1) {
    indices.push(sorted.length);
    unsorted.push(items.at(-1)!);
  }

  // Insert with funky indices
  let prev = 0;
  let curr = 2;
  while (unsorted.length > 0) {
    for (let i = curr - 1; i >= 0; i--) {
      if (i >= unsorted.length) continue;

      // Binary search
      let left = 0;
      let right = indices[i] - 1;
      while (left <= right) {
        const middle = Math.floor((left + right) / 2);
        if (yield [key(sorted[middle]), key(unsorted[i])]) right = middle - 1;
        else left = middle + 1;
      }
      const pos = left;

      indices.forEach((index, j) => indices[j] += index > pos ? 1 : 0);
      sorted.splice(pos, 0, unsorted[i]);
      indices.splice(i, 1);
      unsorted.splice(i, 1);
    }
    const next = curr + 2 * prev;
    prev = curr;
    curr = next;
  }

  return sorted;
}
