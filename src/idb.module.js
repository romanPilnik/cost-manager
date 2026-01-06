// idb.module.js - ES module version of the idb wrapper for use in React.
// Functionality mirrors the vanilla `idb.js` used by the test HTML file.

// This module exports a single `idb` object as the default export.
// It intentionally does NOT attach to `window` so React consumers can
// import it as an ES module (e.g., `import idb from './idb.module'`).

import { getExchangeRatesUrl } from './config/api'

const idb = {
    // Opens or creates the database. Returns a Promise resolving to a
    // wrapper object exposing `addCost`, `addCostWithDate` and `getReport`.
    openCostsDB: function(databaseName, databaseVersion) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(databaseName, databaseVersion);

            // Handle schema updates (creating the 'costs' object store).
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('costs')) {
                    // Using 'id' as an auto-incrementing primary key.
                    db.createObjectStore('costs', { keyPath: 'id', autoIncrement: true });
                }
            };

            // On success, wrap the DB instance with helper methods.
            request.onsuccess = () => resolve(idb.createWrapper(request.result));
            request.onerror = () => reject(request.error);
        });
    },

    // Wrap the raw IDB database instance with convenient async methods.
    createWrapper: function(db) {
        return {
            // Adds a new cost item to the store.
            addCost: (cost) => {
                return new Promise((resolve) => {
                    const transaction = db.transaction(['costs'], 'readwrite');
                    const store = transaction.objectStore('costs');
                    // Automatically attaching the current date.
                    const costToSave = { ...cost, date: new Date() };
                    store.add(costToSave);
                    transaction.oncomplete = () => resolve(costToSave);
                });
            },
            // Adds a new cost item but uses the provided `date` if present.
            // This is intended for testing and seeding purposes so tests can
            // insert items with historic dates (different months/years).
            // Variant that accepts a provided `date` (useful for tests/seeding)
            addCostWithDate: (cost) => {
                return new Promise((resolve) => {
                    const transaction = db.transaction(['costs'], 'readwrite');
                    const store = transaction.objectStore('costs');
                    // If `cost.date` is provided, keep it; otherwise attach current date.
                    const costToSave = { ...cost, date: cost.date ? new Date(cost.date) : new Date() };
                    store.add(costToSave);
                    transaction.oncomplete = () => resolve(costToSave);
                });
            },
            // Generates a report filtered by year and month and converts totals
            // into the requested `currency` using fetched exchange rates.
            getReport: async function(year, month, currency) {
                // 1) Fetch exchange rates (user-configurable endpoint)
                const ratesUrl = getExchangeRatesUrl();
                let rates = {}; // Will remain empty if fetch fails

                try {
                    const response = await fetch(ratesUrl);
                    const data = await response.json();
                    // Extract the rates object from the API response
                    rates = data || rates;
                } catch (error) {
                    // If the fetch fails, proceed with empty rates (1:1 fallback)
                    console.error('Currency fetch failed, no rates available:', error);
                }

                // 2) Read all stored costs from the DB
                const allCosts = await new Promise((resolve, reject) => {
                    const transaction = db.transaction(['costs'], 'readonly');
                    const store = transaction.objectStore('costs');
                    const request = store.getAll();

                    request.onerror = () => reject('Error fetching costs from DB');
                    request.onsuccess = () => resolve(request.result);
                });

                // 3) Filter by requested year/month
                const filtered = allCosts.filter(item => {
                    const d = new Date(item.date);
                    // Compare using strict equality per coding standards
                    return d.getFullYear() === year && (d.getMonth() + 1) === month;
                });

                // 4) Sum converted totals using fetched rates
                const totalSum = filtered.reduce((accumulator, item) => {
                    // Default to 1 if a rate is missing to avoid NaN
                    const itemRate = rates[item.currency] || 1;
                    const targetRate = rates[currency] || 1;

                    // Convert: (original / itemRate) * targetRate
                    const amountInUSD = item.sum / itemRate;
                    const convertedAmount = amountInUSD * targetRate;

                    return accumulator + convertedAmount;
                }, 0);

                // 5) Return the shaped report (include `id` for stable UI keys)
                return {
                    year: year,
                    month: month,
                    costs: filtered.map(c => ({
                        id: c.id,
                        sum: c.sum,
                        currency: c.currency,
                        category: c.category,
                        description: c.description,
                        Date: { day: new Date(c.date).getDate() }
                    })),
                    total: {
                        currency: currency,
                        total: Number(totalSum.toFixed(2))
                    }
                };
            }
        };
    }
};

export default idb;
