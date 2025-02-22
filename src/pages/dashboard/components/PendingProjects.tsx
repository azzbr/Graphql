import React from 'react';

interface Project {
  attrs: {
    baseXp: number;
    requirements?: {
      core?: string;
      skills?: Record<string, number>;
      objects?: string[];
    };
  };
  key: string;
}

interface PendingProjectsProps {
  projects: Map<string, Project> | undefined;
}

const PendingProjects: React.FC<PendingProjectsProps> = ({ projects = new Map() }) => {
  const projectsList = Array.from(projects.entries());
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-primary"></span>
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Pending Projects
          </h4>
        </div>
        <span className="text-sm text-body dark:text-bodydark">
          {projectsList.length} projects
        </span>
      </div>

      <div className="flex flex-col overflow-auto max-h-[400px] rounded-lg">
        <div className="grid grid-cols-2 bg-primary/5 dark:bg-primary/10 rounded-t-lg">
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
        </div>

        <div className="divide-y divide-stroke dark:divide-strokedark">
          {projectsList.length > 0 ? projectsList.map(([name, project], key) => (
            <div
              key={key}
              className="grid grid-cols-2 hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors duration-200"
            >
              <div className="p-4">
                <p className="text-sm font-medium text-black dark:text-white">
                  {name}
                </p>
              </div>
              <div className="p-4 text-center">
                <p className="text-sm font-medium text-warning">
                  Pending ({(Math.round(project.attrs.baseXp / 1000)).toString()}KB)
                </p>
              </div>
            </div>
          )) : (
            <div className="p-4 text-center text-sm text-body dark:text-bodydark">
              No pending projects available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PendingProjects;
