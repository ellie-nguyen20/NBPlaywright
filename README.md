# Playwright Test Automation

This project contains automated tests using Playwright for the Nebula Block development portal.

## Test Reports with Screenshots

### How to View Screenshots

The test reports are automatically published to GitHub Pages and include screenshots for all test executions. Here's how to access them:

1. **Access Reports**: Go to the GitHub Pages URL (usually `https://[username].github.io/[repo-name]/`)
2. **View Latest Report**: Click on the latest report link
3. **Find Screenshots**: In the report, you can find screenshots in:
   - **Test Results**: Each test case shows screenshots if available
   - **Failure Screenshots**: Failed tests include screenshots showing the state when the test failed
   - **Trace Viewer**: For more detailed debugging, use the trace viewer

### Screenshot Configuration

The project is configured to capture screenshots for:
- ✅ **All test executions** (not just failures)
- ✅ **Failed tests** with detailed error states
- ✅ **Trace files** for debugging complex issues

### Report Structure

Each report contains:
- `index.html` - Main report file
- `data/` - Test data and metadata
- `trace/` - Trace files for debugging
- Screenshots embedded in the HTML report

### Local Development

To run tests locally with screenshots:

```bash
# Install dependencies
npm install

# Run tests with screenshots
npx playwright test

# View the report
npx playwright show-report
```

### CI/CD Integration

The GitHub Actions workflow automatically:
1. Runs tests on every push/PR
2. Captures screenshots for all tests
3. Publishes reports to GitHub Pages
4. Maintains history of the last 10 reports

## Test Configuration

See `playwright.config.ts` for detailed configuration including:
- Screenshot settings: `screenshot: 'on'`
- Trace settings: `trace: 'on-first-retry'`
- Browser configuration
- Timeout settings 