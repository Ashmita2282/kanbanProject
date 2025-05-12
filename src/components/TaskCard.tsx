import React from 'react';
import type { Task } from '../types';

interface Props {
  task: Task;
}

const TaskCard: React.FC<Props> = ({ task }) => {
  return (
    <div className="bg-white p-3 rounded shadow hover:shadow-md transition">
      <h4 className="font-semibold">{task.title}</h4>
      {task.description && <p className="text-sm mt-1 text-gray-600">{task.description}</p>}
      <p className="text-xs text-gray-400 mt-2">Created: {new Date(task.createdAt).toLocaleDateString()}</p>
    </div>
  );
};

export default TaskCard;
