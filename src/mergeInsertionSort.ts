import { ItemData } from "./types.ts";

type Item = ItemData | [Item, Item];
type Comparer<T> = Generator<[ItemData, ItemData], T, boolean>;

function data(item: Item): ItemData {
  return Array.isArray(item) ? data(item[1]) : item;
}

function* search(items: Item[], item: Item): Comparer<number> {
  let left = 0;
  let right = items.length - 1;
  while (left <= right) {
    const middle = Math.floor((left + right) / 2);
    if (yield [data(items[middle]), data(item)]) right = middle - 1;
    else left = middle + 1;
  }
  return left;
}

export type Sorter = Comparer<ItemData[]>;
export function* mergeInsertionSort(items: Item[]): Comparer<Item[]> {
  // Split into pairs
  let pairs: [Item, Item][] = Array
    .from({ length: Math.floor(items.length / 2) })
    .map((_, i) => [items[i * 2], items[i * 2 + 1]]);

  // Order pairs
  for (const p of pairs) if (yield [data(p[0]), data(p[1])]) p.reverse();

  // Sort pairs
  if (pairs.length > 1) {
    pairs = (yield* mergeInsertionSort(pairs)) as [Item, Item][];
  }

  // Separate
  const sorted: Item[] = [...pairs.shift()!]; // First pair + big element of pairs
  const unsorted: Item[] = []; // Small element of pairs + leftover
  const indices: number[] = []; // Keeps track of binary search boundary
  for (const [a, b] of pairs) {
    indices.push(sorted.length);
    unsorted.push(a);
    sorted.push(b);
  }
  if (items.length % 2 === 1) {
    indices.push(indices.at(-1)! + 1);
    unsorted.push(items.at(-1)!);
  }

  // Insert with funky indices
  let prev = 0;
  let curr = 2;
  while (unsorted.length > 0) {
    for (let i = curr - 1; i >= 0; i--) {
      if (i >= unsorted.length) continue;
      const pos = yield* search(sorted.slice(0, indices[i] + 1), unsorted[i]);
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
