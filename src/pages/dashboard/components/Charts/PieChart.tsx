import { ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';

const DynamicApexCharts = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

interface Skill {
  type: string;
  amount: number;
}

interface PieChartProps {
  skills?: Skill[];
}

const PieChart: React.FC<PieChartProps> = ({ skills }) => {
  const [chartData, setChartData] = useState<{
    series: number[];
    labels: string[];
  }>({
    series: [],
    labels: [],
  });

  useEffect(() => {
    if (!skills) return;

    const topSkills = skills.slice(0, 5);
    const series = topSkills.map((skill) => skill.amount);
    const labels = topSkills.map((skill) =>
      skill.type.startsWith('skill_') ? skill.type.slice(6) : skill.type
    );

    setChartData({ series, labels });
  }, [skills]);

  const options: ApexOptions = {
    chart: {
      fontFamily: 'Inter, sans-serif',
      type: 'donut',
      animations: {
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
    },
    colors: ['#3C50E0', '#10B981', '#375E83', '#259AE6', '#FFA70B'],
    labels: chartData.labels,
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      fontFamily: 'Inter, sans-serif',
      fontSize: '14px',
      fontWeight: 500,
      markers: {
        width: 8,
        height: 8,
        radius: 99,
      },
      itemMargin: {
        horizontal: 10,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              offsetY: -10,
            },
            value: {
              show: true,
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              formatter: function(val: string) {
                return `${parseFloat(val).toFixed(1)}KB`;
              },
            },
            total: {
              show: true,
              label: 'Total',
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              formatter: function(w: { globals: { seriesTotals: number[] } }) {
                const total = w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
                return `${total.toFixed(1)}KB`;
              },
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-primary"></span>
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Top Skills
          </h4>
        </div>
        {chartData.series.length > 0 && (
          <span className="text-sm text-body dark:text-bodydark">
            {chartData.series.length} skills
          </span>
        )}
      </div>

      <div className="h-[350px] w-full">
        {skills && skills.length > 0 && (
          <DynamicApexCharts
            options={options}
            series={chartData.series}
            type="donut"
            height={350}
            width="100%"
          />
        )}
      </div>
    </div>
  );
};

export default PieChart;
