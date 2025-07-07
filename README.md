# FlowTile

**FlowTile** is a powerful web-based visual design editor for creating geometric patterns, layouts, and artistic compositions. With an intuitive interface and comprehensive toolset, FlowTile empowers designers to create stunning visual designs with precision and ease.

**[Live Demo](https://flowtile.vercel.app)**

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

We welcome contributions! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

## Acknowledgments

- Built with React and modern web technologies
- Icons provided by [Lucide](https://lucide.dev/) and [React Icons](https://react-icons.github.io/)
- Deployed on [Vercel](https://vercel.com) for optimal performance
