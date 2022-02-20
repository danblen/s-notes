function jumpFloorII(number) {
	let dp = Array(number).fill(1);
	for (let i = 1; i < number; i++) {
		// let preSum = 0;
		// for (let j = 0; j < i; j++) {
		// 	preSum += dp[j];
		// }
		// dp[i] += preSum;
		dp[i] += dp.reduce((acc, cur, index) => {
			if (index >= i) return acc;
			return acc + cur;
		}, 0);
	}
	return dp[number - 1];
}
console.log(jumpFloorII(3));
console.log(jumpFloorII(1));

function Fibonacci(n) {
	return;
}
