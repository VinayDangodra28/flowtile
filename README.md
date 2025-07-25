# FlowTile

<div align="center">

![FlowTile Logo](public/flowtile.svg)

**A powerful web-based visual design editor for creating geometric patterns, layouts, and artistic compositions**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub Stars](https://img.shields.io/github/stars/VinayDangodra28/flowtile?style=social)](https://github.com/VinayDangodra28/flowtile/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/VinayDangodra28/flowtile?style=social)](https://github.com/VinayDangodra28/flowtile/network/members)
[![GitHub Issues](https://img.shields.io/github/issues/VinayDangodra28/flowtile)](https://github.com/VinayDangodra28/flowtile/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/VinayDangodra28/flowtile)](https://github.com/VinayDangodra28/flowtile/pulls)

[**🚀 Live Demo**](https://flowtile.vercel.app) •
[**📖 Documentation**](https://flowtile.vercel.app/docs)

</div>

---

**FlowTile** is an intuitive, browser-based design editor that empowers creators to build stunning seamless infinitely repeatable geometric patterns, layouts, and artistic compositions. With precision tools, smart guides, and an extensible architecture, FlowTile makes complex design work accessible to everyone.

## 🛠 Tech Stack

**Frontend Framework**

- **React 18.3.1** - Modern hooks and concurrent features
- **React Router DOM 7.6.2** - Client-side routing

**Styling & UI**

- **Tailwind CSS 4.0.13** - Utility-first responsive design
- **Lucide React & React Icons** - Consistent iconography
- **GSAP** - Smooth animations and transitions

**Development & Build**

- **Vite 6.0.1** - Lightning-fast dev server and builds

**Storage & Performance**

- **IndexedDB** - Efficient image storage
- **LocalStorage** - Project data persistence
- **HTML5 Canvas** - High-performance rendering
- **Web Workers** - Background processing for complex operations

**Deployment**

- **Vercel** - Global CDN and edge computing

## 🚀 Getting Started

### 🌐 Online Usage (Recommended)

1. **Visit** [flowtile.vercel.app](https://flowtile.vercel.app)
2. **Explore** the sample gallery and features overview
3. **Click "Start Creating"** to launch the editor
4. **Add shapes** using the left sidebar tools
5. **Customize** properties in the right panel
6. **Save** your project and export when ready

> **Note**: FlowTile is optimized for desktop use. Mobile devices will show a friendly redirect to the documentation.

### 💻 Local Development

```bash
# Clone the repository
git clone https://github.com/VinayDangodra28/flowtile.git

# Navigate to project directory
cd flowtile

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### 📋 System Requirements

- **Node.js** 18.0+ and npm 8.0+
- **Modern browser** with HTML5 Canvas support
- **Desktop/Tablet** for optimal editing experience (768px+ width)
- **4GB+ RAM** recommended for complex projects

## 🏗 Project Architecture

FlowTile follows a modern, scalable architecture with clear separation of concerns:

```
flowtile/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── Editor/          # Editor-specific components
│   │   │   ├── Editor.jsx           # Main editor container
│   │   │   ├── CanvasSection.jsx    # Canvas controls
│   │   │   ├── ElementsSection.jsx  # Shape tools
│   │   │   ├── GridSection.jsx      # Pattern generator
│   │   │   ├── Shape.jsx           # Shape renderer
│   │   │   └── Sidebar.jsx         # Tool panels
│   │   ├── Navbar/          # Navigation components
│   │   └── shared/          # Shared/common components
│   │       ├── MobileRestriction.jsx
│   │       ├── ProtectedRoute.jsx
│   │       ├── SampleGallery.jsx
│   │       └── UIControls.jsx
│   ├── pages/               # Application pages
│   │   ├── Home.jsx         # Landing page with features
│   │   ├── Docs.jsx         # Documentation
│   │   └── ProjectList.jsx  # Project management
│   ├── services/            # Business logic layer
│   │   ├── projectService.js    # Project CRUD operations
│   │   └── imageService.js      # Image storage (IndexedDB)
│   ├── context/             # React Context providers
│   │   ├── ThemeContext.jsx     # Dark/light mode
│   │   └── ProjectContext.jsx   # Current project state
│   ├── hooks/               # Custom React hooks
│   │   └── useCanvas.jsx        # Canvas management
│   ├── utils/               # Utility functions
│   │   └── shapeUtils.jsx       # Shape manipulation helpers
│   ├── constants/           # App-wide constants
│   │   └── index.js             # Configuration values
│   ├── styles/              # Centralized stylesheets
│   │   ├── homepage.css         # Landing page styles
│   │   └── editor.css           # Editor-specific styles
│   ├── App.jsx              # Root component with routing
│   ├── main.jsx             # Application entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
│   ├── flowtile.svg         # Logo and branding
│   ├── gridWorker.js        # Web worker for grid generation
│   └── garbata_font/        # Custom typography
└── package.json             # Dependencies and scripts
```

## ✨ Key Features

### 🎨 Shape Creation & Manipulation

- **Geometric Shapes**: Rectangles, circles, triangles with customizable properties
- **Image Support**: Upload and integrate PNG, JPG, SVG images into your designs
- **Advanced Styling**: Colors, gradients, opacity, shadows, and rotation controls
- **Precision Tools**: Move, resize, rotate with snap guides and aspect ratio locking

### 🧠 Smart Workspace

- **Intelligent Snap Guides**: Automatic alignment assistance for precise positioning
- **Layer Management**: Organize, reorder, lock, and manage design elements
- **Canvas Controls**: Custom dimensions, background options (solid, gradient, transparent)
- **Responsive Interface**: Optimized for desktop design work with mobile restrictions

### 🔲 Pattern & Grid System

- **Grid Generator**: Create seamless tile patterns from your designs
- **Multiple Layouts**: Square grids, brick pattern offsets, and custom arrangements
- **Border Controls**: Customizable borders for pattern grids
- **Tile Types**: Various pattern arrangements for different use cases

### 📁 Project Management

- **Auto-Save**: Automatic project saving with thumbnail generation
- **Project Browser**: Visual grid and list views of your projects with search
- **Import/Export**: Share projects as FlowTile files or export as high-quality images
- **Version Control**: Full undo/redo history for all operations

### ⚡ Productivity Features

- **Duplication & Arrangement**: Quick shape duplication and smart arrangement tools
- **Dark/Light Mode**: Comfortable editing in any lighting condition
- **Performance Optimized**: Smooth 60fps canvas rendering with efficient memory usage

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** - For the incredible React framework
- **Vite Team** - For blazing fast build tooling
- **Tailwind CSS** - For utility-first styling approach
- **Lucide** & **React Icons** - For beautiful, consistent icons
- **Vercel** - For seamless deployment and hosting
- **Open Source Community** - For inspiration and collaboration
