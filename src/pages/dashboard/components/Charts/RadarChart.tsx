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

interface RadarChartProps {
  skills?: Skill[];
}

const formatSkillName = (skillType: string) => {
  if (!skillType) return '';
  return skillType.startsWith('skill_') ? skillType.slice(6) : skillType;
};

const RadarChart: React.FC<RadarChartProps> = ({ skills }) => {
  const [formattedSkills, setFormattedSkills] = useState<{ name: string; amount: number }[]>([]);

  const chartOptions: ApexOptions = {
    chart: {
      fontFamily: 'Inter, sans-serif',
      height: 350,
      type: 'radar',
      toolbar: {
        show: false
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
      opacity: 0.4,
    },
    stroke: {
      width: 3,
    },
    grid: {
      borderColor: '#E2E8F0',
      padding: {
        top: 10,
        bottom: 10
      }
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
    plotOptions: {
      radar: {
        size: 140,
        polygons: {
          strokeColors: '#E2E8F0',
          connectorColors: '#E2E8F0',
          fill: {
            colors: ['#f8f8f8', '#fff']
          }
        }
      }
    },
    xaxis: {
      categories: formattedSkills.map(skill => skill.name),
      labels: {
        style: {
          colors: '#64748B',
          fontFamily: 'Inter, sans-serif',
        },
        formatter: (val: string) => {
          const skill = formattedSkills.find(s => s.name === val);
          return skill ? `${val} (${skill.amount}%)` : val;
        }
      }
    },
    yaxis: {
      show: false
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: (val: number) => `${val}%`
      }
    }
  };

  const [chartData, setChartData] = useState<{
    series: { name: string; data: number[] }[];
  }>({
    series: [{ name: 'Skill Amount', data: [] }]
  });

  useEffect(() => {
    if (!skills) return;

    const maxAmount = Math.max(...skills.map(skill => skill.amount));
    const topSkills = skills.slice(0, 5);
    const formatted = topSkills.map(skill => ({
      name: formatSkillName(skill.type),
      amount: Math.round((skill.amount / maxAmount) * 100)
    }));

    setFormattedSkills(formatted);
    setChartData({
      series: [{
        name: 'Skill Amount',
        data: formatted.map(skill => skill.amount)
      }]
    });
  }, [skills]);

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-primary"></span>
            <h4 className="text-xl font-semibold text-black dark:text-white">
              Top Skills
            </h4>
          </div>
        </div>
      </div>

      <div className="h-[350px] w-full">
        <DynamicApexCharts
          options={chartOptions}
          series={chartData.series}
          type="radar"
          height={350}
          width="100%"
        />
      </div>
    </div>
  );
};

export default RadarChart;
