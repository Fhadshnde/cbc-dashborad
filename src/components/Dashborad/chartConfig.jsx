import React from 'react';
import { Bar } from 'react-chartjs-2';
import './chartConfig.jsx';

const YearlySales = () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Branch A',
        data: [10, 20, 30, 40, 50, 60],
        backgroundColor: '#A155B9',
        borderRadius: 0 
      },
      {
        label: 'Branch B',
        data: [8, 18, 28, 38, 48, 58],
        backgroundColor: '#63ABFD',
        borderRadius: 0
      },
      {
        label: 'Branch C',
        data: [6, 16, 26, 36, 46, 56],
        backgroundColor: '#FFA5CB',
        borderRadius: 0 
      }
    ]
  };

  const options = {
    indexAxis: 'y',
    responsive: true,
    barThickness: 8,
    categoryPercentage: 0.7,
    barPercentage: 0.9,
    scales: {
      x: {
        beginAtZero: true,
        max: 120
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  return (
    <section className="yearly-sales-section">
      <div className="h-72 w-[400px] px-4 py-4 bg-white rounded-lg shadow-md flex flex-col justify-between">
      <div className='flex justify-between items-center'>
      <span className=''>Total Stores</span>
      <div className='flex justify-between items-center'>
      <span className='ml-5'>Sales Yearl</span>
      <span>50000</span>
      </div>
      </div>
      <Bar data={data} options={options} />
        <div className="yearly-info">
        </div>
      </div>
    </section>
  );
};

export default YearlySales;