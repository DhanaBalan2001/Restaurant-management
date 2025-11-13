import React from 'react';
import { Line } from 'react-chartjs-2';

const RevenueChart = ({ data }) => {
  const chartData = {
    labels: data?.map(item => item.date) || [],
    datasets: [
      {
        label: 'Daily Revenue',
        data: data?.map(item => item.revenue) || [],
        fill: false,
        borderColor: '#4CAF50',
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Revenue Trends'
      }
    }
  };

  return (
    <div className="revenue-chart">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default RevenueChart;
