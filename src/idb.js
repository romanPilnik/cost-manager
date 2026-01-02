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
            // Generates a report filtered by month and year.
            // This method generates a detailed report and calculates the total in a selected currency.
getReport: function(year, month, currency) {
    return new Promise(async (resolve) => {
        const transaction = db.transaction(['costs'], 'readonly');
        const store = transaction.objectStore('costs');
        const request = store.getAll();

        // Fetching the exchange rates URL from localStorage as defined in settings.
        const ratesUrl = localStorage.getItem('exchangeRatesUrl');
        let rates = { "USD": 1, "ILS": 3.4, "GBP": 0.6, "EURO": 0.7 }; // Default fallback rates.

        try {
            // Attempting to fetch live rates from the server-side provided by the user.
            if (ratesUrl) {
                const response = await fetch(ratesUrl);
                rates = await response.json();
            }
        } catch (error) {
            // Logging the error if the fetch fails, the app will continue with defaults.
            console.error("Currency fetch failed, using fallback:", error);
        }

        request.onsuccess = () => {
            // Filtering the database results to match the requested month and year.
            const filtered = request.result.filter(item => {
                const d = new Date(item.date);
                return d.getFullYear() === year && (d.getMonth() + 1) === month;
            });

            // Calculating the total sum by converting each item to the target currency.
            const totalSum = filtered.reduce((accumulator, item) => {
                // Formula: (Amount / Original Rate) * Target Rate (Base is always USD).
                const amountInUSD = item.sum / rates[item.currency];
                const convertedAmount = amountInUSD * rates[currency];
                return accumulator + convertedAmount;
            }, 0);

            // Resolving the promise with the structured report object required by specs.
            resolve({
                year: year,
                month: month,
                costs: filtered.map(c => ({
                    sum: c.sum,
                    currency: c.currency,
                    category: c.category,
                    description: c.description,
                    Date: { day: new Date(c.date).getDate() }
                })),
                total: { 
                    currency: currency, 
                    total: Number(totalSum.toFixed(2)) // Rounding to 2 decimal places.
                }
            });
        };
    });
}
        };
    }
};

// Exposing to global window for the automated testing.
window.idb = idb;