// testPopulate.js - helper to seed IndexedDB with sample costs across months/years
// Usage: open public/test.html in a browser or run from the app and call window.populateTestData()

// IIFE to avoid leaking helpers into global scope except the final API.
(async function () {
  // Small helper: produce a random decimal between min and max.
  function rand(min, max) {
    return Math.round((Math.random() * (max - min) + min) * 100) / 100
  }

  // Static test data helpers: categories and currencies used for seeding.
  const CATEGORIES = ['Food & Dining', 'Transportation', 'Housing', 'Utilities', 'Entertainment', 'Healthcare', 'Shopping', 'Other']
  const CURRENCIES = ['USD', 'ILS', 'GBP', 'EURO']

  // Main seeding function. Options let you customize DB name, year and density.
  async function populateTestData({ dbName = 'costsdb', dbVersion = 1, year = new Date().getFullYear(), itemsPerMonth = 6 } = {}) {
    // Ensure the vanilla idb API is available globally before proceeding.
    if (!window.idb || !window.idb.openCostsDB) throw new Error('idb not available on window')

    // Open the database and obtain the wrapper with add/get methods.
    const db = await window.idb.openCostsDB(dbName, dbVersion)

    // Collect promises for all inserts so we can await them in bulk.
    const promises = []

    // Iterate months and insert a few randomized items per month.
    for (let m = 1; m <= 12; m++) {
      for (let i = 0; i < itemsPerMonth; i++) {
        // Choose a pseudo-random day within the month for the cost item.
        const day = Math.max(1, Math.floor(Math.random() * 28))
        const dateStr = new Date(year, m - 1, day).toISOString()

        // Build the cost object using random category and currency.
        const cost = {
          sum: rand(5, 300),
          currency: CURRENCIES[Math.floor(Math.random() * CURRENCIES.length)],
          category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
          description: `Test item ${m}-${i}`,
          date: dateStr
        }

        // Prefer addCostWithDate so provided `date` is preserved in storage.
        if (db.addCostWithDate) {
          promises.push(db.addCostWithDate(cost))
        } else {
          // Fallback: addCost exists but will attach `new Date()` instead.
          promises.push(db.addCost(cost))
        }
      }
    }

    // Await all inserts and return results to caller for verification.
    const results = await Promise.all(promises)
    console.info(`Inserted ${results.length} test costs into '${dbName}' for year ${year}`)
    return results
  }

  // Expose a single helper to window for manual invocation in DevTools.
  window.populateTestData = populateTestData
})()
