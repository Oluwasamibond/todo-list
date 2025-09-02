import { MaterialIcons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";
import { TasksProvider } from "../context/TaskContext";
import { ThemeProvider, useTheme } from "../context/ThemeContext";

function RootStack() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme === "light" ? "#fff" : "#111",
        },
        headerTintColor: theme === "light" ? "#111" : "#fff",
        headerShadowVisible: false,
        headerRight: () => (
          <TouchableOpacity onPress={toggleTheme} style={{ marginRight: 12 }}>
            <MaterialIcons
              name={theme === "light" ? "dark-mode" : "light-mode"}
              size={24}
              color={theme === "light" ? "#111" : "#fff"}
            />
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen name="index" options={{ title: "My Tasks" }} />
      <Stack.Screen name="add" options={{ title: "Add Task" }} />
    </Stack>
  );
}

export default function Layout() {
  return (
    <ThemeProvider>
      <TasksProvider>
        <RootStack />
      </TasksProvider>
    </ThemeProvider>
  );
}
