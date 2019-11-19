<template>
	<div style="height: 95vh">
		<chart
			:data="jsonData"
			:labels="labels"
			:options="options"
			:fillAlpha="0.3"
		/>
	</div>
</template>

<script>
import jsonData from "./data.json";
import Chart from "./components/Chart.vue";

export default {
	name: "app",
	components: {
		Chart
	},
	data() {
		return {
			jsonData,
			labels: ["Label 1", "Label 2"],
			options: {
				maintainAspectRatio: false
			}
		};
	}
};
</script>
