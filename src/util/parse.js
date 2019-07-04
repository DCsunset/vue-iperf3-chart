export function parse(jsonData) {
	const data = jsonData;
	const intervals = data.intervals;

	return intervals.map(e => {
		return {
			x: e.sum.end,
			y: e.sum.bits_per_second
		};
	});
};
