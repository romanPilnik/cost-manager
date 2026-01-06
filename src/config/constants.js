// constants.js
// Shared constants used by report components: currencies, month labels,
// color palette and currency symbols mapping. Keep these values static
// and import where needed across the reporting components.
export const CURRENCIES = ['USD', 'ILS', 'GBP', 'EURO']

// Month metadata: numeric value and display label for select inputs.
export const MONTHS = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' }
]

// Color palette used for charts and legends. Indexing is by slice index.
export const COLORS = ['#60a5fa', '#34d399', '#f472b6', '#fbbf24', '#a78bfa', '#f87171', '#22d3ee', '#c084fc']

// Mapping from currency code to display symbol for compact UI text.
export const CURRENCY_SYMBOLS = { USD: '$', ILS: '₪', GBP: '£', EURO: '€' }

// Categories used by the Add Cost form and for reports grouping.
export const CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Housing',
  'Utilities',
  'Entertainment',
  'Healthcare',
  'Shopping',
  'Other'
]
