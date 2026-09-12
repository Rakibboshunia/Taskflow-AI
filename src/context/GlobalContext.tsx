'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// --- Types ---
export type TaskStatus = 'Todo' | 'In Progress' | 'Review' | 'Completed';
export type TaskPriority = 'High' | 'Medium' | 'Low';

export interface Task {
  id: number;
  title: string;
  project: string;
  assignee: string;
  priority: TaskPriority;
  status: TaskStatus;
  due: string;
  tags: string[];
}

export type ProjectStatus = 'In Progress' | 'Review' | 'Planning' | 'Completed';
export type ProjectPriority = 'High' | 'Medium' | 'Low';

export interface Project {
  id: number;
  name: string;
  category: string;
  progress: number;
  status: ProjectStatus;
  members: string[];
  tasks: { done: number; total: number };
  due: string;
  color: string;
  priority: ProjectPriority;
}

export interface Member {
  id: number;
  name: string;
  role: string;
  initials: string;
  email: string;
  phone: string;
  projects: number;
  tasks: number;
  status: 'online' | 'away' | 'offline';
  rating: number;
  color: string;
  dept: string;
}

export type CalEvent = { title: string; time: string; color: string; project: string };

// --- Initial Data ---
const initialTasks: Task[] = [
  { id: 1, title: 'Design new onboarding flow', project: 'AI SaaS Dashboard', assignee: 'AR', priority: 'High', status: 'In Progress', due: 'Jun 20', tags: ['Design', 'UX'] },
  { id: 2, title: 'Implement user authentication', project: 'Mobile Banking App', assignee: 'TH', priority: 'High', status: 'Completed', due: 'Jun 18', tags: ['Backend', 'Security'] },
  { id: 3, title: 'Write API documentation', project: 'E-commerce Platform', assignee: 'SI', priority: 'Medium', status: 'Todo', due: 'Jun 25', tags: ['Docs'] },
  { id: 4, title: 'Fix payment gateway bug', project: 'E-commerce Platform', assignee: 'TH', priority: 'High', status: 'In Progress', due: 'Jun 21', tags: ['Bug', 'Critical'] },
  { id: 5, title: 'Create landing page mockups', project: 'Marketing Website', assignee: 'AR', priority: 'Low', status: 'Todo', due: 'Jul 1', tags: ['Design'] },
  { id: 6, title: 'Database schema optimization', project: 'Analytics Platform', assignee: 'TH', priority: 'Medium', status: 'Review', due: 'Jun 28', tags: ['Backend', 'DB'] },
  { id: 7, title: 'Setup CI/CD pipeline', project: 'AI SaaS Dashboard', assignee: 'SI', priority: 'Medium', status: 'Todo', due: 'Jun 30', tags: ['DevOps'] },
  { id: 8, title: 'Conduct user testing sessions', project: 'Mobile Banking App', assignee: 'JF', priority: 'High', status: 'Completed', due: 'Jun 15', tags: ['Testing', 'UX'] },
];

const initialProjects: Project[] = [
  { id: 1, name: 'AI SaaS Dashboard', category: 'Web App', progress: 75, status: 'In Progress', members: ['AR', 'SI', 'TH'], tasks: { done: 24, total: 32 }, due: 'Jun 30', color: '#7c3aed', priority: 'High' },
  { id: 2, name: 'E-commerce Platform', category: 'E-Commerce', progress: 60, status: 'In Progress', members: ['SI', 'JF'], tasks: { done: 18, total: 30 }, due: 'Jul 15', color: '#a855f7', priority: 'High' },
  { id: 3, name: 'Mobile Banking App', category: 'Mobile', progress: 90, status: 'Review', members: ['TH', 'AR', 'SI', 'JF'], tasks: { done: 45, total: 50 }, due: 'May 25', color: '#3b82f6', priority: 'Medium' },
  { id: 4, name: 'Marketing Website', category: 'Web', progress: 40, status: 'Planning', members: ['AR'], tasks: { done: 8, total: 20 }, due: 'Aug 1', color: '#10b981', priority: 'Low' },
  { id: 5, name: 'Analytics Platform', category: 'Data', progress: 55, status: 'In Progress', members: ['SI', 'TH'], tasks: { done: 22, total: 40 }, due: 'Jul 20', color: '#f59e0b', priority: 'Medium' },
  { id: 6, name: 'HR Management System', category: 'Enterprise', progress: 25, status: 'Planning', members: ['JF', 'AR'], tasks: { done: 5, total: 20 }, due: 'Sep 1', color: '#ef4444', priority: 'Low' },
];

const initialMembers: Member[] = [
  { id: 1, name: 'Rasel Ahmed', role: 'UI/UX Designer', initials: 'RA', email: 'rasel@taskflow.ai', phone: '+880-1234-567890', projects: 5, tasks: 14, status: 'online', rating: 4.8, color: '#7c3aed', dept: 'Design' },
  { id: 2, name: 'Sadia Islam', role: 'Frontend Developer', initials: 'SI', email: 'sadia@taskflow.ai', phone: '+880-9876-543210', projects: 4, tasks: 18, status: 'online', rating: 4.9, color: '#a855f7', dept: 'Engineering' },
  { id: 3, name: 'Tanvir Hasan', role: 'Backend Developer', initials: 'TH', email: 'tanvir@taskflow.ai', phone: '+880-1122-334455', projects: 6, tasks: 22, status: 'away', rating: 4.7, color: '#3b82f6', dept: 'Engineering' },
  { id: 4, name: 'Jannatul Ferdaus', role: 'QA Engineer', initials: 'JF', email: 'jannatul@taskflow.ai', phone: '+880-5566-778899', projects: 3, tasks: 10, status: 'online', rating: 4.6, color: '#10b981', dept: 'QA' },
  { id: 5, name: 'Rahim Uddin', role: 'DevOps Engineer', initials: 'RU', email: 'rahim@taskflow.ai', phone: '+880-6677-889900', projects: 4, tasks: 12, status: 'offline', rating: 4.5, color: '#f59e0b', dept: 'Engineering' },
  { id: 6, name: 'Nazma Khatun', role: 'Product Manager', initials: 'NK', email: 'nazma@taskflow.ai', phone: '+880-4433-221100', projects: 8, tasks: 30, status: 'online', rating: 5.0, color: '#ef4444', dept: 'Management' },
];

const initialEvents: Record<string, CalEvent[]> = {
  '2026-07-03': [
    { title: 'Design Review', time: '10:00 AM', color: '#7c3aed', project: 'AI Dashboard' },
    { title: 'Team Standup', time: '9:00 AM', color: '#10b981', project: 'All Projects' },
  ],
  '2026-07-07': [{ title: 'Sprint Planning', time: '2:00 PM', color: '#f59e0b', project: 'E-commerce' }],
  '2026-07-10': [
    { title: 'Client Demo', time: '4:00 PM', color: '#3b82f6', project: 'Mobile App' },
    { title: 'Code Review', time: '11:00 AM', color: '#a855f7', project: 'Banking App' },
  ],
  '2026-07-15': [{ title: 'Product Launch', time: '12:00 PM', color: '#ef4444', project: 'SaaS Platform' }],
  '2026-07-20': [{ title: 'Retrospective', time: '3:00 PM', color: '#10b981', project: 'All Teams' }],
};

// --- Context State ---
interface GlobalState {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  members: Member[];
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
  events: Record<string, CalEvent[]>;
  setEvents: React.Dispatch<React.SetStateAction<Record<string, CalEvent[]>>>;
}

const GlobalContext = createContext<GlobalState | undefined>(undefined);

export function GlobalProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [events, setEvents] = useState<Record<string, CalEvent[]>>(initialEvents);
  
  const [isMounted, setIsMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setIsMounted(true);
    const storedTasks = localStorage.getItem('taskflow_tasks');
    const storedProjects = localStorage.getItem('taskflow_projects');
    const storedMembers = localStorage.getItem('taskflow_members');
    const storedEvents = localStorage.getItem('taskflow_events');

    if (storedTasks) setTasks(JSON.parse(storedTasks));
    if (storedProjects) setProjects(JSON.parse(storedProjects));
    if (storedMembers) setMembers(JSON.parse(storedMembers));
    if (storedEvents) setEvents(JSON.parse(storedEvents));
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
      localStorage.setItem('taskflow_projects', JSON.stringify(projects));
      localStorage.setItem('taskflow_members', JSON.stringify(members));
      localStorage.setItem('taskflow_events', JSON.stringify(events));
    }
  }, [tasks, projects, members, events, isMounted]);

  return (
    <GlobalContext.Provider value={{ tasks, setTasks, projects, setProjects, members, setMembers, events, setEvents }}>
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobalContext() {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error('useGlobalContext must be used within a GlobalProvider');
  }
  return context;
}
