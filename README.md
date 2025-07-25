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

**FlowTile** is an intuitive, browser-based design editor that empowers creators to build stunning geometric patterns, layouts, and artistic compositions. With precision tools, smart guides, and an extensible architecture, FlowTile makes complex design work accessible to everyone.

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
- **ESLint** - Code quality and consistency
- **TypeScript support** - Type-safe development

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

### 🧩 Key Architectural Principles

- **Separation of Concerns**: Clear boundaries between UI, business logic, and data
- **Component Composition**: Reusable, focused components with single responsibilities
- **Service Layer**: Dedicated services for complex operations (project management, storage)
- **Context-Based State**: Global state management without external dependencies
- **Performance First**: Optimized rendering with canvas and web workers
- **Mobile-Aware**: Responsive design with desktop-first approach

## 🎯 Core Components

### Editor System

- **Canvas Engine**: Custom HTML5 canvas with high-performance rendering
- **Shape System**: Flexible geometric and image-based shape creation
- **Tool Panels**: Contextual property editors and tool selection
- **Grid Generator**: Advanced pattern creation with multiple layouts

### Project Management

- **Auto-Save**: Seamless project persistence with thumbnails
- **Import/Export**: Cross-platform project sharing
- **Version History**: Complete undo/redo system
- **Storage Strategy**: Hybrid approach with localStorage + IndexedDB

## 🤝 Contributing

We welcome contributions from the community! FlowTile is open source and thrives on collaboration.

### 🚀 Quick Start for Contributors

1. **Fork** the repository on GitHub
2. **Clone** your fork: `git clone https://github.com/YOUR_USERNAME/flowtile.git`
3. **Install** dependencies: `npm install`
4. **Start** development: `npm run dev`
5. **Create a branch**: `git checkout -b feature/your-feature-name`
6. **Make** your changes and commit: `git commit -m "Add amazing feature"`
7. **Push** to your branch: `git push origin feature/your-feature-name`
8. **Submit** a pull request with detailed description

### 📋 How to Contribute

- 🐛 **Report bugs** using our [bug report template](https://github.com/VinayDangodra28/flowtile/issues/new?template=bug_report.md)
- 💡 **Suggest features** using our [feature request template](https://github.com/VinayDangodra28/flowtile/issues/new?template=feature_request.md)
- 📖 **Improve documentation** by fixing typos or adding examples
- 🎨 **Enhance the UI/UX** with design improvements
- ⚡ **Optimize performance** and fix accessibility issues
- 🧪 **Add tests** to improve code coverage
- 🔧 **Refactor code** following our architectural principles

### 🎯 Priority Areas We Need Help With

| Area                               | Priority | Skills Needed                          |
| ---------------------------------- | -------- | -------------------------------------- |
| **Mobile Responsiveness**    | High     | CSS, Touch Events, React               |
| **Accessibility (a11y)**     | High     | ARIA, Keyboard Nav, Screen Readers     |
| **Testing Coverage**         | High     | Jest, Testing Library, E2E             |
| **Performance Optimization** | Medium   | Canvas, Web Workers, Memory Management |
| **Documentation**            | Medium   | Technical Writing, Examples            |
| **Internationalization**     | Low      | i18n, Translations                     |

### 🛠 Development Guidelines

- **Code Style**: Follow ESLint configuration and Prettier formatting
- **Component Structure**: Use the established architecture patterns
- **Performance**: Consider canvas rendering performance in all changes
- **Accessibility**: Ensure keyboard navigation and screen reader support
- **Testing**: Add unit tests for new features and components
- **Documentation**: Update relevant docs for API or behavior changes

### 🐛 Found a Bug?

1. **Check** existing issues to avoid duplicates
2. **Provide** detailed reproduction steps
3. **Include** browser information and console errors
4. **Add** screenshots or screen recordings if helpful

### 💡 Have a Feature Idea?

1. **Search** existing feature requests
2. **Describe** the use case and expected behavior
3. **Consider** how it fits with existing architecture
4. **Propose** implementation approach if you can

## 🏆 Contributors

Thanks to all the amazing contributors who have helped make FlowTile better!

<!-- Contributors will be added here automatically -->

## 📊 Project Stats

- **Lines of Code**: ~15,000+
- **Components**: 25+ React components
- **Test Coverage**: Expanding (contributions welcome!)
- **Bundle Size**: Optimized for fast loading
- **Performance**: 60fps canvas rendering

## 🔗 Useful Links

- **[Live Application](https://flowtile.vercel.app)** - Try FlowTile online
- **[Documentation](https://flowtile.vercel.app/docs)** - User guide and tutorials
- **[Project Structure](STRUCTURE_IMPROVEMENTS.md)** - Architecture details
- **[Changelog](CHANGELOG.md)** - Version history and updates
- **[Roadmap](https://github.com/VinayDangodra28/flowtile/projects)** - Future plans

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### What this means:

- ✅ **Commercial use** - Use in commercial projects
- ✅ **Modification** - Modify and adapt the code
- ✅ **Distribution** - Share and distribute
- ✅ **Private use** - Use privately without restrictions
- ℹ️ **Attribution** - Please credit FlowTile in your project

## 🙏 Acknowledgments

- **React Team** - For the incredible React framework
- **Vite Team** - For blazing fast build tooling
- **Tailwind CSS** - For utility-first styling approach
- **Lucide** & **React Icons** - For beautiful, consistent icons
- **Vercel** - For seamless deployment and hosting
- **Open Source Community** - For inspiration and collaboration

## 🌟 Star History

If FlowTile has been helpful to you, please consider giving it a star! ⭐

[![Star History Chart](https://api.star-history.com/svg?repos=VinayDangodra28/flowtile&type=Date)](https://star-history.com/#VinayDangodra28/flowtile&Date)

---

<div align="center">

**Built with ❤️ by the FlowTile team**

[🚀 Try FlowTile Now](https://flowtile.vercel.app) | [📖 Read the Docs](https://flowtile.vercel.app/docs) | [🤝 Contribute](https://github.com/VinayDangodra28/flowtile/issues)

</div>
