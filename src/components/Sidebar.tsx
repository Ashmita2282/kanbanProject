import React, { useState } from "react";
import { useStore } from "../store/useStore";
import { cn } from "../utils/helpers";
import logo from "../assets/logo.png";

const Sidebar: React.FC = () => {
  const projects = useStore((state) => state.projects);
  const currentProjectId = useStore((state) => state.currentProjectId);
  const addProject = useStore((state) => state.addProject);
  const renameProject = useStore((state) => state.renameProject);
  const deleteProject = useStore((state) => state.deleteProject);
  const selectProject = useStore((state) => state.selectProject);

  const [newProjectName, setNewProjectName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState("");

  const handleAddProject = () => {
    if (newProjectName.trim()) {
      addProject(newProjectName.trim());
      setNewProjectName("");
    }
    console.log("After set", selectProject);
  };
  return (
    <div className="w-72 h-full p-5 border-r border-gray-200 bg-gradient-to-b from-white to-blue-50 shadow-lg">
      <h2 className="text-2xl flex font-bold mt-5 text-blue-800 mb-6 text-center item center">
        <img src={logo} alt="Logo" className="w-12" /> <p className="pl-2"> All Projects</p>
      </h2>

      <div className="space-y-2">
        {projects.map((project) => (
          <div
            key={project.id}
            className={cn(
              "p-3 rounded-lg cursor-pointer flex justify-between items-center group transition-all duration-200 shadow-sm",
              currentProjectId === project.id
                ? "bg-blue-100 text-blue-800 font-semibold ring-2 ring-blue-300"
                : "hover:bg-blue-50"
            )}
            onClick={() => {
              selectProject(project.id);
              console.log("cuur project in sidebar component", project.id);
            }}
          >
            {editingId === project.id ? (
              <input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onBlur={() => {
                  renameProject(project.id, editedName);
                  setEditingId(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    renameProject(project.id, editedName);
                    setEditingId(null);
                  }
                }}
                className="w-full px-2 py-1 border-b border-blue-400 bg-transparent focus:outline-none"
                autoFocus
              />
            ) : (
              <>
                <span className="truncate">{project.name}</span>
                <div className="flex gap-2 text-gray-500 text-sm">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingId(project.id);
                      setEditedName(project.name);
                    }}
                    title="Rename"
                    className="hover:text-blue-600"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteProject(project.id);
                    }}
                    title="Delete"
                    className="hover:text-red-600"
                  >
                    ❌
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6">
        <input
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          placeholder="New project name"
          className="w-full p-2 text-sm border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 mb-3"
        />
        <button
          onClick={handleAddProject}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-all duration-200"
        >
          ➕ Add Project
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
