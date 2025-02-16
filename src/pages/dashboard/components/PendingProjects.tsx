import React from 'react';

interface Project {
  name: string;
  baseXp: number;
}

interface PendingProjectsProps {
  projects: string[];
}

const PendingProjects: React.FC<PendingProjectsProps> = ({ projects }) => {
  return (
    <div className="flex flex-col mt-4">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          Pending Projects
        </h4>
        <span className="text-sm text-body dark:text-bodydark">
          {projects.length} projects
        </span>
      </div>

      <div className="flex flex-col overflow-auto max-h-[400px] rounded-lg">
        <div className="grid grid-cols-3 bg-primary/5 dark:bg-primary/10 rounded-t-lg">
          <div className="p-4">
            <h5 className="text-sm font-medium text-black dark:text-white">
              Project
            </h5>
          </div>
          <div className="p-4 text-center">
            <h5 className="text-sm font-medium text-black dark:text-white">
              Status
            </h5>
          </div>
          <div className="p-4 text-center">
            <h5 className="text-sm font-medium text-black dark:text-white">
              Date
            </h5>
          </div>
        </div>

        <div className="divide-y divide-stroke dark:divide-strokedark">
          {projects.map((project, key) => (
            <div
              key={key}
              className="grid grid-cols-3 hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors duration-200"
            >
              <div className="p-4">
                <p className="text-sm font-medium text-black dark:text-white">
                  {project}
                </p>
              </div>
              <div className="p-4 text-center">
                <p className="text-sm font-medium text-warning">
                  Pending
                </p>
              </div>
              <div className="p-4 text-center">
                <p className="text-sm text-body dark:text-bodydark">
                  -
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PendingProjects;