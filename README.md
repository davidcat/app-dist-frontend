# App Distribution Platform - Frontend

A React + TypeScript + TailwindCSS frontend for the App Distribution Platform.

## Features

- 🎨 Modern, responsive UI
- 🔐 User authentication
- 📱 Upload and manage Android/iOS apps
- 📊 Download statistics
- 🔗 Shareable download pages with QR codes
- 👥 Admin dashboard

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Styling**: TailwindCSS
- **State**: Zustand
- **HTTP**: Axios
- **Routing**: React Router v6
- **Build**: Vite

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Set up environment:
```bash
cp .env.example .env.local
# Edit .env.local with your backend URL
```

3. Start development server:
```bash
npm run dev
```

4. Open http://localhost:5173

## Project Structure

```
src/
├── components/         # Reusable components
│   ├── common/        # Header, Footer, Loading
│   ├── auth/          # Login, Register forms
│   ├── apps/          # App cards, lists, versions
│   └── admin/         # Admin components
├── pages/             # Route pages
├── hooks/             # Custom hooks
├── services/          # API service
├── store/             # Zustand stores
└── types/             # TypeScript types
```

## Deployment

See the [deployment guide](../DEPLOYMENT.md) for detailed instructions.

## License

MIT License
