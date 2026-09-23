// ============================================
// INTERACTIVE SQL TUTORIAL - JAVASCRIPT
// ============================================
// This file handles all SQL database operations using SQL.js
// (SQLite compiled to JavaScript - runs entirely in browser!)

// ============================================
// TYPE DEFINITIONS (JSDoc)
// ============================================
// JSDoc provides type hints for better code understanding and IDE support

/**
 * @typedef {Object} Customer
 * @property {number} customer_id - Unique customer identifier
 * @property {string} customer_name - Customer's full name
 * @property {string} county - County the customer lives in
 */

/**
 * @typedef {Object} Product
 * @property {number} product_id - Unique product identifier
 * @property {string} product_name - What the shop calls it
 * @property {string} category - Stationery, Tech, Clothing...
 * @property {number} price - Price in euro
 * @property {number} stock - How many are left on the shelf
 */

/**
 * @typedef {Object} Order
 * One line on a receipt: who bought what, and how many
 * @property {number} order_id - Unique order identifier
 * @property {string} order_date - Date as text, YYYY-MM-DD
 * @property {number} quantity - How many were bought
 * @property {number} customer_id - Points at a row in customer_tbl
 * @property {number} product_id - Points at a row in product_tbl
 */

/**
 * @typedef {Object} QueryResult
 * @property {string[][]} values - 2D array of result values
 * @property {string[]} columns - Array of column names
 */

/**
 * @typedef {'loading' | 'ready' | 'error'} DatabaseStatus
 */

// ============================================
// GLOBAL VARIABLES
// ============================================

/** @type {any} - SQL.js database instance */
let db = null;

/** @type {any} - SQL.js library instance */
let SQL = null;

/** @type {DatabaseStatus} - Current database status */
let dbStatus = 'loading';

// ============================================
// ASYNC/AWAIT EXPLAINED
// ============================================
// async/await makes asynchronous code look synchronous
// - async: Marks a function as asynchronous (returns a Promise)
// - await: Pauses execution until the Promise resolves
// 
// Example:
// async function getData() {
//     const result = await fetch('url');  // Wait for this to complete
//     return result;                       // Then continue
// }

/**
 * Initialize SQL.js and create the database
 * This runs when the page loads
 * 
 * @async
 * @returns {Promise<void>}
 */
async function initializeDatabase() {
    try {
        // TRY-CATCH EXPLAINED:
        // try { } - Code that might fail
        // catch(error) { } - What to do if it fails
        // This prevents crashes and allows graceful error handling
        
        updateStatus('loading', 'Starting the database...');
        
        // AWAIT EXPLAINED:
        // initSqlJs() returns a Promise (asynchronous operation)
        // await pauses here until the Promise resolves
        // Without await, SQL would be undefined
        SQL = await initSqlJs({
            locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
        });
        
        // Create a new database instance in memory
        db = new SQL.Database();
        
        // Create tables and populate with sample data
        createTables();
        populateSampleData();
        
        updateStatus('ready', 'Database ready! Try running a query below.');
        dbStatus = 'ready';
        
    } catch (error) {
        // INSTANCEOF EXPLAINED:
        // Checks if error is an instance of a specific class
        // Helps us understand what type of error occurred
        console.error('Failed to initialize database:', error);
        updateStatus('error', `Database initialization failed: ${error.message}`);
        dbStatus = 'error';
    }
}

/**
 * Create the customer_tbl, product_tbl and order_tbl tables
 * 
 * @returns {void}
 */
function createTables() {
    // SQL CREATE TABLE EXPLAINED:
    // - Creates a new table in the database
    // - Defines column names and data types
    // - PRIMARY KEY: Unique identifier for each row
    // - NOT NULL: Column cannot be empty
    //
    // NAMING CONVENTIONS USED HERE:
    // - Every table name ends in _tbl
    // - Every table's id is named after it: product_tbl has product_id
    // - Foreign keys go at the bottom of the table, with the same name
    //   as the id they point at
    
    const createCustomerTable = `
        CREATE TABLE IF NOT EXISTS customer_tbl (
            customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_name TEXT NOT NULL,
            county TEXT NOT NULL
        );
    `;
    
    const createProductTable = `
        CREATE TABLE IF NOT EXISTS product_tbl (
            product_id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_name TEXT NOT NULL,
            category TEXT NOT NULL,
            price REAL NOT NULL,
            stock INTEGER NOT NULL
        );
    `;
    
    // FOREIGN KEYS EXPLAINED:
    // customer_id and product_id hold the id of a row in another table.
    // REFERENCES records which table and column they point at. That link
    // is what a JOIN follows to put a name back next to each number.
    const createOrderTable = `
        CREATE TABLE IF NOT EXISTS order_tbl (
            order_id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_date TEXT NOT NULL,
            quantity INTEGER NOT NULL,
            customer_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            FOREIGN KEY (customer_id) REFERENCES customer_tbl (customer_id),
            FOREIGN KEY (product_id) REFERENCES product_tbl (product_id)
        );
    `;
    
    // TEMPLATE LITERALS EXPLAINED:
    // Backticks (`) allow multi-line strings and string interpolation
    // Example: `Hello ${name}` - embeds variables in strings
    
    // Execute the CREATE TABLE statements
    db.run(createCustomerTable);
    db.run(createProductTable);
    db.run(createOrderTable);
}

/**
 * Populate tables with sample data
 * 
 * @returns {void}
 */
function populateSampleData() {
    // The names come from many backgrounds on purpose: a class should be
    // able to see itself in its examples.
    
    // ARRAY OF OBJECTS EXPLAINED:
    // Each object represents one row in the database
    // Keys are column names, values are the data
    
    /** @type {Array<{customer_name: string, county: string}>} */
    const customers = [
        { customer_name: 'Aoife Murphy', county: 'Galway' },
        { customer_name: 'Kwame Mensah', county: 'Dublin' },
        { customer_name: 'Priya Sharma', county: 'Cork' },
        { customer_name: 'Mateus Oliveira', county: 'Dublin' },
        { customer_name: 'Zofia Nowak', county: 'Limerick' },
        { customer_name: 'Wei Chen', county: 'Cork' },
        { customer_name: 'Amina Yusuf', county: 'Dublin' },
        { customer_name: 'Dmytro Kovalenko', county: 'Waterford' }
    ];
    
    // The headphones are out of stock and nobody has ordered them,
    // which Exercises 7 and 13 go looking for.
    /** @type {Array<{product_name: string, category: string, price: number, stock: number}>} */
    const products = [
        { product_name: 'Notebook', category: 'Stationery', price: 3.50, stock: 40 },
        { product_name: 'Gel pens (pack of 3)', category: 'Stationery', price: 4.25, stock: 25 },
        { product_name: 'Water bottle', category: 'Accessories', price: 12.00, stock: 8 },
        { product_name: 'Hoodie', category: 'Clothing', price: 35.00, stock: 6 },
        { product_name: 'USB stick', category: 'Tech', price: 9.99, stock: 15 },
        { product_name: 'Headphones', category: 'Tech', price: 24.50, stock: 0 }
    ];
    
    // [order_date, quantity, customer_id, product_id]: one line on a receipt each.
    // Wei Chen (customer 6) hasn't bought anything yet.
    /** @type {Array<[string, number, number, number]>} */
    const orders = [
        ['2026-09-01', 2, 1, 1],   // Aoife: 2 notebooks
        ['2026-09-01', 1, 1, 3],   // Aoife: a water bottle
        ['2026-09-02', 3, 2, 2],   // Kwame: 3 packs of gel pens
        ['2026-09-02', 1, 3, 4],   // Priya: a hoodie
        ['2026-09-03', 5, 4, 1],   // Mateus: 5 notebooks
        ['2026-09-03', 2, 4, 5],   // Mateus: 2 USB sticks
        ['2026-09-04', 1, 5, 3],   // Zofia: a water bottle
        ['2026-09-05', 4, 7, 2],   // Amina: 4 packs of gel pens
        ['2026-09-05', 1, 7, 4],   // Amina: a hoodie
        ['2026-09-06', 2, 8, 5],   // Dmytro: 2 USB sticks
        ['2026-09-06', 1, 8, 1],   // Dmytro: a notebook
        ['2026-09-07', 1, 2, 5]    // Kwame: a USB stick
    ];
    
    // PREPARED STATEMENTS EXPLAINED:
    // The ? placeholders prevent SQL injection attacks
    // Values are safely inserted by the database engine
    const customerStmt = db.prepare('INSERT INTO customer_tbl (customer_name, county) VALUES (?, ?)');
    const productStmt = db.prepare('INSERT INTO product_tbl (product_name, category, price, stock) VALUES (?, ?, ?, ?)');
    const orderStmt = db.prepare('INSERT INTO order_tbl (order_date, quantity, customer_id, product_id) VALUES (?, ?, ?, ?)');
    
    // FOREACH EXPLAINED:
    // Loops through each item in the array
    // customer => {...} is an arrow function
    // Arrow functions are shorthand for function(customer) {...}
    customers.forEach(customer => {
        customerStmt.run([customer.customer_name, customer.county]);
    });
    
    products.forEach(product => {
        productStmt.run([product.product_name, product.category, product.price, product.stock]);
    });
    
    orders.forEach(order => {
        orderStmt.run(order);
    });
    
    // CLEANUP:
    // Free memory used by prepared statements
    customerStmt.free();
    productStmt.free();
    orderStmt.free();
}

/**
 * Update the database status display
 * 
 * @param {DatabaseStatus} status - The status to display
 * @param {string} message - Status message
 * @returns {void}
 */
function updateStatus(status, message) {
    // DOM MANIPULATION EXPLAINED:
    // document.getElementById() gets an HTML element by its ID
    // We then modify its properties (className, textContent)
    
    const statusDiv = document.getElementById('db-status');
    if (!statusDiv) return;
    
    // CONDITIONAL (TERNARY) OPERATOR EXPLAINED:
    // condition ? valueIfTrue : valueIfFalse
    // Shorthand for if-else statements
    const statusClass = status === 'ready' ? 'ready' : status === 'error' ? 'error' : '';
    
    statusDiv.className = `db-status ${statusClass}`;
    statusDiv.innerHTML = `<span class="status-indicator"></span> ${message}`;
}

/**
 * Execute a SQL query and display results
 * This is called when the user clicks "Run Query"
 * 
 * @returns {void}
 */
function executeQuery() {
    // GUARD CLAUSE EXPLAINED:
    // Early return if conditions aren't met
    // Prevents deeply nested if statements
    if (dbStatus !== 'ready') {
        displayError('Database not ready. Please wait or refresh the page.');
        return;
    }
    
    // GET INPUT VALUE:
    // Retrieves the SQL query from the textarea
    const queryInput = document.getElementById('sql-query');
    if (!queryInput) {
        displayError('Query input not found.');
        return;
    }
    
    const query = queryInput.value.trim();
    
    // VALIDATION:
    // Check if query is empty
    if (!query) {
        displayError('Please enter a SQL query.');
        return;
    }
    
    try {
        // ROWS CHANGED:
        // total_changes() counts every row the database has ever inserted,
        // updated or deleted. Reading it before and after this query tells
        // us how many rows this query changed. (Asking only for "the last
        // change" would repeat an old number after a SELECT.)
        const changesBefore = totalChanges();
        
        // EXEC EXPLAINED:
        // Executes the SQL query and returns results
        // Returns an array of result objects
        const results = db.exec(query);
        
        const rowsChanged = totalChanges() - changesBefore;
        
        // CONDITIONAL EXECUTION:
        // Different display based on query type
        if (results.length === 0) {
            // No table to show: either the query changed rows (INSERT,
            // UPDATE, DELETE) or it was a SELECT that matched nothing
            const detail = rowsChanged > 0
                ? `${rowsChanged} row${rowsChanged === 1 ? '' : 's'} changed.`
                : 'No rows to show: nothing matched, or the command doesn\'t return rows.';
            displaySuccess(`Query ran. ${detail}`);
        } else {
            // Query returned data (SELECT)
            // One result per SELECT, so several SELECTs show several tables
            displayResults(results);
        }
        
    } catch (error) {
        // ERROR HANDLING:
        // Display user-friendly error message
        displayError(error.message);
    }
}

/**
 * How many rows the database has changed since it was opened
 * 
 * @returns {number}
 */
function totalChanges() {
    return db.exec('SELECT total_changes()')[0].values[0][0];
}

/**
 * Display query results as HTML tables, one per result
 * 
 * @param {QueryResult[]} results - Query result objects
 * @returns {void}
 */
function displayResults(results) {
    const resultsDiv = document.getElementById('query-results');
    if (!resultsDiv) return;
    
    resultsDiv.innerHTML = results.map(resultToHtml).join('');
}

/**
 * Build the HTML table for one query result
 * 
 * @param {QueryResult} result - Query result object
 * @returns {string} - HTML for a heading and a table
 */
function resultToHtml(result) {
    // DESTRUCTURING EXPLAINED:
    // Extracts properties from an object into variables
    // const {columns, values} = result;
    // Same as:
    // const columns = result.columns;
    // const values = result.values;
    const { columns, values } = result;
    
    // BUILD HTML TABLE:
    // We construct the table as a string, then insert it into the DOM
    
    // TABLE HEADER
    // MAP EXPLAINED:
    // Transforms each element in an array
    // Returns a new array with the transformed elements
    const headerRow = columns.map(col => `<th>${escapeHtml(col)}</th>`).join('');
    
    // TABLE ROWS
    // MAP + MAP:
    // Outer map loops through rows, inner map loops through cells
    const bodyRows = values.map(row => {
        const cells = row.map(cell => `<td>${escapeHtml(String(cell))}</td>`).join('');
        return `<tr>${cells}</tr>`;
    }).join('');
    
    // TEMPLATE LITERAL WITH HTML:
    // Creates multi-line HTML string
    return `
        <h4>Query Results (${values.length} row${values.length === 1 ? '' : 's'})</h4>
        <table>
            <thead>
                <tr>${headerRow}</tr>
            </thead>
            <tbody>
                ${bodyRows}
            </tbody>
        </table>
    `;
}

/**
 * Display a success message
 * 
 * @param {string} message - Success message
 * @returns {void}
 */
function displaySuccess(message) {
    const resultsDiv = document.getElementById('query-results');
    if (!resultsDiv) return;
    
    resultsDiv.innerHTML = `
        <h4>Done</h4>
        <p class="success">${escapeHtml(message)}</p>
    `;
}

/**
 * Display an error message
 * 
 * @param {string} message - Error message
 * @returns {void}
 */
function displayError(message) {
    const resultsDiv = document.getElementById('query-results');
    if (!resultsDiv) return;
    
    resultsDiv.innerHTML = `
        <h4>Error</h4>
        <p class="error">${escapeHtml(message)}</p>
    `;
}

/**
 * Escape HTML to prevent XSS attacks
 * SECURITY EXPLAINED:
 * If user input contains <script> tags, they could execute malicious code
 * This function converts < > & " ' to safe HTML entities
 * 
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Set the query textarea to a predefined query
 * Called when user clicks an example query button
 * 
 * @param {string} query - The query to set
 * @returns {void}
 */
function setQuery(query) {
    const queryInput = document.getElementById('sql-query');
    if (queryInput) {
        queryInput.value = query;
    }
}

/**
 * Clear the query textarea
 * 
 * @returns {void}
 */
function clearQuery() {
    const queryInput = document.getElementById('sql-query');
    if (queryInput) {
        queryInput.value = '';
    }
}

/**
 * List every table in the database with its columns and row count.
 * Includes any tables the student has created themselves.
 * 
 * @returns {void}
 */
function showTables() {
    if (dbStatus !== 'ready') {
        displayError('Database not ready. Please wait or refresh the page.');
        return;
    }
    
    const resultsDiv = document.getElementById('query-results');
    if (!resultsDiv) return;
    
    // SQLITE_MASTER EXPLAINED:
    // SQLite keeps a list of everything in the database in a table of its
    // own, called sqlite_master. You can query it like any other table.
    const tables = db.exec(
        "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
    );
    
    if (tables.length === 0) {
        displaySuccess('There are no tables. Press Reset Database to bring the sample tables back.');
        return;
    }
    
    const rows = tables[0].values.map(([tableName]) => {
        // Double any " in the name so a table called, say, my"table still works
        const quoted = `"${tableName.replace(/"/g, '""')}"`;
        // PRAGMA table_info lists a table's columns; column 1 of each row
        // is the column's name and column 2 is its type
        const columns = db.exec(`PRAGMA table_info(${quoted})`)[0].values
            .map(col => `${col[1]} (${col[2] || 'any'})`)
            .join(', ');
        const count = db.exec(`SELECT COUNT(*) FROM ${quoted}`)[0].values[0][0];
        return `<tr><td><strong>${escapeHtml(tableName)}</strong></td><td>${escapeHtml(columns)}</td><td>${count}</td></tr>`;
    }).join('');
    
    resultsDiv.innerHTML = `
        <h4>Tables in the database</h4>
        <table>
            <thead>
                <tr><th>Table</th><th>Columns</th><th>Rows</th></tr>
            </thead>
            <tbody>
                ${rows}
            </tbody>
        </table>
    `;
}

/**
 * Reset the database to its original state
 * Drops all tables and recreates them with sample data
 * 
 * @returns {void}
 */
function resetDatabase() {
    if (dbStatus !== 'ready') {
        alert('Database not ready. Please wait or refresh the page.');
        return;
    }
    
    // CONFIRM DIALOG:
    // Asks user for confirmation before proceeding
    // Returns true if user clicks OK, false if Cancel
    if (!confirm('Are you sure you want to reset the database? All changes will be lost.')) {
        return;
    }
    
    try {
        // DROP TABLE EXPLAINED:
        // Completely removes a table from the database
        // IF EXISTS prevents errors if table doesn't exist
        db.run('DROP TABLE IF EXISTS order_tbl');
        db.run('DROP TABLE IF EXISTS customer_tbl');
        db.run('DROP TABLE IF EXISTS product_tbl');
        
        // Recreate tables and populate with sample data
        createTables();
        populateSampleData();
        
        alert('Database reset successfully!');
        
        // Clear results display
        const resultsDiv = document.getElementById('query-results');
        if (resultsDiv) {
            resultsDiv.innerHTML = '<h4>Database reset! Ready for new queries.</h4>';
        }
        
    } catch (error) {
        alert(`Failed to reset database: ${error.message}`);
    }
}

// ============================================
// EVENT LISTENERS
// ============================================
// EVENT LISTENERS EXPLAINED:
// Wait for the DOM to fully load before running code
// This ensures all HTML elements exist before we try to access them

// IIFE (Immediately Invoked Function Expression) EXPLAINED:
// (function() { ... })();
// Creates a private scope to avoid polluting global namespace
// The function runs immediately when the script loads

/**
 * Initialize when DOM is ready
 */
document.addEventListener('DOMContentLoaded', function() {
    // DOM CONTENT LOADED EXPLAINED:
    // Fires when HTML is parsed and DOM is built
    // Safe to access and manipulate HTML elements
    
    console.log('Page loaded. Initializing database...');
    initializeDatabase();
    
    // "LOAD IT INTO THE PLAYGROUND" BUTTONS:
    // Each answer's button keeps its query in a data-query attribute.
    // One listener on the whole page handles all of them (event delegation)
    document.addEventListener('click', function(event) {
        const button = event.target.closest('.try-answer');
        if (!button) return;
        
        setQuery(button.dataset.query);
        const queryInput = document.getElementById('sql-query');
        if (queryInput) {
            // 'nearest' does nothing when the playground is already on screen
            // (it stays pinned beside the exercises on a wide screen)
            queryInput.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            queryInput.focus({ preventScroll: true });
        }
    });
    
    // KEYBOARD SHORTCUTS:
    // Add Enter key support for running queries (Ctrl/Cmd + Enter)
    const queryInput = document.getElementById('sql-query');
    if (queryInput) {
        queryInput.addEventListener('keydown', function(event) {
            // EVENT OBJECT EXPLAINED:
            // Contains information about the event (which key, mouse position, etc.)
            // event.key: The key that was pressed
            // event.ctrlKey/metaKey: Whether Ctrl (Windows) or Cmd (Mac) was held
            
            if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
                event.preventDefault(); // Prevent default newline behavior
                executeQuery();
            }
        });
    }
});

// ============================================
// MAKE FUNCTIONS GLOBALLY ACCESSIBLE
// ============================================
// WINDOW OBJECT EXPLAINED:
// The global object in browsers
// Assigning to window makes functions available to HTML onclick handlers
// Without this, onclick="executeQuery()" wouldn't work

window.executeQuery = executeQuery;
window.setQuery = setQuery;
window.clearQuery = clearQuery;
window.resetDatabase = resetDatabase;
window.showTables = showTables;

// ============================================
// DEVELOPER NOTES
// ============================================
// 
// JAVASCRIPT CONCEPTS DEMONSTRATED:
// ✅ Variables (let, const)
// ✅ Data types (string, number, boolean, object, array)
// ✅ Functions (regular, arrow, async)
// ✅ Promises & async/await
// ✅ Error handling (try-catch)
// ✅ DOM manipulation
// ✅ Event listeners
// ✅ Array methods (forEach, map, join)
// ✅ Template literals
// ✅ Destructuring
// ✅ Ternary operators
// ✅ JSDoc type hints
// 
// SQL CONCEPTS DEMONSTRATED:
// ✅ CREATE TABLE
// ✅ INSERT INTO
// ✅ SELECT with WHERE
// ✅ JOIN and LEFT JOIN (foreign keys)
// ✅ ORDER BY
// ✅ COUNT, SUM and arithmetic (price * quantity)
// ✅ UPDATE and DELETE
// ✅ Prepared statements
// 
// BEST PRACTICES USED:
// ✅ Type hints with JSDoc
// ✅ Error handling
// ✅ Input validation
// ✅ Security (HTML escaping)
// ✅ Clear variable names
// ✅ Extensive comments
// ✅ Modular functions
// ✅ Guard clauses
// 
// ============================================
