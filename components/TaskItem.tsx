import { MaterialIcons } from "@expo/vector-icons";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Task } from "../context/TaskContext";
import { useTheme } from "../context/ThemeContext";

type Props = {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

export const TaskItem: React.FC<Props> = ({ task, onToggle, onDelete }) => {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const isOverdue =
    task.dueDate &&
    !task.completed &&
    new Date(task.dueDate).getTime() < new Date().setHours(0, 0, 0, 0);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isLight ? "#fff" : "#111",
          shadowColor: isLight ? "#000" : "#000",
        },
      ]}
    >
      {/* Toggle Checkbox */}
      <TouchableOpacity onPress={() => onToggle(task.id)} style={styles.left}>
        <View
          style={[
            styles.checkbox,
            {
              borderColor: isLight ? "#ccc" : "#555",
              backgroundColor: isLight ? "#fff" : "#111",
            },
            task.completed && styles.checked,
          ]}
        >
          {task.completed && (
            <MaterialIcons name="check" size={18} color="#fff" />
          )}
        </View>
      </TouchableOpacity>

      {/* Task Info */}
      <View style={styles.info}>
        <Text
          style={[
            styles.title,
            { color: isLight ? "#111" : "#fff" },
            task.completed && styles.completedTitle,
          ]}
          numberOfLines={1}
        >
          {task.title}
        </Text>

        {task.description ? (
          <Text
            style={[
              styles.desc,
              { color: isLight ? "#666" : "#aaa" },
              task.completed && styles.completedDesc,
            ]}
            numberOfLines={2}
          >
            {task.description}
          </Text>
        ) : null}

        {/* Due Date */}
        {task.dueDate && (
          <Text
            style={[
              styles.dueDate,
              { color: isLight ? "#2563eb" : "#60a5fa" },
              task.completed && styles.completedDueDate,
              isOverdue && styles.overdue,
            ]}
          >
            Due: {new Date(task.dueDate).toDateString()}
          </Text>
        )}
      </View>

      {/* Delete Button */}
      <TouchableOpacity
        onPress={() =>
          Alert.alert("Delete task", `Delete "${task.title}"?`, [
            { text: "Cancel", style: "cancel" },
            {
              text: "Delete",
              style: "destructive",
              onPress: () => onDelete(task.id),
            },
          ])
        }
        style={styles.delete}
      >
        <MaterialIcons name="delete-outline" size={22} color="#c00" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 12,
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 10,
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  left: {
    paddingRight: 8,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 1.2,
    alignItems: "center",
    justifyContent: "center",
  },
  checked: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  desc: {
    fontSize: 13,
    marginTop: 4,
  },
  dueDate: {
    marginTop: 4,
    fontSize: 12,
  },
  overdue: {
    color: "#c00",
    fontWeight: "600",
  },
  completedTitle: {
    textDecorationLine: "line-through",
    color: "#999",
  },
  completedDesc: {
    color: "#999",
    textDecorationLine: "line-through",
  },
  completedDueDate: {
    color: "#999",
    textDecorationLine: "line-through",
  },
  delete: {
    paddingLeft: 10,
  },
});
