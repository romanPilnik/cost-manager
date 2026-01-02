// testPopulate.js - helper to seed IndexedDB with sample costs across months/years
// Usage: open the app in browser and run `window.populateTestData()` in the console.

(async function () {
  function rand(min, max) {
    return Math.round((Math.random() * (max - min) + min) * 100) / 100
  }

  const CATEGORIES = ['Food & Dining', 'Transportation', 'Housing', 'Utilities', 'Entertainment', 'Healthcare', 'Shopping', 'Other']
  const CURRENCIES = ['USD', 'ILS', 'GBP', 'EURO']

  async function populateTestData({ dbName = 'costsdb', dbVersion = 1, year = new Date().getFullYear(), itemsPerMonth = 6 } = {}) {
    if (!window.idb || !window.idb.openCostsDB) throw new Error('idb not available on window')

    const db = await window.idb.openCostsDB(dbName, dbVersion)

    const promises = []

    for (let m = 1; m <= 12; m++) {
      for (let i = 0; i < itemsPerMonth; i++) {
        const day = Math.max(1, Math.floor(Math.random() * 28))
        const dateStr = new Date(year, m - 1, day).toISOString()
        const cost = {
          sum: rand(5, 300),
          currency: CURRENCIES[Math.floor(Math.random() * CURRENCIES.length)],
          category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
          description: `Test item ${m}-${i}`,
          date: dateStr
        }
        // use addCostWithDate when available, fallback to addCost
        if (db.addCostWithDate) {
          promises.push(db.addCostWithDate(cost))
        } else {
          // fallback: temporarily call addCost but it will override date to now
          promises.push(db.addCost(cost))
        }
      }
    }

    const results = await Promise.all(promises)
    console.info(`Inserted ${results.length} test costs into '${dbName}' for year ${year}`)
    return results
  }

  // Expose to window for manual testing
  window.populateTestData = populateTestData
})()
