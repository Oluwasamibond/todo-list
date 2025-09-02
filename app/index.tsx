import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { TaskItem } from "../components/TaskItem";
import { useTasks } from "../context/TaskContext";
import { useTheme } from "../context/ThemeContext";

export default function TaskListScreen() {
  const router = useRouter();
  const { tasks, loading, toggleTask, deleteTask, clearAll } = useTasks();
  const { theme } = useTheme();

  const [search, setSearch] = useState("");

  //  memoized, sorted & filtered tasks
  const filteredTasks = useMemo(() => {
    const sorted = [...tasks].sort((a, b) => {
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
      return 0;
    });

    return sorted.filter((task) =>
      task.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [tasks, search]);

  const incompleteCount = tasks.filter((t) => !t.completed).length;

  return (
    <SafeAreaView
      style={[
        styles.safe,
        { backgroundColor: theme === "light" ? "#f6f7fb" : "#000" },
      ]}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: theme === "light" ? "#fff" : "#111" },
        ]}
      >
        <Text
          style={[
            styles.headerTitle,
            { color: theme === "light" ? "#111" : "#fff" },
          ]}
        >
          To-Do
        </Text>
        <Text
          style={[
            styles.headerSub,
            { color: theme === "light" ? "#666" : "#bbb" },
          ]}
        >
          {incompleteCount} incomplete
        </Text>

        {/* Search Input */}
        <TextInput
          style={[
            styles.search,
            {
              backgroundColor: theme === "light" ? "#f1f1f1" : "#222",
              color: theme === "light" ? "#000" : "#fff",
            },
          ]}
          placeholder="Search tasks..."
          placeholderTextColor={theme === "light" ? "#666" : "#aaa"}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Task List */}
      {loading ? (
        <View style={styles.center}>
          <Text style={{ color: theme === "light" ? "#111" : "#fff" }}>
            Loading...
          </Text>
        </View>
      ) : filteredTasks.length === 0 ? (
        <View style={styles.center}>
          <Text
            style={[
              styles.emptyTitle,
              { color: theme === "light" ? "#111" : "#fff" },
            ]}
          >
            No tasks found
          </Text>
          <Text
            style={[
              styles.emptySub,
              { color: theme === "light" ? "#666" : "#bbb" },
            ]}
          >
            Try adding or searching again.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          renderItem={({ item }) => (
            <TaskItem task={item} onToggle={toggleTask} onDelete={deleteTask} />
          )}
        />
      )}

      {/* Add Button */}
      <TouchableOpacity
        style={[
          styles.fab,
          { backgroundColor: theme === "light" ? "#2563eb" : "#1e40af" },
        ]}
        onPress={() => router.push("/add")}
      >
        <MaterialIcons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Clear All */}
      {tasks.length > 0 && (
        <TouchableOpacity
          style={[styles.clear, { backgroundColor: "#ef4444" }]}
          onPress={clearAll}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>Clear All</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { padding: 16, paddingTop: 24 },
  headerTitle: { fontSize: 28, fontWeight: "700" },
  headerSub: { marginTop: 4 },
  search: {
    marginTop: 12,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyTitle: { fontSize: 18, fontWeight: "600" },
  emptySub: { marginTop: 8 },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  clear: {
    position: "absolute",
    left: 20,
    bottom: 30,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    elevation: 2,
  },
});
