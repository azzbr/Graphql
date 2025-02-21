import React from 'react';

interface CardDataStatsProps {
  title: string;
  total: string;
  rateUp?: string;
  rateDown?: string;
  pending?: string;
  info?: string[];
  children: React.ReactNode;
  type?: 'default' | 'audit';
}

const CardDataStats: React.FC<CardDataStatsProps> = ({
  title,
  total,
  rateUp,
  rateDown,
  pending,
  info,
  children,
  type = 'default'
}) => {
  // Calculate progress bar percentages
  // Calculate progress bar percentages for audit ratio
  const upValue = parseFloat(rateUp?.replace('MB', '') || '0');
  const downValue = parseFloat(rateDown?.replace('MB', '') || '0');
  const maxValue = Math.max(upValue, downValue);
  const upPercent = maxValue > 0 ? (upValue / maxValue) * 100 : 0;
  const downPercent = maxValue > 0 ? (downValue / maxValue) * 100 : 0;

  // Calculate progress bar percentages for XP
  const currentXP = parseFloat(total?.replace('KB', '') || '0');
  const pendingXP = parseFloat(pending?.replace('KB', '') || '0');
  const totalPossibleXP = currentXP + pendingXP;
  const currentXPPercent = totalPossibleXP > 0 ? (currentXP / totalPossibleXP) * 100 : 0;
  const pendingXPPercent = totalPossibleXP > 0 ? (pendingXP / totalPossibleXP) * 100 : 0;

  return (
    <div className="card card-gradient">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/30">
          {children}
        </div>
        <div className="flex flex-col w-full">
          <div>
            <span className="stats-label text-sm">{title}</span>
            <div className="flex items-center">
              <span className="stats-value text-xl">{total}</span>
            </div>
          </div>
          {type === 'audit' && (
            <span className="text-sm font-medium text-primary mt-1">
              You can do better!
            </span>
          )}
        </div>
      </div>

      {type === 'audit' && rateUp && rateDown && (
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

      {pending && (
        <div className="mt-3 space-y-1.5">
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-medium text-success">Current</span>
              <span className="font-medium text-success">{total}</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-1.5 rounded-full bg-success transition-all duration-300"
                style={{ width: `${currentXPPercent}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-medium text-warning">To Gain</span>
              <span className="font-medium text-warning">{pending}</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-1.5 rounded-full bg-warning transition-all duration-300"
                style={{ width: `${pendingXPPercent}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardDataStats;
