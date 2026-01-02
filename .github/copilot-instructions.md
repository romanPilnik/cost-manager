# Cost Manager - AI Coding Guidelines

## Architecture Overview
This is a React-based cost tracking application using:
- **Frontend**: React 19 with Material-UI (@mui/material) components and Emotion styling
- **Build Tool**: Vite with React plugin for fast development
- **Storage**: IndexedDB via custom `idb.js` wrapper for local data persistence
- **State Management**: React useState hooks (no external state libraries)
- **Currency Conversion**: Mixed approach - API for individual items, static for totals

## Core Components Structure
- `App.jsx`: Main app with tabbed navigation (Add Cost, Reports, Settings)
- `AddCostView.jsx`: Form for adding expenses with validation
- `ReportsView.jsx`: Monthly reports with tables and custom charts
- `SettingsView.jsx`: Configuration for exchange rate API URL

## Key Patterns & Conventions

### Data Storage
- Use `window.idb.openCostsDB('costsdb', 1)` to initialize IndexedDB connection
- Cost objects: `{sum, currency, category, description, date}` (date auto-added)
- Reports generated via `db.getReport(year, month, currency)` with mixed conversion approach
- Settings stored in localStorage (`exchangeRatesUrl` key)

### UI Components
- Material-UI ThemeProvider with custom theme in `App.jsx`
- Form validation with error states and helper text
- Snackbar notifications for user feedback (success/error/info)
- Paper containers with elevation for content sections
- Grid layout for responsive forms and charts

### Currency Handling
- Supported currencies: `['USD', 'ILS', 'GBP', 'EURO']`
- Categories: `['Food & Dining', 'Transportation', 'Housing', 'Utilities', 'Entertainment', 'Healthcare', 'Shopping', 'Other']`
- Individual items: Display in original currency (no conversion)
- Total calculation: Uses static rates `{"USD": 1, "ILS": 3.67, "GBP": 0.79, "EURO": 0.95}` for consistency

### Error Handling
- Try/catch blocks around async DB operations
- User-friendly error messages via Snackbar
- Form validation prevents invalid submissions
- Graceful degradation (e.g., fallback exchange rates)

### Custom Charts
- Pie chart: Category distribution using LinearProgress bars with colors
- Bar chart: Monthly trends using LinearProgress bars
- No external charting libraries - built with Material-UI components

## Development Workflow
- `npm run dev`: Start Vite dev server with HMR
- `npm run build`: Production build to `dist/`
- `npm run lint`: ESLint checking with React-specific rules
- Manual testing: Open `src/test.html` in browser to test DB operations

## Code Style Notes
- ESLint config ignores unused vars starting with uppercase (for React components)
- Components export default at bottom
- Async operations use Promises (no async/await in some legacy code)
- Form data managed as single state object with field-specific handlers

## Common Tasks
- Adding new currencies: Update `CURRENCIES` array in relevant components
- New categories: Update `CATEGORIES` array in `AddCostView.jsx` and `ReportsView.jsx`
- API changes: Modify default URL in `SettingsView.jsx` and fallback in `idb.js`
- UI updates: Use Material-UI sx prop for styling, maintain theme consistency</content>
<parameter name="filePath">c:\Users\Benle\OneDrive\Desktop\project\cost-manager\.github\copilot-instructions.md
