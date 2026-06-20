# 🌩️ Nimbus Cloud IDE

Nimbus Cloud IDE is a browser-based development environment that brings a full coding workflow to the cloud. Write, run, and collaborate on projects from any device without local setup.

## 🚀 Features

### 🤝 Real-time collaboration
Collaborate in the same workspace with live, multi-user editing.

### 💻 Integrated terminal
Run commands directly in the browser alongside your editor.

### 📁 Project management
Organize files and projects within a structured workspace.

### ☁️ Scalable architecture
Built with a cloud-native architecture designed for performance and growth.

## 🏗️ Data Pipeline
<img width="4158" height="2222" alt="Nimbus" src="https://github.com/user-attachments/assets/688ba0e4-edb2-4cbd-a579-95dd9f276a66" />

## 🛠️ Setup

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm (included with Node.js)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/R7nX/Nimbus.git
   cd Nimbus
   ```

2. Navigate to the app directory and install dependencies:
   ```bash
   cd nimbus
   npm install
   ```

### Running locally

Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Other commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run start` | Start production server (requires build first) |
| `npm run lint` | Run ESLint |

## 🗺️ Routes

| Path | Description |
|------|-------------|
| `/` | Simple editor demo |
| `/homepage` | Main IDE with full file management |
| `/login` | User login |
| `/signup` | User registration |

## 🌐 Browser Support

The File System Access API (used for native open/save dialogs) is only available in Chromium-based browsers.

| Browser | Support |
|---------|---------|
| Chrome / Edge / Opera | Full — native file open & save |
| Safari / Firefox | Limited — save falls back to download |

## 🧰 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Editor**: Monaco Editor 0.52
- **UI**: React 19, Tailwind CSS, Framer Motion
- **Language**: TypeScript 5
