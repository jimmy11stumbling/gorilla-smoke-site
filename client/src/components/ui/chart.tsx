import React from 'react';
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
  ChartData,
  ChartOptions,
} from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import { cn } from '@/lib/utils';

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
  Legend
);

// Default options for all charts
const defaultOptions: ChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        font: {
          family: "'Inter', sans-serif",
          size: 12,
        },
        padding: 16,
      },
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleFont: {
        family: "'Inter', sans-serif",
        size: 14,
      },
      bodyFont: {
        family: "'Inter', sans-serif",
        size: 13,
      },
      padding: 12,
      cornerRadius: 8,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        font: {
          family: "'Inter', sans-serif",
          size: 12,
        },
      },
    },
    y: {
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
      },
      ticks: {
        font: {
          family: "'Inter', sans-serif",
          size: 12,
        },
      },
    },
  },
};

// Common interface for chart components
interface ChartProps {
  data: ChartData<any, any, any>;
  options?: ChartOptions;
  className?: string;
}

// Line Chart Component
export function LineChart({ data, options, className }: ChartProps) {
  return (
    <div className={cn("w-full", className)}>
      <Line 
        data={data} 
        options={{ 
          ...defaultOptions, 
          ...options 
        }} 
      />
    </div>
  );
}

// Bar Chart Component (vertical)
export function BarChart({ data, options, className }: ChartProps) {
  return (
    <div className={cn("w-full", className)}>
      <Bar 
        data={data} 
        options={{ 
          ...defaultOptions, 
          ...options, 
          indexAxis: 'x' as const 
        }} 
      />
    </div>
  );
}

// Bar Chart Component (horizontal)
export function BarChartHorizontal({ data, options, className }: ChartProps) {
  return (
    <div className={cn("w-full", className)}>
      <Bar 
        data={data} 
        options={{ 
          ...defaultOptions, 
          ...options, 
          indexAxis: 'y' as const 
        }} 
      />
    </div>
  );
}

// Pie Chart Component
export function PieChart({ data, options, className }: ChartProps) {
  return (
    <div className={cn("w-full", className)}>
      <Pie 
        data={data} 
        options={{ 
          ...defaultOptions, 
          ...options, 
          scales: {} // Remove scales for pie charts
        }} 
      />
    </div>
  );
}

// Doughnut Chart Component
export function DoughnutChart({ data, options, className }: ChartProps) {
  return (
    <div className={cn("w-full", className)}>
      <Doughnut 
        data={data} 
        options={{ 
          ...defaultOptions, 
          ...options, 
          scales: {} // Remove scales for doughnut charts
        }} 
      />
    </div>
  );
}