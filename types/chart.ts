// types/chart.ts

// Adjusting the ChartConfig to ensure the color property references Tailwind CSS color variables
export interface ChartConfig {
  [key: string]: {
    label: string;
    stacked?: boolean;
    color: string; // Ensure color is mandatory to avoid missing color values
  };
}

export interface ChartData {
  chartType: "bar" | "multiBar" | "line" | "pie" | "area" | "stackedArea";
  config: {
    title: string;
    description: string;
    trend?: {
      percentage: number;
      direction: "up" | "down";
    };
    footer?: string;
    totalLabel?: string;
    xAxisKey?: string;
  };
  data: Array<Record<string, any>>;
  chartConfig: ChartConfig;
}

// Example usage of chartConfig with Tailwind CSS variables
const chartConfig: ChartConfig = {
  dataset1: {
    label: "Dataset 1",
    color: getComputedStyle(document.documentElement).getPropertyValue('--chart-1'), // Fetch color from CSS variable
    stacked: false
  },
  dataset2: {
    label: "Dataset 2",
    color: getComputedStyle(document.documentElement).getPropertyValue('--chart-2'), // Fetch color from CSS variable
    stacked: false
  },
  dataset3: {
    label: "Dataset 3",
    color: getComputedStyle(document.documentElement).getPropertyValue('--chart-3'), // Fetch color from CSS variable
    stacked: false
  }
};
