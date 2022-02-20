```ts
export function Find(target: number, array: number[][]): boolean {
	let r = 0;
	let c = array[0].length - 1;
	while (r >= 0 && r < array.length && c >= 0 && c < array[0].length) {
		if (array[r][c] === target) return true;
		if (array[r][c] > target) {
			c--;
			continue;
		}
		if (array[r][c] < target) {
			r++;
		}
	}
	return false;
}
console.log(
	Find(7, [
		[1, 2, 8, 9],
		[2, 4, 9, 12],
		[4, 7, 10, 13],
		[6, 8, 11, 15],
	])
);
console.log(Find(1, [[2]]));
console.log(
	Find(3, [
		[1, 2, 8, 9],
		[2, 4, 9, 12],
		[4, 7, 10, 13],
		[6, 8, 11, 15],
	])
);
console.log(
	Find(15, [
		[1, 2, 8, 9],
		[2, 4, 9, 12],
		[4, 7, 10, 13],
		[6, 8, 11, 15],
	])
);
