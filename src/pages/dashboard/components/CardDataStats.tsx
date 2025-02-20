import React from 'react';

interface CardDataStatsProps {
  title: string;
  total: string;
  rateUp?: string;
  rateDown?: string;
  info?: string[];
  children: React.ReactNode;
  type?: 'default' | 'audit';
}

const CardDataStats: React.FC<CardDataStatsProps> = ({
  title,
  total,
  rateUp,
  rateDown,
  info,
  children,
  type = 'default'
}) => {
  // Calculate progress bar percentages
  const upValue = parseFloat(rateUp?.replace('MB', '') || '0');
  const downValue = parseFloat(rateDown?.replace('MB', '') || '0');
  const maxValue = Math.max(upValue, downValue);
  const upPercent = maxValue > 0 ? (upValue / maxValue) * 100 : 0;
  const downPercent = maxValue > 0 ? (downValue / maxValue) * 100 : 0;

  return (
    <div className="card card-gradient">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/30">
          {children}
        </div>
        <div>
          <span className="stats-label text-sm">{title}</span>
          <div className="flex items-center gap-2">
            <span className="stats-value text-xl">{total}</span>
            {type === 'audit' && (
              <span className="text-sm font-medium text-primary">
                You can do better!
              </span>
            )}
          </div>
        </div>
      </div>

      {(rateUp || rateDown) && (
        <div className="mt-3 space-y-1.5">
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-medium text-success">Done</span>
              <span className="font-medium text-success">{rateUp}</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-1.5 rounded-full bg-success transition-all duration-300"
                style={{ width: `${upPercent}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-medium text-danger">Received</span>
              <span className="font-medium text-danger">{rateDown}</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-1.5 rounded-full bg-danger transition-all duration-300"
                style={{ width: `${downPercent}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardDataStats;
