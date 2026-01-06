# Project: Cost Manager (Front End)

## 1. Technical Stack
* **Framework:** React (create-react-app or Vite).
* **UI Library:** MUI (Material UI).
* **Database:** IndexedDB (Client-side storage).
* **Language:** JavaScript (ES6+).

## 2. Core Architecture: The `idb.js` Library
You must implement a wrapper library for IndexedDB named `idb.js`.
**Crucial Requirement:** You must write **two versions** of this logic (or one adaptable file):
1.  **React Version:** Supports ES6 Modules (`export`/`import`) for the React app.
2.  **Vanilla Version:** A standalone file that assigns an `idb` property to the global `window` object (for the required `test.html`).

### `idb.js` API Specification
The library must return Promises for all async operations.
1.  `openCostsDB(databaseName, databaseVersion)`: Returns a Promise resolving to the database object.
2.  `addCost(cost)`:
    * Input: `{ sum (number), currency (string), category (string), description (string) }`.
    * Logic: Auto-generate the date (current date).
    * Output: Promise resolving to the added cost object.
3.  `getReport(year, month, currency)`:
    * Input: Year, Month, Target Currency.
    * Logic: Returns a detailed JSON report including a list of costs and a calculated total.

## 3. Application Features
### Input Form
* Users add costs with: Sum, Currency, Category, Description.
* Date is automatic.

### Visualization & Reporting
* **Pie Chart:** Shows total costs per category for a specific month/year.
* **Bar Chart:** Shows total costs per month for a specific year.
* **Currency Toggle:** Users can view charts in USD, ILS, GBP, or EURO.

### Currency Exchange
* **Fetching:** Rates must be fetched from a server-side API (a static JSON file hosted online is acceptable).
* **Config:** Users must be able to set/change the URL for the exchange rates via a "Settings" feature.
* **Default JSON Structure:** `{"USD":1, "GBP":0.6, "EURO":0.7, "ILS":3.4}`.

## 4. Report JSON Structure
The `getReport` function must return data in this exact format:
```json
{
  "year": 2025,
  "month": 9,
  "costs": [
    {
       "sum": 200,
       "currency": "USD",
       "category": "Food",
       "description": "Milk",
       "Date": { "day": 12 }
    }
  ],
  "total": { "currency": "USD", "total": 440 }
}