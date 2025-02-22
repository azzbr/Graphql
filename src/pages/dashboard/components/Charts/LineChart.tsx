import { ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';

const DynamicApexCharts = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

const options: ApexOptions = {
  chart: {
    fontFamily: 'Inter, sans-serif',
    height: 350,
    type: 'area',
    toolbar: {
      show: true,
                  tools: {
                    download: false,
                    selection: false,
                    zoom: false,
                    zoomin: true,
                    zoomout: true,
                    pan: true,
                    reset: true
      }
    },
    animations: {
      enabled: true,
      easing: 'easeinout',
      speed: 800,
    },
    dropShadow: {
      enabled: true,
      color: '#623CEA14',
      top: 10,
      blur: 4,
      left: 0,
      opacity: 0.1,
    },
  },
  colors: ['#3C50E0'],
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.4,
      opacityTo: 0.1,
      stops: [0, 90, 100],
    },
  },
  stroke: {
    curve: 'smooth',
    width: 3,
  },
  grid: {
    borderColor: '#E2E8F0',
    strokeDashArray: 2,
    xaxis: {
      lines: {
        show: false,
      },
    },
  },
  markers: {
    size: 6,
    colors: ['#fff'],
    strokeColors: '#3C50E0',
    strokeWidth: 3,
    hover: {
      size: 8,
    },
  },
  xaxis: {
    type: 'datetime',
    categories: [],
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    labels: {
      style: {
        colors: '#64748B',
        fontFamily: 'Inter, sans-serif',
      },
    },
  },
  yaxis: {
    title: {
      text: 'XP (KB)',
      style: {
        color: '#64748B',
        fontFamily: 'Inter, sans-serif',
        fontWeight: 500,
      },
    },
    min: 0,
    labels: {
      style: {
        colors: '#64748B',
        fontFamily: 'Inter, sans-serif',
      },
    },
  },
  tooltip: {
    theme: 'dark',
    x: {
      format: 'dd MMM yyyy',
    },
  },
};

interface LineChartState {
  series: {
    name: string;
    data: number[];
  }[];
}

interface Transaction {
  amount: number;
  createdAt: string;
  accumulated?: number;
  object: {
    name: string;
  };
}

interface LineChartProps {
  xps?: Transaction[];
  pendingProjects?: Map<string, { attrs: { baseXp: number } }>;
}

const LineChart: React.FC<LineChartProps> = ({ xps, pendingProjects }) => {
  const [state, setState] = useState<LineChartState>({
    series: [
      {
        name: 'XP',
        data: [],
      },
    ],
  });

  useEffect(() => {
    if (!xps) return;
    
    const sortedXps = [...xps].sort((a, b) => {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

    options.xaxis!.categories = sortedXps.map((transaction) => transaction.createdAt);

    let accumulatedSum = 0;
    const xpsWithAccumulated = sortedXps.map((transaction) => {
      accumulatedSum += transaction.amount;
      return {
        ...transaction,
        accumulated: accumulatedSum,
      };
    });

    if (Array.isArray(options.yaxis)) {
      options.yaxis[0].max = Math.round(accumulatedSum / 10) / 100;
    }

    const accumulatedData = xpsWithAccumulated.map((transaction) => {
      if (!transaction.accumulated) return 0;
      return Math.round(transaction.accumulated / 10) / 100;
    });

    setState({
      series: [{ name: 'XP', data: accumulatedData }],
    });
  }, [xps]);

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-primary"></span>
            <h4 className="text-xl font-semibold text-black dark:text-white">
              XP Progression
            </h4>
          </div>
        </div>
      </div>

      <div className="h-[350px] w-full">
        {xps && (
          <DynamicApexCharts
            options={{
              ...options,
              chart: {
                ...options.chart,
                toolbar: {
                  show: true,
                  tools: {
                    download: false,
                    selection: false,
                    zoom: false,
                    zoomin: true,
                    zoomout: true,
                    pan: true,
                    reset: true
                  },
                  autoSelected: 'pan'
                },
                zoom: {
                  enabled: true,
                  type: 'x',
                  autoScaleYaxis: true,
                  zoomedArea: {
                    fill: {
                      color: '#90CAF9',
                      opacity: 0.4
                    },
                    stroke: {
                      color: '#0D47A1',
                      opacity: 0.4,
                      width: 1
                    }
                  }
                }
              }
            }}
            series={state.series}
            type="area"
            height={350}
            width="100%"
          />
        )}
      </div>
    </div>
  );
};

export default LineChart;
