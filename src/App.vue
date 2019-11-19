<template>
	<div style="height: 95vh">
		<chart :data="jsonData" :options="options" :fillAlpha="0.3" />
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
			options: {
				maintainAspectRatio: false
			}
		};
	}
};
</script>
