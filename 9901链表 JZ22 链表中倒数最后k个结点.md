```js
function FindKthToTail(pHead, k) {
	let pk = pHead;
	while (pk) {
		pk = pk.next;
		if (k) {
			k--;
		} else {
			pHead = pHead.next;
		}
	}
	return k > 0 ? null : pHead;
}
