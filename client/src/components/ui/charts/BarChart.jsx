import React from 'react';
import { Bar } from 'react-chartjs-2';

const BarChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.hour),
    datasets: [{
      label: 'Orders per Hour',
      data: data.map(item => item.count),
      backgroundColor: '#e31837',
      borderColor: '#c41230',
      borderWidth: 1
    }]
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return <Bar data={chartData} options={options} />;
};

export default BarChart;
