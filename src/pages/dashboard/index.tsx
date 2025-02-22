import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { fetchGQLData } from '@/graphql/client';
import {
  GET_MODULE_EVENT,
  GET_PROJECTS_TRANSACTIONS,
  GET_USER_WITH_AUDIT,
  GET_XP,
  GET_SKILLS,
  GET_MODULE_CHILDREN,
  GET_LEVEL_INFO,
} from '@/graphql/queries';
import CardDataStats from './components/CardDataStats';
import LevelCard from './components/LevelCard';
import LineChart from './components/Charts/LineChart';
import { ApolloError } from '@apollo/client';
import RadarChart from './components/Charts/RadarChart';
import Table from './components/Table';
import PendingProjects from './components/PendingProjects';

interface User {
  id: number;
  login: string;
  firstName: string;
  lastName: string;
  auditRatio: number;
  totalUp: number;
  totalDown: number;
  xp?: number;
  attrs: {
    gender: string;
  };
}

interface UserModuleEvent {
  eventId: number;
  level: number;
  event: {
    campus: string;
    createdAt: string;
    endAt: string;
    id: number;
    path: string;
    registrations: {
      id: number;
    }[];
  };
}

interface Transaction {
  amount: number;
  createdAt: string;
  object: {
    name: string;
  };
}

interface Skill {
  type: string;
  amount: number;
}

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

const getRank = (level: number): { currentRank: string; levelsToNext: number } => {
  if (level < 30) return { currentRank: 'Apprentice developer', levelsToNext: 30 - level };
  if (level < 35) return { currentRank: 'Junior developer', levelsToNext: 35 - level };
  if (level < 40) return { currentRank: 'Mid-level developer', levelsToNext: 40 - level };
  return { currentRank: 'Senior developer', levelsToNext: 0 };
};

const Dashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState<User>();
  const [moduleEvent, setModuleEvent] = useState<UserModuleEvent>();
  const [levelInfo, setLevelInfo] = useState<{ nextLevelXp: number }>();
  const [xps, setXPs] = useState<Transaction[]>();
  const [skills, setSkills] = useState<Skill[]>();
  const [projects, setProjects] = useState<Map<string, Project>>();
  const [openProjects, setOpenProjects] = useState<Map<string, Project>>();

  const fetchDashboardData = async (token: string) => {
    try {
      // Get user data
      const userRes = await fetchGQLData(GET_USER_WITH_AUDIT, token);
      const userData = userRes.data;
      if (!userData || userData.user.length === 0) {
        console.error('No user found');
        return;
      }
      setUser(userData.user[0]);

      // Get module event data
      const eventsRes = await fetchGQLData(GET_MODULE_EVENT, token, {
        userId: userData.user[0].id,
        modulePath: '/bahrain/bh-module',
      });
      const moduleEventData = eventsRes.data;
      if (
        moduleEventData.user.length === 0 ||
        moduleEventData.user[0].events.length === 0
      ) {
        console.error('No user or module found');
        return;
      }
      setModuleEvent(moduleEventData.user[0].events[0]);

      // Get user xp
      const xpRes = await fetchGQLData(GET_XP, token, {
        userId: userData.user[0].id,
        rootEventId: moduleEventData.user[0].events[0].eventId,
      });
      const xpData = xpRes.data;
      if (xpData.xp.aggregate.sum.amount === null) {
        console.error('No xp found');
        return;
      }
      const updatedUser = {
        ...userData.user[0],
        xp: xpData.xp.aggregate.sum.amount,
      };
      setUser(updatedUser);

      // Calculate next level XP requirement
      const level = moduleEventData.user[0].events[0].level;
      const nextLevelXpNeeded = Math.round(((level + 1) * 1950) / 1000 * 10) / 10;
      setLevelInfo({ nextLevelXp: nextLevelXpNeeded });

      // Get xp progression data
      const xpsRes = await fetchGQLData(GET_PROJECTS_TRANSACTIONS, token, {
        userId: userData.user[0].id,
        eventId: moduleEventData.user[0].events[0].eventId,
      });
      const xpsData = xpsRes.data;
      if (!xpsData.transaction) {
        console.error('No xp progression found');
        return;
      }
      setXPs(xpsData.transaction);

      // Get user skills
      const skillsRes = await fetchGQLData(GET_SKILLS, token, {
        userId: userData.user[0].id,
      });
      const skillsData = skillsRes.data;
      if (!skillsData.transaction) {
        console.error('No skills found');
        return;
      }
      const skills = skillsData.transaction;
      const sortedSkills = [...skills].sort((a, b) => b.amount - a.amount);
      setSkills(sortedSkills);

      // Get module children
      const modChildrenRes = await fetchGQLData(GET_MODULE_CHILDREN, token, {
        eventId: moduleEventData.user[0].events[0].eventId,
        registrationId:
          moduleEventData.user[0].events[0].event.registrations[0].id,
      });
      const modChildrenData = modChildrenRes.data;
      if (!modChildrenData.object[0].childrenRelation) {
        console.error('No projects found');
        return;
      }
      const allProjects = modChildrenData.object[0].childrenRelation;
      const projectsMap = new Map();
      allProjects.forEach((project: any) => {
        if (
          project.paths?.length !== 0 &&
          project.paths?.[0]?.object?.name !== null &&
          project.attrs
        ) {
          projectsMap.set(project.paths[0].object.name, {
            attrs: {
              ...project.attrs,
              requirements: project.attrs.requirements || {}
            },
            key: project.key,
          });
        }
      });

      setProjects(projectsMap);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (
        error instanceof ApolloError &&
        error.graphQLErrors &&
        error.graphQLErrors[0].extensions &&
        error.graphQLErrors[0].extensions.code === 'invalid-jwt'
      ) {
        localStorage.removeItem('hasura-jwt-token');
        router.push('/login');
      }
      return;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('hasura-jwt-token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchDashboardData(token);
  }, []);

  useEffect(() => {
    if (!moduleEvent || !xps || !skills || !projects) return;
    
    // Create a skills map
    const skillMap = new Map();
    skills.forEach((skill: Skill) => {
      const trimmedKey = skill.type.startsWith('skill_')
        ? skill.type.slice(6)
        : skill.type;
      skillMap.set(trimmedKey, skill.amount);
    });

    const filteredProjects = new Map<string, Project>(
      Array.from(projects.entries()).filter(([key, project]) => {
        if (!project.attrs) return false;

        // Remove any piscine
        if (
          key.toLowerCase().includes('piscine') ||
          key.toLowerCase().includes('checkpoint')
        )
          return false;

        // Check for matching transaction
        if (xps.some((transaction) => transaction.object.name === key)) {
          return false;
        }

        // Exclude projects that can't be done depending on the core requirement
        const requiredCore = project.attrs?.requirements?.core;
        if (requiredCore) {
          const trimReqObj = requiredCore.startsWith('../')
            ? requiredCore.slice(3)
            : requiredCore;
          const reqIsDone = xps.some(
            (transaction) => transaction.object.name === trimReqObj,
          );
          if (!reqIsDone) return false;
        }

        // Exclude project if required skills are not met
        const requiredSkills = project.attrs.requirements?.skills;
        if (requiredSkills) {
          const allDone = Object.entries(requiredSkills).every(
            ([skill, requiredAmount]) => {
              const availableAmount = skillMap.get(skill) || 0;
              return availableAmount >= requiredAmount;
            },
          );
          if (!allDone) return false;
        }

        // Exclude the project if there is required object that the user hasn't done
        const requiredObjects = project.attrs.requirements?.objects;
        if (requiredObjects) {
          const allDone = requiredObjects.every((requiredObject: string) => {
            const trimReqObj = requiredObject.startsWith('../')
              ? requiredObject.slice(3)
              : requiredObject;
            const reqIsDone = xps.some(
              (transaction) => transaction.object.name === trimReqObj,
            );
            return reqIsDone;
          });
          if (!allDone) return false;
        }
        return true;
      }),
    );

    // Sort the filtered projects by baseXp in ascending order
    const sortedProjects = Array.from(filteredProjects.entries()).sort(
      (a, b) => a[1].attrs.baseXp - b[1].attrs.baseXp,
    );
    setOpenProjects(new Map(sortedProjects));
  }, [moduleEvent, xps, skills, projects]);

  const rank = moduleEvent ? getRank(moduleEvent.level) : { currentRank: '', levelsToNext: 0 };

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <Layout>
        <div className="mb-8 grid grid-cols-12 items-center">
          <div className="col-span-3" />
          <div className="col-span-6 text-center">
            {user && moduleEvent && (
              <>
                <h2 className="text-3xl font-bold text-black dark:text-white mb-2">
                  Welcome, {user.firstName} {user.lastName}
                </h2>
                <p className="text-lg font-medium text-body dark:text-bodydark">
                  Campus: {moduleEvent.event.campus.charAt(0).toUpperCase() + moduleEvent.event.campus.slice(1)}
                </p>
              </>
            )}
          </div>
          <div className="col-span-3 flex justify-end">
            {user && moduleEvent && (
              <button
                onClick={() => {
                  localStorage.removeItem('hasura-jwt-token');
                  router.push('/login');
                }}
                className="flex items-center gap-3 rounded-lg bg-primary px-5 py-2.5 text-white transition-all hover:bg-opacity-90 dark:bg-boxdark"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 110.395 122.88"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                >
                  <g>
                    <path fillRule="evenodd" clipRule="evenodd" d="M93.359,17.16L75.68,9.377L75.99,0h34.404v61.439v61.44H75.99l-0.311-6.835 l17.68-10.946V17.16L93.359,17.16z M82.029,79.239v-34.54H47.004V13.631L0,61.937l47.004,48.373v-31.07H82.029L82.029,79.239z"/>
                  </g>
                </svg>
                Logout
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-8">
          <LevelCard
            level={moduleEvent?.level || 0}
            nextLevelXp={levelInfo?.nextLevelXp || 0}
            currentRank={rank.currentRank}
            levelsToNextRank={rank.levelsToNext}
          >
            <svg
              className="fill-primary dark:fill-white"
              width="800px"
              height="800px"
              viewBox="0 0 128 128"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M105.038 16.173H22.964L0 49.47l64 62.357 64-62.358-22.962-33.296zm-39.151 6.519 18.721 23.103h-39.75l19.253-23.103h1.776zm5.594 0h28.003L89.51 44.94 71.481 22.692zM86.1 52.314 64.053 98.875 43.159 52.314H86.1zm-46.316-7.216L28.711 22.692h29.744L39.784 45.098zm-4.503.698H10.454l14.464-20.971 10.363 20.971zm3.116 6.518L58.7 97.562 12.263 52.314h26.134zm52.135.791.052.064.383-.855h24.77L69.64 97.23l20.892-44.125zm3.357-7.31 9.32-20.79 14.338 20.79H93.889z" />
            </svg>
          </LevelCard>
          <CardDataStats
            title="Total XP"
            total={
              user?.xp
                ? (Math.round(user.xp / 10) / 100).toString() + 'KB'
                : ''
            }
            pending={
              openProjects
                ? (Array.from(openProjects.values()).reduce((sum, project) => sum + project.attrs.baseXp, 0) / 1000).toFixed(2) + 'KB'
                : undefined
            }
          >
            <svg
              className="fill-primary dark:fill-white"
              width="800px"
              height="800px"
              viewBox="0 0 128 128"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M103.406 57.424c3.804-3.763 5.481-10.148 3.988-15.186-1.244-4.191-4.106-6.778-6.533-8.284 1.212-2.587 2.202-6.316.96-10.506-1.43-4.82-5.97-9.15-11.042-10.533-4.026-1.097-7.899-.229-10.967 2.411.641-4.148-.489-7.92-3.325-10.791C72.726.729 66.336-.956 61.299.545c-4.191 1.244-6.776 4.106-8.284 6.532-2.585-1.214-6.314-2.2-10.505-.958v-.002c-4.822 1.431-9.154 5.974-10.535 11.044-1.146 4.204-.173 8.239 2.737 11.361.057.062.123.125.182.187-3.952-.477-7.54.664-10.298 3.386-3.806 3.763-5.485 10.148-3.99 15.188 1.244 4.191 4.106 6.776 6.532 8.284-1.214 2.585-2.203 6.314-.96 10.506h.002c1.43 4.82 5.972 9.152 11.042 10.533 1.15.314 2.288.47 3.396.47 2.394 0 4.642-.757 6.622-2.16-4.895 32.803 24.606 52.876 24.917 53.084l3.199-4.803c-.998-.669-20.893-14.269-22.787-37.26 2.795 2.283 6.596 3.582 10.237 3.582 1.341 0 2.658-.175 3.894-.543 4.195-1.244 6.78-4.106 8.286-6.532 2.589 1.21 6.317 2.196 10.503.96h.002c4.82-1.431 9.152-5.972 10.535-11.042 1.144-4.204.173-8.241-2.739-11.363-.059-.063-.125-.127-.186-.191.576.07 1.152.138 1.711.138 3.278.001 6.236-1.194 8.594-3.522zM89.261 18.483c3.143.857 6.163 3.697 7.026 6.607 1.12 3.772-.883 7.108-1.796 8.367l-2.207 3.041 3.507 1.347c1.452.558 4.952 2.262 6.069 6.036.768 2.587.026 6.932-2.512 9.439-1.884 1.86-4.384 2.326-7.424 1.384-10.739-3.325-20.139-8.634-24.24-11.126 2.904-5.412 10.334-18.732 15.665-23.703 1.653-1.54 3.639-2.012 5.912-1.392zm-51.718.193c.857-3.141 3.697-6.162 6.609-7.024v-.002a8.056 8.056 0 0 1 2.292-.331c2.782 0 5.078 1.405 6.071 2.128l3.041 2.209 1.349-3.509c.558-1.452 2.262-4.952 6.036-6.071 2.577-.774 6.932-.026 9.439 2.513 1.86 1.882 2.326 4.379 1.384 7.422-3.324 10.741-8.631 20.143-11.124 24.244-5.412-2.904-18.738-10.339-23.705-15.667-1.542-1.655-2.01-3.642-1.392-5.912zm1.197 52.362c-3.143-.855-6.163-3.695-7.029-6.607l-2.765.819 2.767-.821c-1.121-3.774.883-7.106 1.798-8.363l2.209-3.041-3.509-1.349c-1.452-.558-4.952-2.262-6.071-6.036-.768-2.587-.024-6.932 2.513-9.439 1.88-1.862 4.377-2.327 7.422-1.384 10.739 3.325 20.141 8.634 24.242 11.126-2.904 5.412-10.336 18.732-15.667 23.703-1.653 1.54-3.646 2.014-5.91 1.392zm51.717-.193c-.857 3.141-3.697 6.162-6.607 7.026l-.002-.002c-3.768 1.125-7.108-.881-8.367-1.796l-3.043-2.209-1.345 3.513c-.556 1.45-2.256 4.946-6.036 6.068-2.585.774-6.934.024-9.438-2.513-1.86-1.882-2.326-4.379-1.384-7.422 3.325-10.739 8.632-20.141 11.125-24.242C70.772 52.17 84.095 59.6 89.063 64.933c1.543 1.655 2.012 3.644 1.394 5.912z" />
            </svg>
          </CardDataStats>
          <CardDataStats
            title="Audit ratio"
            total={
              user ? (Math.round(user.auditRatio * 10) / 10).toString() : ''
            }
            rateUp={
              user
                ? (Math.round(user.totalUp / 10000) / 100).toString() + 'MB'
                : ''
            }
            rateDown={
              user
                ? (Math.round(user.totalDown / 10000) / 100).toString() + 'MB'
                : ''
            }
            type="audit"
          >
            <svg
              className="fill-primary dark:fill-white"
              width="800px"
              height="800px"
              viewBox="0 0 128 128"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M113.854 61.24h-1.98l-10.014-20.5a4.4 4.4 0 0 0-.746-8.74H70.875v-1.208a6.848 6.848 0 0 0-2.195-5.022 7.51 7.51 0 1 0-9.36 0 6.848 6.848 0 0 0-2.2 5.022V32H26.886a4.4 4.4 0 0 0-.746 8.745L16.126 61.24h-1.98a1.75 1.75 0 0 0-1.75 1.75 16.511 16.511 0 0 0 33.021 0 1.749 1.749 0 0 0-1.75-1.75h-1.981l-9.977-20.42h25.416v48.1h-5.458a9.76 9.76 0 0 0-9.584 8h-4.25a1.749 1.749 0 0 0-1.75 1.75v15.187a1.75 1.75 0 0 0 1.75 1.75h52.334a1.75 1.75 0 0 0 1.75-1.75v-15.19a1.749 1.749 0 0 0-1.75-1.75h-4.25a9.76 9.76 0 0 0-9.584-8h-5.458V40.82h25.416l-9.977 20.42h-1.981a1.749 1.749 0 0 0-1.75 1.75 16.511 16.511 0 0 0 33.021 0 1.75 1.75 0 0 0-1.75-1.75zM59.99 19.907a4.01 4.01 0 1 1 4.01 4.01 4.015 4.015 0 0 1-4.01-4.01zM28.906 76a13.029 13.029 0 0 1-12.892-11.26H41.8A13.031 13.031 0 0 1 28.906 76zm-8.885-14.76 8.885-18.183 8.885 18.183zm6.865-23.92a.91.91 0 0 1 0-1.82h30.239v1.82zm61.531 74.78H39.583v-11.683h48.834zm-6.088-15.183H45.671a6.257 6.257 0 0 1 6-4.5h24.662a6.257 6.257 0 0 1 5.996 4.5zm-21.7-8V30.792a3.375 3.375 0 0 1 6.75 0v58.125zM70.875 35.5h30.239a.91.91 0 0 1 0 1.82H70.875zm28.219 7.557 8.885 18.183h-17.77zm0 32.943A13.031 13.031 0 0 1 86.2 64.74h25.786A13.029 13.029 0 0 1 99.094 76z" />
            </svg>
          </CardDataStats>
        </div>

        <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-8">
          <div className="col-span-12 xl:col-span-8">
            <div className="chart-card">
              <LineChart xps={xps} />
            </div>
          </div>
          <div className="col-span-12 xl:col-span-4">
            <div className="chart-card">
              <RadarChart 
                skills={skills?.slice(0, 5)}
              />
            </div>
          </div>
          <div className="col-span-12 xl:col-span-6">
            <div className="card h-full">
              <Table transactions={xps ? xps : []} />
            </div>
          </div>
          <div className="col-span-12 xl:col-span-6">
            <div className="card h-full">
              <PendingProjects projects={openProjects || new Map()} />
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Dashboard;
