import React from 'react';
import { Pie } from 'react-chartjs-2';

const PieChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.category),
    datasets: [{
      data: data.map(item => item.sales),
      backgroundColor: [
        '#e31837',
        '#ff6b81',
        '#ff4757',
        '#c41230'
      ]
    }]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right'
      }
    }
  };

  return <Pie data={chartData} options={options} />;
};

export default PieChart;
