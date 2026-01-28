# 🏛️ Community Hub - Church Management Platform

A modern, comprehensive church community management system built with React, Express.js, and PostgreSQL. Designed to strengthen community connections through seamless digital experiences.

![Community Hub Banner](https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1200&h=400&fit=crop&q=80)

## ✨ Features Overview

### 🎥 **Sermon Management**
- Video and audio sermon streaming
- Sermon series organization
- Speaker profiles and search
- Thumbnail management
- Download capabilities

### 📅 **Event Management**
- Community event calendar
- RSVP functionality
- Event categories and filtering
- Image galleries
- Location mapping integration

### 🙏 **Prayer Requests**
- Anonymous and authenticated submissions
- Prayer count tracking
- Community prayer support
- Privacy controls
- Request categorization

### 💰 **Giving & Donations**
- Secure online giving platform
- Multiple payment methods
- Donation history tracking
- Recurring giving options
- Tax receipt generation

### 👥 **User Authentication**
- Secure user registration/login
- Role-based access control
- Profile management
- Session management
- OAuth integration

### 🎨 **Customizable Branding**
- Church-specific color schemes
- Logo and image management
- Font customization
- Theme switching
- White-label solution

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component library
- **Vite** - Fast build tool
- **React Query** - Server state management
- **Wouter** - Lightweight routing

### Backend
- **Express.js** - Web application framework
- **Node.js** - JavaScript runtime
- **TypeScript** - Type-safe server code
- **Drizzle ORM** - Type-safe database queries
- **PostgreSQL** - Robust database system
- **Express Session** - Session management

### Development & Deployment
- **ESBuild** - Fast JavaScript bundler
- **PostCSS** - CSS processing
- **Replit** - Cloud development environment

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Git

## 🛠️ Installation & Setup

### 1. Clone Repository
```bash
git clone git@github.com:Moses-main/Lekki_Church.git
cd Lekki_Church
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:

```bash
# Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require

# Authentication
REPL_ID=your_replit_app_id
SESSION_SECRET=your_secure_session_secret

# Optional: Object Storage
PUBLIC_OBJECT_SEARCH_PATHS=path1,path2
PRIVATE_OBJECT_DIR=your_private_directory
```

### 4. Database Setup
```bash
# Create database tables
node setup-db.js

# Or use Drizzle migrations
npm run db:push
```

### 5. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:5000` to access the application.

## 📖 Usage Guide

### For Church Administrators
1. **Setup Branding**: Customize colors, fonts, and logos
2. **Add Content**: Upload sermons, create events
3. **Manage Users**: Configure roles and permissions
4. **Monitor Analytics**: Track engagement and donations

### For Community Members
1. **Browse Content**: Watch sermons, view events
2. **Participate**: RSVP to events, submit prayer requests
3. **Give**: Make secure donations online
4. **Connect**: Engage with community features

## 🏗️ Project Structure

```
Community-Hub/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Route components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility libraries
│   │   └── index.css      # Global styles
│   └── index.html         # HTML template
│
├── server/                # Express Backend
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API route definitions
│   ├── db.ts             # Database configuration
│   ├── storage.ts        # Data access layer
│   └── replit_integrations/ # Authentication & storage
│
├── shared/               # Shared TypeScript types
│   ├── schema.ts        # Database schema
│   └── routes.ts        # API route definitions
│
├── setup-db.js         # Database initialization
└── package.json        # Dependencies & scripts
```

## 🔧 Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm start         # Start production server
npm run check     # TypeScript type checking
npm run db:push   # Push database schema changes
```

## 🌐 API Endpoints

### Sermons
- `GET /api/sermons` - List all sermons
- `GET /api/sermons/:id` - Get specific sermon
- `POST /api/sermons` - Create new sermon (auth required)

### Events
- `GET /api/events` - List all events
- `GET /api/events/:id` - Get specific event
- `POST /api/events` - Create new event (auth required)
- `POST /api/events/:id/rsvp` - RSVP to event (auth required)

### Prayer Requests
- `GET /api/prayer-requests` - List prayer requests
- `POST /api/prayer-requests` - Submit prayer request (auth required)
- `POST /api/prayer-requests/:id/pray` - Increment prayer count

### Donations
- `POST /api/donations` - Process donation

### Branding
- `GET /api/branding` - Get current branding
- `POST /api/branding` - Update branding (auth required)

## 🎨 Customization

### Theming
The platform supports extensive theming through CSS custom properties:

```css
:root {
  --primary: 215 25% 27%;      /* Deep Slate Blue */
  --secondary: 210 40% 96%;    /* Light Gray */
  --accent: 262 83% 58%;       /* Purple Accent */
  /* ... more variables */
}
```

### Branding API
Update church branding programmatically:

```javascript
const branding = {
  colors: {
    primary: "#1e40af",
    secondary: "#f8fafc", 
    accent: "#3b82f6"
  },
  fonts: {
    heading: "Inter",
    body: "Inter"
  },
  logoUrl: "https://example.com/logo.png"
};

await fetch('/api/branding', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(branding)
});
```

## 🔐 Security Features

- **SQL Injection Protection** - Parameterized queries with Drizzle ORM
- **XSS Prevention** - Input sanitization and CSP headers
- **CSRF Protection** - Token-based validation
- **Secure Sessions** - HTTP-only cookies with secure flags
- **Environment Variables** - Sensitive data protection
- **Role-Based Access** - Granular permission system

## 🚀 Deployment Options

### Replit Deployment
1. Import project to Replit
2. Configure environment variables
3. Run `npm run build`
4. Deploy with one-click

### Traditional Hosting
1. Build the application: `npm run build`
2. Serve `dist/` folder with any web server
3. Configure database connection
4. Set up SSL certificate

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Commit changes: `git commit -m 'Add amazing feature'`
5. Push to branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Development Guidelines
- Follow TypeScript strict mode
- Use ESLint and Prettier
- Write meaningful commit messages
- Add tests for new features
- Update documentation

## 📊 Performance & Monitoring

### Built-in Optimizations
- Server-side rendering ready
- Image lazy loading
- Code splitting
- Database query optimization
- CDN-ready static assets

### Monitoring Endpoints
- `GET /health` - Application health check
- `GET /api/stats` - Usage statistics
- Performance metrics via console logging

## 🆘 Troubleshooting

### Common Issues

**Database Connection Failed**
```bash
# Check DATABASE_URL format
export DATABASE_URL="postgresql://user:pass@host:port/db?sslmode=require"
```

**Port Already in Use**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

**Build Errors**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Styling Issues**
```bash
# Rebuild Tailwind CSS
npm run build
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with love for church communities worldwide
- Inspired by the need for better digital community tools
- Special thanks to open-source contributors

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the troubleshooting guide above
- Review the API documentation

---

**Made with ❤️ for church communities seeking to connect, grow, and serve together in the digital age.**

---

### 🌟 Features Roadmap

- [ ] Mobile application (React Native)
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Live streaming integration
- [ ] Member directory
- [ ] Small groups management
- [ ] Volunteer scheduling
- [ ] Automated email campaigns
- [ ] Advanced reporting tools
- [ ] Third-party integrations (Zoom, Google Calendar)

### 📈 Version History

- **v1.0.0** - Initial release with core features
- **v1.1.0** - Enhanced UI/UX and performance improvements
- **v1.2.0** - Advanced authentication and role management
- **v2.0.0** - Complete platform overhaul (current)