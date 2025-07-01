# GooseTodo - スケーラブル自給自足モデル タスク管理

A task management system for the scalable self-sufficiency model project, focused on goose farming.

## Features

- 📅 Daily task management with calendar navigation
- ✅ Task completion tracking
- 📝 Task notes and memos
- 🔗 Background resource links management
- ⚠️ Overdue task alerts
- 📊 Progress tracking
- 📋 Markdown export functionality

## Tech Stack

- React 19 with TypeScript
- Vite for build tooling
- Playwright for component testing
- GitHub Actions for CI/CD
- GitHub Pages for deployment

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build for production
npm run build

# Preview production build
npm run preview
```

## Testing

This project includes comprehensive Playwright tests for input element stability:

- Japanese IME composition events
- Rapid typing scenarios
- Special characters and emojis
- Clipboard operations
- Focus management
- Concurrent input updates
- Long text handling
- Keyboard shortcuts

All tests pass in Chromium and Firefox browsers.

## Deployment

The project automatically deploys to GitHub Pages when pushing to the main branch.

## License

ISC