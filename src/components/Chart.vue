<template>
	<div class="chart-container">
		<canvas id="chart"></canvas>
	</div>
</template>

<style scoped>
.chart-container {
	position: relative;
	height: 100%;
	width: 100%;
}
</style>

<script>
import { parse } from "../util/parse.js";
import Chart from "chart.js";

// import plugins
import "chartjs-plugin-annotation";
import "chartjs-plugin-colorschemes";

// Color schemes
import colorSchemes from "chartjs-plugin-colorschemes/src/colorschemes";

function getScheme(scheme) {
	let arr, category;

	arr = scheme.split(".");
	category = colorSchemes[arr[0]];
	if (category) {
		return category[arr[1]];
	}
}

const unitMap = {
	Gbits: 1e9,
	Mbits: 1e6,
	Kbits: 1e3
};

export default {
	props: {
		// json format
		data: {
			type: Array,
			default: undefined
		},
		options: {
			type: Object,
			default: undefined
		},
		unit: {
			type: String,
			default: "Mbits"
		},
		start: {
			type: Number,
			default: 0
		},
		end: {
			type: Number,
			default: -1
		},
		colorScheme: {
			type: String,
			default: "tableau.ClassicMedium10"
		},
		fillAlpha: {
			type: Number,
			default: 0.5
		}
	},

	watch: {
		// Rerender after updating
		data() {
			this.render();
		}
	},

	mounted() {
		this.render();
	},

	methods: {
		render() {
			// id of canvas
			const ctx = "chart";
			const parsedData = this.data.map(data => parse(data));

			// emit parsed data
			this.$emit("parsed", parsedData);

			const speed = `${this.unit}/s`;

			parsedData.forEach(data => {
				const { intervals, sum } = data;
				intervals.forEach(e => {
					e.y /= unitMap[this.unit];
					return e;
				});

				// add start point
				intervals.unshift({ x: 0, y: 0 });
			});

			// Color scheme
			const scheme = getScheme(this.colorScheme);

			const data = {
				datasets: parsedData.map((e, index) => ({
					label: `${index}`,
					data: e.intervals.slice(this.start, this.end),
					showLine: true
				}))
			};

			const options = {
				plugins: {
					colorschemes: {
						scheme: this.colorScheme,
						fillAlpha: this.fillAlpha
					}
				},
				scales: {
					xAxes: [
						{
							scaleLabel: {
								display: true,
								labelString: "Time / s"
							}
						}
					],
					yAxes: [
						{
							scaleLabel: {
								display: true,
								labelString: `Speed / ${speed}`
							}
						}
					]
				},
				annotation: {
					annotations: this.data.map((e, index) => {
						const data = e.intervals.slice(this.start, this.end);
						if (data.length <= 1) return {};

						const start = data[0];
						const end = data[data.length - 1];

						const sum =
							(data.reduce((acc, cur) => acc + cur.sum.bytes, 0) * 8) /
							unitMap[this.unit];
						const average = sum / (end.sum.end - start.sum.start);

						return {
							drawTime: "afterDatasetsDraw",
							id: `average-${index}`,
							type: "line",
							mode: "horizontal",
							scaleID: "y-axis-1",
							borderWidth: 1,
							borderColor: scheme[index % scheme.length],
							value: average,
							label: {
								enabled: true,
								position: "right",
								content: `${index} average: ${average}`
							}
						};
					})
				},
				...this.options
			};

			const chart = new Chart(ctx, {
				type: "scatter",
				data,
				options
			});
		}
	}
};
</script>

