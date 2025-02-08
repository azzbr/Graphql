type User = {
  id: number;
  login: string;
  firstName: string;
  lastName: string;
  auditRatio: number;
  totalUp: number;
  totalDown: number;
  xp: number;
  campus: string;
  email: string;
  attrs: string; // this is the gender
};
// Type for registration details
type Registration = {
  id: number;
};

// Type for event details
type UserModuleEvent = {
  campus: string;
  createdAt: string;
  endAt: string;
  eventId: number;
  level: number;
  path: string;
  registrations: Registration[];
};

type Transaction = {
  amount: number;
  createdAt: string;
  object: {
    name: string;
  };
  accumulated?: number; // use it after sorting
};

type Skill = {
  type: string;
  amount: number;
  color?: string;
};

type Project = {
  attrs: any;
  key: string; // no use for this key
  baseXp: number;
  baseSkills: { [skill: string]: number };
  requirements: {
    skills?: { [skill: string]: number };
    objects?: string[];
    core?: string;
  };
  paths: ProjectPath[];
};

type ProjectPath = {
  object: {
    name: string;
  };
};

