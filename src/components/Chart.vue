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
// import it to work
import "chartjs-plugin-annotation";

const unitMap = {
	Gbits: 1e9,
	Mbits: 1e6,
	Kbits: 1e3
};

export default {
	props: {
		// json format
		data: {
			type: Object,
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
			const parsedData = parse(this.data);
			const { intervals, sum } = parsedData;

			// emit parsed data
			this.$emit("parsed", parsedData);

			const speed = `${this.unit}/s`;

			intervals.forEach(e => {
				e.y /= unitMap[this.unit];
				return e;
			});

			// add start point
			intervals.unshift({ x: 0, y: 0 });

			sum.received /= unitMap[this.unit];
			sum.sent /= unitMap[this.unit];

			const data = {
				datasets: [
					{
						label: `Speed`,
						data: intervals.slice(this.start, this.end),
						showLine: true,
						// Blue
						borderColor: "rgb(54, 162, 235)",
						backgroundColor: "rgba(54, 162, 235, 0.2)"
					}
				]
			};

			const options = {
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
					annotations: [
						{
							drawTime: "afterDatasetsDraw",
							id: "sum_received",
							type: "line",
							mode: "horizontal",
							scaleID: "y-axis-1",
							borderColor: "green",
							borderWidth: 1,
							value: sum.received,
							label: {
								enabled: true,
								position: "right",
								content: `Average received: ${sum.received} ${speed}`
							}
						},
						{
							id: "sum_sent",
							type: "line",
							mode: "horizontal",
							scaleID: "y-axis-1",
							borderColor: "purple",
							borderWidth: 1,
							value: sum.sent,
							label: {
								enabled: true,
								position: "right",
								content: `Average sent: ${sum.sent} ${speed}`
							}
						}
					]
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

