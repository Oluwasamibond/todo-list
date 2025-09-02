# Task Manager App

A simple **React Native (Expo)** task management app that allows users to add, edit, delete, and manage their tasks with **due dates**, **sorting**, and **light/dark theme support**. Tasks and theme preferences are stored locally using **AsyncStorage**, ensuring data persists even after closing the app.

---

## ✨ Features

- 📌 Add new tasks with **title**, **description**, and **due date**
- 🗑️ Delete tasks
- ✅ Mark tasks as completed or pending
- 📅 Sort tasks by **due date**
- 🌙 Toggle between **Light & Dark mode** (theme persists with AsyncStorage)
- 💾 **AsyncStorage persistence** – tasks and theme are saved locally

---

## 🛠️ Tech Stack

- **React Native** (Expo)
- **AsyncStorage** (for local persistence)
- **Expo Router** (for navigation)
- **TypeScript**

---

## 📂 Project Structure

my-todo-app/
├─ app/
│ ├─ \_layout.tsx # Home screen (list of tasks, sorting, theme toggle)
│ ├─ add.tsx # Screen to add a new task
│ ├─ index.tsx # Root layout with navigation
├─ components/
│ └─ TaskItem.tsx # Reusable component for displaying a task
├─ context/
│ └─ TasksContext.tsx Custom hook for managing tasks with AsyncStorage
| └─ ThemeContext.tsx # Custom hook for theme handling with AsyncStorage
├─ package.json
├─ tsconfig.json
└─ README.md

## 🚀 Getting Started

### 1. Clone the repo

git clone https://github.com/Oluwasamibond/todo-list.git
cd todo-list

2. Install dependencies
   npm install
   or
   yarn install

3. Run the app
   npx expo start
