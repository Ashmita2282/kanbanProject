import React, { useState } from "react";
import { useStore } from "../store/useStore";
import type { TaskStatus, Task } from "../types/index";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";

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

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    const fromStatus = source.droppableId as TaskStatus;
    const toStatus = destination.droppableId as TaskStatus;

    if (fromStatus === toStatus) return;

    moveTask(currentProject!.id, draggableId, toStatus);
  };

  if (!currentProject) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-xs text-center p-6">
          {/* Optional SVG icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M16 3l-4 4-4-4"
            />
          </svg>

          <h2 className="mt-4 text-2xl font-semibold text-gray-700 dark:text-gray-200">
            No Project Selected
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Select a project from the sidebar to view its tasks.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-8 w-full bg-gradient-to-r from-blue-100 via-blue-50 to-white">
          {statuses.map((status) => (
            <Droppable key={status} droppableId={status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-white rounded-lg shadow-lg p-6 flex flex-col min-h-[200px]"
                >
                  <h3 className="text-2xl font-semibold capitalize mb-5 text-blue-600">
                    {status.replace("-", " ")}
                  </h3>
                  <div className="space-y-4">
                    {currentProject.tasks
                      .filter((task) => task.status === status)
                      .map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-gradient-to-r from-indigo-50 via-indigo-100 to-indigo-200 p-4 rounded-lg shadow-md transition-transform hover:scale-105"
                            >
                              <h4 className="font-medium text-xl">
                                {task.title}
                              </h4>
                              <p className="text-sm text-gray-700">
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
                              <div className="mt-3 flex gap-2 text-xs text-gray-600">
                                <button
                                  onClick={() => openEditModal(task)}
                                  className="text-blue-600 hover:underline"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() =>
                                    deleteTask(currentProject.id, task.id)
                                  }
                                  className="text-red-500 hover:underline"
                                >
                                  Delete
                                </button>
                              </div>

                              <div className="mt-3 flex gap-2 text-xs text-blue-600">
                                {task.status !== "in-progress" && (
                                  <button
                                    onClick={() =>
                                      moveTask(
                                        currentProject.id,
                                        task.id,
                                        "in-progress"
                                      )
                                    }
                                    className="text-blue-600 hover:underline"
                                  >
                                    Move to In-progress
                                  </button>
                                )}
                                {task.status !== "done" && (
                                  <button
                                    onClick={() =>
                                      moveTask(
                                        currentProject.id,
                                        task.id,
                                        "done"
                                      )
                                    }
                                    className="text-green-600 hover:underline"
                                  >
                                    Move to Done
                                  </button>
                                )}
                                {task.status !== "todo" && (
                                  <button
                                    onClick={() =>
                                      moveTask(
                                        currentProject.id,
                                        task.id,
                                        "todo"
                                      )
                                    }
                                    className="text-orange-600 hover:underline"
                                  >
                                    Move to To-do
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                  <button
                    onClick={() => openAddModal(status)}
                    className="mt-4 w-full text-sm bg-blue-600 text-white rounded-lg py-3 font-semibold hover:bg-blue-700 shadow-lg transition-all duration-200"
                  >
                    + Add Task
                  </button>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-full max-w-lg shadow-xl transition-transform transform scale-105">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              {modalMode === "add" ? "Add New Task" : "Edit Task"}
            </h2>
            <label className="block mb-2 text-sm font-medium">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full border border-gray-300 p-3 rounded-lg mb-4 text-lg"
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
              className="w-full border border-gray-300 p-3 rounded-lg mb-4 text-lg"
              placeholder="Task description (optional)"
            />

            <label className="block mb-2 text-sm font-medium">Deadline</label>
            <input
              type="date"
              value={formData.deadline || ""}
              onChange={(e) =>
                setFormData({ ...formData, deadline: e.target.value })
              }
              className="w-full border border-gray-300 p-3 rounded-lg mb-4 text-lg"
            />

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 bg-gray-300 rounded-lg text-lg font-semibold hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
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
