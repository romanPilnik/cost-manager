# Coding Standards & "Rejects" Avoidance

## 1. Commenting Rules (Strict)
* **Frequency:** You MUST include a comment every **7-8 lines of code (max)**.
* **Format:**
    * Use `//` for single lines.
    * Use `/* ... */` for multi-line blocks.
    * **Do not** use JSDoc syntax unless specifically requested, but ensure comments are descriptive C/C++ style.

## 2. Naming Conventions
* **Variables & Functions:** camelCase (e.g., `calculateTotal`, `costItem`). Small letter start.
* **Classes & React Components:** PascalCase (e.g., `CostForm`, `ReportView`). Capital letter start.
* **File Names:**
    * **Standard JS files:** lowercase only (e.g., `idb.js`, `utils.js`).
    * **React Components:** Must match the component name exactly (e.g., `CostForm.js`, `PieChart.js`).

## 3. Variable Declarations
* **Forbidden:** Never use `var` (unless explicitly attaching to the global `window` object for the vanilla `idb.js`).
* **Required:** Use `const` by default. Use `let` only if the variable is reassigned later.

## 4. Comparison Logic
* **Strict Equality:** Always use `===` and `!==`. Never use `==` or `!=`.

## 5. formatting
* **Line Length:** Keep lines concise to prevent "Broken Lines" in PDF exports.
* **Alignment:** Ensure proper indentation (Prettier standard) to avoid "Lousy Code Format" penalties.