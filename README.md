# Cost Manager

A modern, full-featured cost tracking and reporting application built with React and IndexedDB. Track expenses across multiple currencies, generate insightful reports, and visualize spending patterns with interactive charts.

## Features

### Core Functionality
- **Add Costs** - Track expenses with amount, currency, category, and description
- **Multi-Currency Support** - Support for USD, GBP, EUR, and ILS with real-time exchange rates
- **Reports & Analytics** - Generate detailed monthly and yearly expense reports
- **Data Visualization** - Interactive pie charts and bar charts for spending analysis
- **Offline-First** - All data stored locally using IndexedDB
- **Configurable Exchange Rates** - Set custom API endpoints for currency conversion

### Categories
Pre-configured expense categories:
- Food
- Health
- Housing
- Sport
- Education
- Transportation
- Other

## Tech Stack

- **Framework:** React 19.2.0
- **Build Tool:** Vite 7.2.4
- **UI Library:** Material-UI (MUI) 7.3.6
- **Styling:** Emotion (CSS-in-JS)
- **Database:** IndexedDB (client-side storage)
- **Language:** JavaScript (ES6+)

## Project Structure

```
cost-manager/
├── docs/                       # Documentation
│   ├── assignment_requirements.md
│   └── coding_standards.md
├── tests/                      # Test utilities
│   ├── test.html              # Browser-based IDB tests
│   └── testPopulate.js        # Test data population
├── public/                     # Static assets
│   ├── favicon.svg
│   └── idb.js                 # Vanilla JS IndexedDB wrapper
└── src/
    ├── config/                 # Application configuration
    │   ├── api.js             # API endpoints and helpers
    │   ├── constants.js       # App-wide constants
    │   └── theme.js           # MUI theme configuration
    ├── utils/                  # Utility functions
    │   └── chartHelpers.js    # SVG chart utilities
    ├── styles/                 # Component styles
    │   ├── AddCostView.css
    │   ├── ReportsView.css
    │   └── SettingsView.css
    ├── components/
    │   ├── AddCostView.jsx    # Cost entry form
    │   ├── ReportsView.jsx    # Reports dashboard
    │   ├── SettingsView.jsx   # App settings
    │   └── reports/           # Report sub-components
    │       ├── BarChart.jsx
    │       ├── PieChart.jsx
    │       ├── ReportFilters.jsx
    │       ├── ReportTable.jsx
    │       └── index.js
    ├── idb.module.js          # ES6 IndexedDB wrapper
    ├── main.jsx               # Application entry point
    ├── App.jsx                # Root component
    ├── App.css
    └── index.css
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cost-manager
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks

## IndexedDB Library

The project includes a custom IndexedDB wrapper library (`idb.js`) with two versions:

### ES6 Module Version (`src/idb.module.js`)
For use in React components with ES6 imports:
```javascript
import idb from './idb.module'
const db = await idb.openCostsDB('costsdb', 1)
```

### Vanilla Version (`public/idb.js`)
Standalone file for browser testing that attaches to `window.idb`:
```javascript
const db = await window.idb.openCostsDB('costsdb', 1)
```

### API Methods

#### `openCostsDB(databaseName, databaseVersion)`
Opens or creates the IndexedDB database.
- **Returns:** Promise resolving to database wrapper object

#### `addCost(cost)`
Adds a new cost entry with automatic date stamping.
- **Parameters:** `{ sum, currency, category, description }`
- **Returns:** Promise resolving to the saved cost object

#### `getReport(year, month, currency)`
Generates a detailed report for a specific month/year in the requested currency.
- **Parameters:** `year` (number), `month` (number), `currency` (string)
- **Returns:** Promise resolving to report object with costs array and totals

## Usage Guide

### Adding a Cost
1. Navigate to the "Add Cost" tab
2. Enter the amount, select currency and category
3. Add a description
4. Click "Add Cost"

### Viewing Reports
1. Navigate to the "Reports & Charts" tab
2. Select year, month, and currency
3. Click "Generate Report"
4. View detailed cost table, pie chart (by category), and bar chart (monthly trend)

### Configuring Exchange Rates
1. Navigate to the "Settings" tab
2. Enter custom exchange rates API URL
3. Click "Save Settings"
4. Default URL: `https://currency-rates-api-gdwf.onrender.com/rates.json`

## Testing

### Browser Testing
Open `tests/test.html` in a browser to test the vanilla IndexedDB wrapper:
1. Open `tests/test.html` in your browser
2. Open Developer Console (F12)
3. Check console logs for test results

### Test Data Population
Use `tests/testPopulate.js` to seed the database with sample data for development.

## Features in Detail

### Exchange Rate Conversion
- Fetches real-time exchange rates from configurable API
- Converts all costs to selected currency for reporting
- Falls back to 1:1 conversion if API is unavailable

### Data Visualization
- **Pie Chart:** Shows cost distribution across categories
- **Bar Chart:** Displays monthly spending trends for the year
- Both charts use SVG for crisp rendering at any size

### Offline Support
- All data stored locally in IndexedDB
- Works completely offline after initial load
- No server required for basic functionality

## Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari
- Any modern browser with IndexedDB support

## Code Quality

- ESLint configured with React best practices
- Single quotes for strings (except JSX attributes)
- Comprehensive inline comments
- Modular component architecture

## Architecture Highlights

- **Config-driven:** Centralized configuration in `src/config/`
- **Component-based:** Reusable React components
- **Separation of Concerns:** Clear separation between UI, logic, and data
- **Scalable:** Easy to add new features, currencies, or categories

## License

This project is for educational purposes.

## Contributing

This is an educational project. For improvements or bug fixes, please follow the coding standards documented in `docs/coding_standards.md`.
