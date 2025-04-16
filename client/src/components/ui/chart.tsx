import React, { useEffect, useRef } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  ArcElement,
  Title, 
  Tooltip, 
  Legend, 
  Filler,
  ChartData,
  ChartOptions
} from 'chart.js';
import { Line, Bar, Pie, Chart } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Default style configuration for charts
const defaultOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 12,
      titleColor: '#fff',
      bodyColor: '#fff',
      titleFont: {
        size: 14,
        weight: 'bold'
      },
      bodyFont: {
        size: 13
      },
      cornerRadius: 4,
      displayColors: true
    }
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
      },
      ticks: {
        font: {
          size: 12
        }
      }
    },
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
      },
      ticks: {
        font: {
          size: 12
        },
        precision: 0
      }
    }
  }
};

// Define interface for the chart data
interface ChartProps {
  data: ChartData<any, any, any>;
  options?: ChartOptions<any>;
  className?: string;
}

// Line Chart Component
export function LineChart({ data, options, className }: ChartProps) {
  const defaultLineOptions = {
    ...defaultOptions,
    elements: {
      line: {
        tension: 0.3,
        borderWidth: 2
      },
      point: {
        radius: 3,
        hoverRadius: 5
      }
    },
    scales: {
      ...defaultOptions.scales
    }
  };

  const mergedOptions = { ...defaultLineOptions, ...options };

  return (
    <div className={`w-full h-full ${className}`}>
      <Line data={data} options={mergedOptions} />
    </div>
  );
}

// Bar Chart Component
export function BarChart({ data, options, className }: ChartProps) {
  const defaultBarOptions = {
    ...defaultOptions,
    elements: {
      bar: {
        borderWidth: 1,
        borderRadius: 4
      }
    },
    scales: {
      ...defaultOptions.scales
    }
  };

  const mergedOptions = { ...defaultBarOptions, ...options };

  return (
    <div className={`w-full h-full ${className}`}>
      <Bar data={data} options={mergedOptions} />
    </div>
  );
}

// Horizontal Bar Chart Component
export function BarChartHorizontal({ data, options, className }: ChartProps) {
  const defaultHorizontalBarOptions = {
    ...defaultOptions,
    indexAxis: 'y' as const,
    elements: {
      bar: {
        borderWidth: 1,
        borderRadius: 4
      }
    },
    scales: {
      ...defaultOptions.scales
    }
  };

  const mergedOptions = { ...defaultHorizontalBarOptions, ...options };

  return (
    <div className={`w-full h-full ${className}`}>
      <Bar data={data} options={mergedOptions} />
    </div>
  );
}

// Pie Chart Component
export function PieChart({ data, options, className }: ChartProps) {
  const defaultPieOptions = {
    plugins: {
      ...defaultOptions.plugins,
      legend: {
        position: 'right' as const,
        labels: {
          usePointStyle: true,
          padding: 15,
          boxWidth: 8
        }
      }
    }
  };

  const mergedOptions = { ...defaultPieOptions, ...options };

  return (
    <div className={`w-full h-full ${className}`}>
      <Pie data={data} options={mergedOptions} />
    </div>
  );
}