import { create } from 'zustand';
import type { Project, Task, TaskStatus } from '../types';

interface StoreState {
  projects: Project[];
  currentProjectId: string | null;
  addProject: (name: string) => void;
  renameProject: (id: string, newName: string) => void;
  deleteProject: (id: string) => void;
  selectProject: (id: string) => void;
  addTask: (projectId: string, task: Task) => void;
  updateTask: (projectId: string, task: Task) => void;
  deleteTask: (projectId: string, taskId: string) => void;
  moveTask: (projectId: string, taskId: string, status: TaskStatus) => void;
}

export const useStore = create<StoreState>((set) => ({
  projects: (() => {
    try {
      const storedProjects = localStorage.getItem('kanban-projects');
      return storedProjects ? JSON.parse(storedProjects) : [];
    } catch (error) {
      return []; // Return an empty array if JSON parsing fails
    }
  })(),
  currentProjectId: null,

  addProject: (name) => set((state) => {
    const newProject: Project = {
      id: crypto.randomUUID(),
      name,
      tasks: [],
    };
    const updated = [...state.projects, newProject];
    localStorage.setItem('kanban-projects', JSON.stringify(updated));
    return { projects: updated };
  }),

  renameProject: (id, newName) => set((state) => {
    const updated = state.projects.map(p => p.id === id ? { ...p, name: newName } : p);
    localStorage.setItem('kanban-projects', JSON.stringify(updated));
    return { projects: updated };
  }),

  deleteProject: (id) => set((state) => {
    const updated = state.projects.filter(p => p.id !== id);
    localStorage.setItem('kanban-projects', JSON.stringify(updated));
    return { projects: updated };
  }),

 selectProject: (id) => set({ currentProjectId: id }),

  addTask: (projectId, task) => set((state) => {
    const updated = state.projects.map(project =>
      project.id === projectId ? { ...project, tasks: [...project.tasks, task] } : project
    );
    localStorage.setItem('kanban-projects', JSON.stringify(updated));
    return { projects: updated };
  }),

  updateTask: (projectId, updatedTask) => set((state) => {
    const updated = state.projects.map(project =>
      project.id === projectId
        ? {
            ...project,
            tasks: project.tasks.map(task =>
              task.id === updatedTask.id ? updatedTask : task
            ),
          }
        : project
    );
    localStorage.setItem('kanban-projects', JSON.stringify(updated));
    return { projects: updated };
  }),

  deleteTask: (projectId, taskId) => set((state) => {
    const updated = state.projects.map(project =>
      project.id === projectId
        ? { ...project, tasks: project.tasks.filter(t => t.id !== taskId) }
        : project
    );
    localStorage.setItem('kanban-projects', JSON.stringify(updated));
    return { projects: updated };
  }),

  moveTask: (projectId, taskId, newStatus) => set((state) => {
    // Ensure the newStatus is a valid status
    if (!['todo', 'in-progress', 'done'].includes(newStatus)) {
      console.warn(`Invalid status: ${newStatus}`);
      return state; // No changes if the status is invalid
    }

    const updated = state.projects.map(project => {
      if (project.id === projectId) {
        const updatedTasks = project.tasks.map(task =>
          task.id === taskId ? { ...task, status: newStatus } : task
        );
        return { ...project, tasks: updatedTasks };
      }
      return project;
    });

    localStorage.setItem('kanban-projects', JSON.stringify(updated));
    return { projects: updated };
  }),
}));

