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
[**📖 Documentation**](https://flowtile.vercel.app/docs) • 
[**🤝 Contributing**](CONTRIBUTING.md) • 
[**🐛 Report Bug**](https://github.com/VinayDangodra28/flowtile/issues/new?template=bug_report.md) • 
[**💡 Request Feature**](https://github.com/VinayDangodra28/flowtile/issues/new?template=feature_request.md)

</div>

---

**FlowTile** is an intuitive, browser-based design editor that empowers creators to build stunning geometric patterns, layouts, and artistic compositions. With precision tools, smart guides, and an extensible architecture, FlowTile makes complex design work accessible to everyone.

## Key Features

### Shape Creation & Manipulation

- **Geometric Shapes**: Rectangles, circles, triangles with customizable properties
- **Image Support**: Upload and integrate PNG, JPG, SVG images into your designs
- **Advanced Styling**: Colors, gradients, opacity, shadows, and rotation controls
- **Precision Tools**: Move, resize, rotate with snap guides and aspect ratio locking

### Smart Workspace

- **Intelligent Snap Guides**: Automatic alignment assistance for precise positioning
- **Layer Management**: Organize, reorder, lock, and manage design elements
- **Canvas Controls**: Custom dimensions, background options (solid, gradient, transparent)
- **Responsive Interface**: Optimized for desktop design work

### Pattern & Grid System

- **Grid Generator**: Create seamless tile patterns from your designs
- **Multiple Layouts**: Square grids and brick pattern offsets
- **Border Controls**: Customizable borders for pattern grids
- **Tile Types**: Various pattern arrangements for different use cases

### Project Management

- **Auto-Save**: Automatic project saving with thumbnail generation
- **Project Browser**: Visual grid and list views of your projects
- **Import/Export**: Share projects as FlowTile files or export as images
- **Search & Filter**: Quickly find projects by name

### Productivity Features

- **Keyboard Shortcuts**: Speed up workflow with comprehensive shortcuts
- **Undo/Redo**: Full edit history with unlimited undo/redo
- **Duplication**: Quick shape duplication and transformation
- **Dark/Light Mode**: Comfortable editing in any lighting condition

## Technologies Used

- **Frontend Framework**: React 18.3.1 with modern hooks
- **Routing**: React Router DOM 7.6.2 for seamless navigation
- **Styling**: Tailwind CSS 4.0.13 for responsive design
- **Icons**: Lucide React & React Icons for consistent UI
- **Canvas Rendering**: Custom HTML5 Canvas implementation
- **State Management**: React Context API for global state
- **Storage**: IndexedDB for images, localStorage for projects
- **Build Tool**: Vite 6.0.1 for fast development and builds
- **Deployment**: Vercel for reliable hosting

## Getting Started

### Online Usage

1. Visit [flowtile.vercel.app](https://flowtile.vercel.app)
2. Click "Editor" to start creating
3. Add shapes using the left sidebar tools
4. Customize properties in the right panel
5. Save your project and export when ready

### Local Development

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
```


```
flowtile/
├── src/
│   ├── components/
│   │   ├── Editor/          # Main editor components
│   │   ├── Navbar/          # Navigation component
│   │   └── styles/          # Component styles
│   ├── context/             # React contexts
│   ├── hooks/               # Custom hooks
│   ├── utils/               # Utility functions
│   ├── App.jsx              # Main app component
│   ├── Home.jsx             # Landing page
│   ├── Docs.jsx             # Documentation page
│   └── ProjectList.jsx      # Project management
├── public/                  # Static assets
└── package.json             # Dependencies
```

## Contributing

We welcome contributions from the community! FlowTile is open source and thrives on collaboration.

### 🚀 Quick Start for Contributors

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/YOUR_USERNAME/flowtile.git`
3. **Install** dependencies: `npm install`
4. **Start** development: `npm run dev`
5. **Make** your changes and submit a pull request

### 📋 How to Contribute

- 🐛 **Report bugs** using our [bug report template](https://github.com/VinayDangodra28/flowtile/issues/new?template=bug_report.md)
- 💡 **Suggest features** using our [feature request template](https://github.com/VinayDangodra28/flowtile/issues/new?template=feature_request.md)
- 📖 **Improve documentation** by fixing typos or adding examples
- 🎨 **Enhance the UI/UX** with design improvements
- ⚡ **Optimize performance** and fix accessibility issues
- 🧪 **Add tests** to improve code coverage

### 🎯 Areas We Need Help With

- **Mobile Responsiveness**: Touch controls and mobile-first design
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support  
- **Testing**: Unit tests, integration tests, and end-to-end tests
- **Performance**: Canvas optimization and memory management
- **Documentation**: Tutorials, guides, and API documentation

For detailed guidelines, please read our [**Contributing Guide**](CONTRIBUTING.md).

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with React and modern web technologies
- Icons provided by [Lucide](https://lucide.dev/) and [React Icons](https://react-icons.github.io/)
- Deployed on [Vercel](https://vercel.com) for optimal performance
