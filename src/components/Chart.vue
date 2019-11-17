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
		// options except scales
		options: {
			type: Object,
			default: undefined
		},
		unit: {
			type: String,
			default: "Mbits"
		}
	},
	mounted() {
		// id of canvas
		const ctx = "chart";
		const data = parse(this.data);
		data.forEach(e => {
			e.y /= unitMap[this.unit];
			return e;
		});
		const chart = new Chart(ctx, {
			type: "scatter",
			data: {
				datasets: [
					{
						label: "Speed",
						data: data.slice(1, 50),
						showLine: true,
						// Blue
						borderColor: "rgb(54, 162, 235)",
						backgroundColor: "rgba(54, 162, 235, 0.2)"
					}
				]
			},
			options: {
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
								labelString: `Speed / ${this.unit}/s`
							}
						}
					]
				},
				...this.options
			}
		});
	}
};
</script>

