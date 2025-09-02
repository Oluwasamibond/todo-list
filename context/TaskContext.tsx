import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

export type Task = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  dueDate?: string;
};

type TasksContextType = {
  tasks: Task[];
  loading: boolean;
  addTask: (
    title: string,
    description?: string,
    dueDate?: string
  ) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
  sortTasks: (criteria: "date" | "alpha" | "created") => void;
  updateTask: (
    id: string,
    title: string,
    description?: string,
    dueDate?: string
  ) => Promise<void>; // 🔹 new
};

const TasksContext = createContext<TasksContextType | undefined>(undefined);

const STORAGE_KEY = "TASKS_V1";

export const TasksProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          setTasks(JSON.parse(raw));
        }
      } catch (e) {
        console.warn("Failed to load tasks", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      } catch (e) {
        console.warn("Failed to save tasks", e);
      }
    })();
  }, [tasks]);

  const addTask = async (
    title: string,
    description?: string,
    dueDate?: string
  ) => {
    const newTask: Task = {
      id: String(Date.now()),
      title: title.trim(),
      description: description?.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      dueDate,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const toggleTask = async (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = async (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const clearAll = async () => {
    setTasks([]);
  };

  const sortTasks = (criteria: "date" | "alpha" | "created") => {
    setTasks((prev) => {
      let sorted = [...prev];
      if (criteria === "date") {
        sorted.sort((a, b) => {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });
      } else if (criteria === "alpha") {
        sorted.sort((a, b) => a.title.localeCompare(b.title));
      } else if (criteria === "created") {
        sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      return sorted;
    });
  };

  // 🔹 New: updateTask
  const updateTask = async (
    id: string,
    title: string,
    description?: string,
    dueDate?: string
  ) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              title: title.trim(),
              description: description?.trim(),
              dueDate,
            }
          : t
      )
    );
  };

  return (
    <TasksContext.Provider
      value={{
        tasks,
        loading,
        addTask,
        toggleTask,
        deleteTask,
        clearAll,
        sortTasks,
        updateTask,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error("useTasks must be used within TasksProvider");
  return ctx;
};
