/**
 * @param {number[]} nums
 * @return {boolean}
 */
var canJump = function (nums) {
	let end = 0;
	let maxPosition = 0;
	let steps = 0;
	for (let i = 0; i < nums.length - 1; i++) {
		maxPosition = Math.max(maxPosition, i + nums[i]);
		if (i == end) {
			end = maxPosition;
			steps++;
		}
	}
	return steps;
};
