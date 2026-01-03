// idb.js - This library manages the local IndexedDB storage.
// It is designed using Promises to handle asynchronous DB operations.

const idb = {
    // Opens or creates the database.
    openCostsDB: function(name, version) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(name, version);

            // Handle schema updates (creating the 'costs' object store).
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('costs')) {
                    // Using 'id' as an auto-incrementing primary key.
                    db.createObjectStore('costs', { keyPath: 'id', autoIncrement: true });
                }
            };

            request.onsuccess = () => resolve(idb.createWrapper(request.result));
            request.onerror = () => reject(request.error);
        });
    },

    // A helper to wrap the DB instance with the required methods.
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
            // Generates a report filtered by month and year.
            // This method generates a detailed report and calculates the total in a selected currency.
getReport: async function(year, month, currency) {
    // 1. FETCH RATES FIRST
    // We handle the network request before touching the database.
    const ratesUrl = localStorage.getItem('exchangeRatesUrl') || 'https://currency-rates-api-gdwf.onrender.com/rates.json';
    let rates = {}; // No static fallback rates

    try {
        const response = await fetch(ratesUrl);
        const data = await response.json();
        // Extract the rates object from the API response
        rates = data.rates || rates;
    } catch (error) {
        console.error("Currency fetch failed, no rates available:", error);
    }

    // 2. QUERY DATABASE
    // Now we wrap ONLY the IndexedDB part in a Promise
    const allCosts = await new Promise((resolve, reject) => {
        // Note: Assumes 'db' is available in this scope (from openCostsDB)
        const transaction = db.transaction(['costs'], 'readonly');
        const store = transaction.objectStore('costs');
        const request = store.getAll();

        request.onerror = () => reject("Error fetching costs from DB");
        request.onsuccess = () => resolve(request.result);
    });

    // 3. PROCESS DATA
    // Pure logic (filtering and calculating) happens here synchronously
    
    // Filter by year and month
    const filtered = allCosts.filter(item => {
        const d = new Date(item.date);
        // Note: Check if your saved dates are strings or Date objects. 
        // If strings, new Date() is correct.
        return d.getFullYear() === year && (d.getMonth() + 1) === month;
    });

    // Calculate Total using fetched rates
    const totalSum = filtered.reduce((accumulator, item) => {
        // Safety check: if currency doesn't exist in rates, default to 1 to prevent NaN
        const itemRate = rates[item.currency] || 1;
        const targetRate = rates[currency] || 1;
        
        // Formula: (Amount / Original Rate) * Target Rate
        const amountInUSD = item.sum / itemRate;
        const convertedAmount = amountInUSD * targetRate;
        
        return accumulator + convertedAmount;
    }, 0);

    // 4. RETURN RESULT
    return {
        year: year,
        month: month,
        costs: filtered.map(c => {
            // Keep original currency and sum for individual items
            return {
                sum: c.sum,
                currency: c.currency,
                category: c.category,
                description: c.description,
                Date: { day: new Date(c.date).getDate() }
            };
        }),
        total: {
            currency: currency,
            total: Number(totalSum.toFixed(2))
        }
    };
}
        };
    }
};

// Exposing to global window for the automated testing.
window.idb = idb;