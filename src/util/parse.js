export function parse(jsonData) {
	const data = jsonData;
	const intervals = data.intervals;
	const start = data.start;

	return {
		intervals: intervals.map(e => {
			return {
				x: e.sum.end,
				y: e.sum.bits_per_second
			};
		}),
		meta: {
			protocol: start.test_start.protocol,
			version: start.version,
			system_info: start.system_info,
			timestamp: start.timestamp.time
		}
	};
};
