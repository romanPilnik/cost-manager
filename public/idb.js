// idb.js - This library manages the local IndexedDB storage (vanilla build).
// It is identical in behavior to the module version but attaches to `window`.

const idb = {
    // Open or create the named IndexedDB database and return a wrapper
    // that exposes the convenient async methods used by the app/tests.
    openCostsDB: function(databaseName, databaseVersion) {
        // Return a Promise that resolves when the DB is ready.
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(databaseName, databaseVersion);

            // onupgradeneeded: ensure the `costs` object store exists.
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('costs')) {
                    // Create object store using `id` as auto-increment key.
                    db.createObjectStore('costs', { keyPath: 'id', autoIncrement: true });
                }
            };

            // Wrap the underlying IDBDatabase instance and resolve.
            request.onsuccess = () => resolve(idb.createWrapper(request.result));
            // Surface errors through the returned Promise rejection.
            request.onerror = () => reject(request.error);
        });
    },
    createWrapper: function(db) {
        return {
            // Add a cost and automatically attach the current date.
            addCost: (cost) => {
                return new Promise((resolve) => {
                    // Create a readwrite transaction for the `costs` store.
                    const transaction = db.transaction(['costs'], 'readwrite');
                    const store = transaction.objectStore('costs');

                    // Attach current date to stored object for later reporting.
                    const costToSave = { ...cost, date: new Date() };
                    store.add(costToSave);

                    // Resolve with the saved object once transaction finishes.
                    transaction.oncomplete = () => resolve(costToSave);
                });
            },
            // Add a cost but use the provided `date` when one exists.
            // Useful for seeding historical data in tests.
            addCostWithDate: (cost) => {
                return new Promise((resolve) => {
                    const transaction = db.transaction(['costs'], 'readwrite');
                    const store = transaction.objectStore('costs');

                    // Preserve provided date or fall back to now.
                    const costToSave = { ...cost, date: cost.date ? new Date(cost.date) : new Date() };
                    store.add(costToSave);

                    // Resolve after the write transaction completes.
                    transaction.oncomplete = () => resolve(costToSave);
                });
            },
            // Generate a detailed monthly report in the requested currency.
            // Steps: fetch rates, read costs, filter by month/year, then convert and sum.
            getReport: async function(year, month, currency) {
                // Configurable rates endpoint stored in localStorage; default provided.
                const ratesUrl = localStorage.getItem('exchangeRatesUrl') || 'https://currency-rates-api-gdwf.onrender.com/rates.json';
                let rates = {};

                // Attempt to fetch rates; if it fails we fall back to 1:1 conversions.
                try {
                    const response = await fetch(ratesUrl);
                    const data = await response.json();
                    rates = data || rates;
                } catch (error) {
                    console.error('Currency fetch failed, no rates available:', error);
                }

                // Read all stored cost records from the DB in one request.
                const allCosts = await new Promise((resolve, reject) => {
                    const transaction = db.transaction(['costs'], 'readonly');
                    const store = transaction.objectStore('costs');
                    const request = store.getAll();

                    // Propagate IDB errors via rejection.
                    request.onerror = () => reject('Error fetching costs from DB');
                    request.onsuccess = () => resolve(request.result);
                });

                // Filter records that belong to the requested month/year.
                const filtered = allCosts.filter(item => {
                    const d = new Date(item.date);
                    return d.getFullYear() === year && (d.getMonth() + 1) === month;
                });

                // Convert and sum values into the target currency using fetched rates.
                const totalSum = filtered.reduce((accumulator, item) => {
                    const itemRate = rates[item.currency] || 1;
                    const targetRate = rates[currency] || 1;
                    const amountInUSD = item.sum / itemRate;
                    const convertedAmount = amountInUSD * targetRate;
                    return accumulator + convertedAmount;
                }, 0);

                // Shape and return the final report object expected by the UI/tests.
                return {
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
                        total: Number(totalSum.toFixed(2))
                    }
                };
            }
        };
    }
};

// Attach to global window for vanilla testing
window.idb = idb;
