<template>
  <div id="app">
    <canvas id="chart"></canvas>
  </div>
</template>

<script>
import { parse } from './util/parse.js';
import jsonData from './data.json';
import Chart from 'chart.js';

export default {
  name: 'app',
  mounted()
  {
    // id of canvas
    const ctx = 'chart';
    const data = parse(jsonData);
    data.forEach(e => {
      e.y /= 1024 * 1024;
      return e;
    });
    const chart = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: 'Speed',
            data: data.slice(1, 50),
            showLine: true,
            // Blue
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)'
          }
        ]
      },
      options: {
        scales: {
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: 'Time / s'
              }
            }
          ],
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: 'Speed / Mbits/s'
              }
            }
          ]
        }
      }
    });
  }
};
</script>
