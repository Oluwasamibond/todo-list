import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTasks } from "../context/TaskContext";
import { useTheme } from "../context/ThemeContext";

export default function AddTaskScreen() {
  const { addTask } = useTasks();
  const { theme } = useTheme();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  const onSave = async () => {
    if (!title.trim()) {
      Alert.alert("Validation", "Task title cannot be empty.");
      return;
    }

    await addTask(
      title.trim(),
      description.trim(),
      dueDate ? dueDate.toISOString() : undefined
    );

    // reset state after saving
    setTitle("");
    setDescription("");
    setDueDate(null);

    router.back();
  };

  const onChangeDate = (_: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
    }
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  const isLight = theme === "light";

  const formatDate = (date: Date) =>
    date.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: isLight ? "#f6f7fb" : "#000" }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          {/* Title */}
          <Text style={[styles.label, { color: isLight ? "#111" : "#fff" }]}>
            Title *
          </Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Buy groceries"
            placeholderTextColor={isLight ? "#666" : "#aaa"}
            style={[
              styles.input,
              {
                backgroundColor: isLight ? "#fff" : "#111",
                borderColor: isLight ? "#eee" : "#333",
                color: isLight ? "#000" : "#fff",
              },
            ]}
            returnKeyType="done"
          />

          {/* Description */}
          <Text
            style={[
              styles.label,
              { marginTop: 16, color: isLight ? "#111" : "#fff" },
            ]}
          >
            Description (optional)
          </Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Eggs, milk, bread..."
            placeholderTextColor={isLight ? "#666" : "#aaa"}
            style={[
              styles.input,
              {
                height: 100,
                backgroundColor: isLight ? "#fff" : "#111",
                borderColor: isLight ? "#eee" : "#333",
                color: isLight ? "#000" : "#fff",
              },
            ]}
            multiline
          />

          {/* Due Date */}
          <Text
            style={[
              styles.label,
              { marginTop: 16, color: isLight ? "#111" : "#fff" },
            ]}
          >
            Due Date (optional)
          </Text>
          <TouchableOpacity
            style={[
              styles.input,
              {
                justifyContent: "center",
                backgroundColor: isLight ? "#fff" : "#111",
                borderColor: isLight ? "#eee" : "#333",
              },
            ]}
            onPress={() => setShowPicker(true)}
          >
            <Text
              style={{ color: dueDate ? (isLight ? "#000" : "#fff") : "#999" }}
            >
              {dueDate ? formatDate(dueDate) : "Select a due date (optional)"}
            </Text>
          </TouchableOpacity>

          {showPicker && (
            <DateTimePicker
              value={dueDate || new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "inline" : "default"}
              onChange={onChangeDate}
            />
          )}

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[
                styles.btn,
                {
                  backgroundColor: isLight ? "#fff" : "#222",
                  borderWidth: 1,
                  borderColor: isLight ? "#ddd" : "#444",
                },
              ]}
              onPress={() => router.back()}
            >
              <Text
                style={{
                  color: isLight ? "#333" : "#fff",
                  fontWeight: "600",
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.btn,
                !title.trim()
                  ? styles.disabled
                  : { backgroundColor: "#2563eb" },
              ]}
              onPress={onSave}
              disabled={!title.trim()}
            >
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: 16 },
  label: { fontWeight: "600", marginBottom: 8 },
  input: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
    gap: 10,
  },
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 96,
    alignItems: "center",
  },
  saveText: { color: "#fff", fontWeight: "700" },
  disabled: { backgroundColor: "#9fb3ff", opacity: 0.9 },
});
