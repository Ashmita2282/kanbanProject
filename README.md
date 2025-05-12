# Kanban Board

A web-based Kanban Board application built with React, Zustand, and Tailwind CSS for task and project management.

## Features

- **Project Management**
  - Create, rename, delete projects
  - Sidebar navigation with current project highlighting
  - Persistent storage via LocalStorage

- **Task Management**
  - Add tasks with title, description, and optional deadline
  - Edit and delete tasks
  - View created date and overdue indication

- **Task Status Columns**
  - To-Do, In-Progress, Done columns
  - Drag-and-drop tasks between columns (@hello-pangea/dnd)
  - Manual "Move to ..." buttons for direct status changes

- **Responsive Design**
  - Adaptive grid layout
  - Clean UI with hover effects, shadows, and animations

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd <project_folder>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) to view in the browser.

### Production Build

Build the application for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── Sidebar.tsx
│   ├── Board.tsx
│   └── ...
├── store/
│   └── useStore.ts
├── types/
│   └── index.ts
├── utils/
│   └── helpers.ts
├── App.tsx
└── main.tsx
```

## Customization

- **Theme Toggle**: Light and dark mode support via Tailwind `dark:` classes
- **Styling**: Utility-first Tailwind for rapid UI development

## License

This project is licensed under the MIT License.