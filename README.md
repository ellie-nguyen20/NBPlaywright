# NBPlaywright - Nebula Block Portal E2E Testing

A comprehensive end-to-end testing suite for the Nebula Block Portal using Playwright and TypeScript.

## 🚀 Features

- **Comprehensive Test Coverage**: Tests for instances, API keys, team management, billing, and more
- **Page Object Model**: Well-structured page objects for maintainable tests
- **HTML Reporting**: Detailed HTML reports for test analysis
- **Cross-browser Support**: Configured for Chromium
- **CI/CD Ready**: Optimized for continuous integration

## 📋 Prerequisites

- **Node.js**: Version 16 or higher
- **npm**: Package manager

## 🛠️ Installation

```bash
# Clone and install
git clone <repository-url>
cd NBPlaywright
npm install
npx playwright install
```

## 🧪 Running Tests

```bash
# Run all tests
npm test

# Run with browser UI
npm run test:headed

# Run with Playwright UI
npm run test:ui

# Run specific test file
npx playwright test tests/login.spec.ts

# Open HTML report
npx playwright show-report
```

## 📁 Project Structure

```
NBPlaywright/
├── tests/                    # Test specifications
├── pages/                   # Page Object Models
├── utils/                   # Utility functions
├── fixtures/                # Test data
├── constants/               # Application constants
└── playwright.config.ts     # Configuration
```

## 📝 Test Categories

- **Authentication**: Login/logout functionality
- **Core Features**: Home, Dashboard, Instances, API Keys
- **Team Management**: Team creation, member management
- **Infrastructure**: SSH Keys, Object Storage, Reserved Instances
- **Serverless**: Models, Video, Image, Text Vision processing
- **Account & Billing**: Settings, Payments, Contact, Referral

## 🔧 Configuration

### Base Configuration
- **Base URL**: `https://dev-portal.nebulablock.com`
- **Browser**: Chromium
- **Timeout**: 20 seconds
- **Screenshots**: Only on failure

### Environment Variables
Create `.env` file:
```env
TEST_BASE_URL=https://dev-portal.nebulablock.com
TEST_USER_EMAIL=your-email@example.com
TEST_USER_PASSWORD=your-password
```

## 🔍 Debugging

```bash
# Debug mode
npm run test:debug

# Trace viewer
npx playwright show-trace trace.zip

# Screenshots and videos: test-results/
```

## 🚀 CI/CD Example

```yaml
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npx playwright install
      - run: npm test
```

## 🐛 Troubleshooting

### Common Issues
1. **Timeout Errors**: Increase timeout in `playwright.config.ts`
2. **Selector Issues**: Use data-testid attributes, avoid fragile selectors
3. **Authentication**: Verify credentials in fixtures

### Getting Help
- Check test reports for detailed error information
- Use debugging tools (UI mode, trace viewer)
- Review Playwright documentation

## 📄 License

ISC License

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new features
4. Ensure all tests pass
5. Submit a pull request

---

**Happy Testing! 🧪✨** 