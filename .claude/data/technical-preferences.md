# Technical Preferences for BMAD-Spec Orchestrator

## Frontend Technology Stack

### Primary Framework Choices
**React with TypeScript**: Preferred for complex, interactive applications
- **Version**: Latest stable React with TypeScript 5+
- **State Management**: Context API for simple state, Redux Toolkit for complex apps
- **Routing**: React Router v6 for SPA navigation
- **Component Patterns**: Functional components with hooks

**Next.js 14**: Preferred for full-stack applications with SSR/SSG needs
- **App Router**: Use Next.js 14 App Router over Pages Router
- **Server Components**: Leverage server components for performance
- **API Routes**: Built-in API routes for backend functionality
- **Deployment**: Optimized for Vercel deployment

### UI Framework Preferences
**Tailwind CSS**: Primary styling framework
- Use utility classes exclusively - avoid inline styles
- Implement consistent design systems with Tailwind config
- Mobile-first responsive design approach
- Custom component abstractions when needed

**Shadcn/UI**: Component library built on Radix UI + Tailwind
- Follow Shadcn component guidelines and best practices
- Consistent accessibility (WCAG 2.1 AA) compliance
- Customizable design system integration

### Build Tools and Development
**Vite**: Preferred for React-only applications
**Next.js built-in tooling**: For Next.js applications
**ESLint + Prettier**: Code quality and formatting
**TypeScript**: Strict type checking enabled

## Backend Technology Stack

### Runtime and Framework
**Node.js**: Primary runtime for JavaScript/TypeScript backends
- **Version**: Node.js 20+ LTS
- **Package Manager**: npm or pnpm preferred over yarn

**Python with FastAPI**: Preferred for API-heavy applications
- **Version**: Python 3.11+
- **Framework**: FastAPI for high-performance APIs
- **Async Patterns**: Proper async/await implementation
- **Validation**: Pydantic models for data validation

### API Design Standards
**RESTful APIs**: Standard approach for CRUD operations
- **HTTP Methods**: Proper use of GET, POST, PUT, DELETE, PATCH
- **Status Codes**: Meaningful HTTP status code usage
- **Error Handling**: Consistent error response format

**GraphQL**: For complex data fetching requirements
- **Schema Design**: Well-structured, queryable schemas
- **Caching**: Implement proper caching strategies

### Database Preferences
**PostgreSQL**: Primary choice for relational data
- **Version**: PostgreSQL 14+
- **ORM**: Prisma for TypeScript, SQLAlchemy for Python
- **Migrations**: Version-controlled database migrations

**MongoDB**: For document-based data storage
- **ODM**: Mongoose for Node.js applications
- **Schema Design**: Flexible but structured document schemas

**Redis**: For caching and session management
- **Use Cases**: Session storage, caching, real-time features

## Development Tools and Practices

### Code Quality Standards
**TypeScript**: Strict configuration enabled
```json
{
  "strict": true,
  "noImplicitAny": true,
  "strictNullChecks": true
}
```

**ESLint Configuration**: 
- Standard ESLint rules
- TypeScript ESLint integration
- React hooks rules
- Import/export validation

**Prettier Configuration**:
- Single quotes
- No semicolons
- 2-space indentation
- Trailing commas

### Testing Framework Preferences
**Jest**: Unit testing for JavaScript/TypeScript
**Vitest**: Alternative to Jest for Vite-based projects  
**React Testing Library**: Component testing for React
**Cypress**: End-to-end testing for web applications
**Playwright**: Alternative E2E testing for complex scenarios

### Version Control and CI/CD
**Git Workflows**:
- Feature branch workflow
- Conventional commit messages
- Pull request reviews required

**GitHub Actions**: Preferred CI/CD platform
- Automated testing on PR
- Deployment automation
- Code quality checks

## Security and Performance Standards

### Security Best Practices
**Authentication**: JWT with secure storage
**Authorization**: Role-based access control (RBAC)
**Input Validation**: Server-side validation for all inputs
**SQL Injection Prevention**: Parameterized queries only
**XSS Prevention**: Content Security Policy headers
**HTTPS**: All production traffic encrypted

### Performance Optimization
**Frontend**:
- Code splitting and lazy loading
- Image optimization and WebP format
- CDN usage for static assets
- Bundle size monitoring

**Backend**:
- Database query optimization
- Proper indexing strategies
- Caching layers (Redis, CDN)
- Connection pooling

## Accessibility Standards

### WCAG 2.1 AA Compliance
**Keyboard Navigation**: Full keyboard accessibility
**Screen Reader Support**: Proper semantic HTML and ARIA labels
**Color Contrast**: 4.5:1 minimum contrast ratio
**Focus Management**: Visible focus indicators and logical tab order

## Deployment and Infrastructure

### Hosting Preferences
**Vercel**: For Next.js and static applications
**Netlify**: Alternative for static sites and JAMstack
**Railway**: For Node.js backends and databases
**PlanetScale**: For MySQL-compatible databases
**Supabase**: For PostgreSQL with built-in authentication

### Environment Management
**Environment Variables**: Secure configuration management
**Docker**: Containerization for consistent deployments
**Database Migrations**: Version-controlled schema changes

## Mobile Development

### React Native**: For cross-platform mobile apps
- **Expo**: Managed workflow for rapid development
- **Native Modules**: Custom native code when needed
- **Platform-Specific**: iOS and Android design guidelines

## Monitoring and Analytics

### Application Monitoring
**Sentry**: Error tracking and performance monitoring
**Vercel Analytics**: For Next.js applications
**Google Analytics**: User behavior tracking
**LogRocket**: Session replay for debugging

### Performance Monitoring
**Web Vitals**: Core Web Vitals tracking
**Lighthouse**: Performance auditing
**Bundle Analyzer**: Bundle size monitoring

## Code Organization and Architecture

### File Structure Standards
```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   └── features/     # Feature-specific components
├── hooks/            # Custom React hooks
├── lib/              # Utility functions and configurations
├── pages/ or app/    # Page components (React Router or Next.js)
├── services/         # API calls and external integrations
├── styles/           # Global styles and Tailwind config
└── types/            # TypeScript type definitions
```

### Component Organization
- **Functional Components**: Use function declarations over arrow functions
- **Custom Hooks**: Extract reusable stateful logic
- **Component Composition**: Favor composition over inheritance
- **Props Interfaces**: Well-defined TypeScript interfaces for props

## Documentation Standards

### Code Documentation
**TSDoc**: TypeScript documentation comments
**README Files**: Project setup and usage instructions
**API Documentation**: OpenAPI/Swagger for REST APIs
**Component Documentation**: Storybook for component libraries

These technical preferences ensure consistent, high-quality, and maintainable code across all BMAD-Spec Orchestrator projects while following modern best practices and accessibility standards.