import React, { useState } from "react";
import { useStore } from "../store/useStore";
import type { TaskStatus, Task } from "../types/index";

const statuses: TaskStatus[] = ["todo", "in-progress", "done"];

const Board: React.FC = () => {
  const currentProject = useStore((state) => {
    const projectId = state.currentProjectId;
    return state.projects.find((p) => p.id === projectId);
  });

  const addTask = useStore((state) => state.addTask);
  const deleteTask = useStore((state) => state.deleteTask);
  const moveTask = useStore((state) => state.moveTask);
  const editTask = useStore((state) => state.updateTask);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus>("todo");
  const [formData, setFormData] = useState<Partial<Task>>({
    title: "",
    description: "",
    deadline: "",
  });

  const openAddModal = (status: TaskStatus) => {
    setFormData({ title: "", description: "", deadline: "" });
    setSelectedStatus(status);
    setModalMode("add");
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setFormData(task);
    setSelectedStatus(task.status);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.title?.trim()) {
      alert("Title is required.");
      return;
    }

    const newTask: Task = {
      ...(formData as Task),
      id: formData.id || Date.now().toString(),
      status: selectedStatus,
      createdAt: formData.createdAt || new Date().toISOString(),
    };

    if (modalMode === "add") {
      addTask(currentProject!.id, newTask);
    } else {
      editTask(currentProject!.id, newTask);
    }

    setIsModalOpen(false);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isOverdue = (deadline: string | undefined) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  if (!currentProject) {
    return (
      <div className="p-6 text-center text-gray-500">
        No project selected. Please choose a project from the sidebar.
      </div>
    );
  }

  return (
    <>
      <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 w-full bg-gray-50">
        {statuses.map((status) => (
          <div
            key={status}
            className="bg-white rounded-lg p-4 flex flex-col min-h-[200px]"
          >
            <div>
              <h3 className="text-lg font-semibold capitalize mb-3 text-blue-600">
                {status.replace("-", " ")}
              </h3>
              <div className="space-y-2">
                {currentProject.tasks
                  .filter((task) => task.status === status)
                  .map((task) => (
                    <div
                      key={task.id}
                      className="p-3 rounded border shadow-sm bg-blue-50"
                    >
                      <h4 className="font-medium">{task.title}</h4>
                      <p className="text-sm text-gray-600">
                        {task.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        Created: {formatDate(task.createdAt)}
                      </p>
                      {task.deadline && (
                        <p
                          className={`text-xs ${
                            isOverdue(task.deadline)
                              ? "text-red-500 font-semibold"
                              : "text-gray-500"
                          }`}
                        >
                          Due: {formatDate(task.deadline)}{" "}
                          {isOverdue(task.deadline) ? "(Overdue)" : ""}
                        </p>
                      )}
                      <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500">
                        {statuses.map((s) =>
                          s !== task.status ? (
                            <button
                              key={s}
                              onClick={() =>
                                moveTask(currentProject.id, task.id, s)
                              }
                              className="hover:underline"
                            >
                              Move to {s}
                            </button>
                          ) : null
                        )}
                        <button
                          onClick={() => openEditModal(task)}
                          className="text-yellow-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteTask(currentProject.id, task.id)}
                          className="text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            <button
              onClick={() => openAddModal(status)}
              className="mt-4 w-full text-sm bg-blue-600 text-white rounded py-2 font-semibold hover:bg-blue-700 shadow-md"
            >
              + Add Task
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0  backdrop-blur-sm bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">
              {modalMode === "add" ? "Add New Task" : "Edit Task"}
            </h2>
            <label className="block mb-2 text-sm font-medium">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full border border-gray-300 p-2 rounded mb-4"
              placeholder="Task title"
              required
            />

            <label className="block mb-2 text-sm font-medium">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full border border-gray-300 p-2 rounded mb-4"
              placeholder="Task description (optional)"
            />

            <label className="block mb-2 text-sm font-medium">Deadline</label>
            <input
              type="date"
              value={formData.deadline || ""}
              onChange={(e) =>
                setFormData({ ...formData, deadline: e.target.value })
              }
              className="w-full border border-gray-300 p-2 rounded mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {modalMode === "add" ? "Add Task" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Board;
