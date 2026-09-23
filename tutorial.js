// ============================================
// INTERACTIVE SQL TUTORIAL - JAVASCRIPT
// ============================================
// This file runs the SQL playground in Part 3. It uses SQL.js: SQLite,
// a real database engine, compiled so that it runs inside the browser.
// There's no server anywhere: the whole database lives in this page.
//
// READING THIS FILE:
// Comments marked "EXPLAINED" introduce a JavaScript or SQL idea the
// first time the code uses it. Search the file for a word below to find
// where it's explained and used:
//
// JavaScript
//   let and const                          LET AND CONST EXPLAINED
//   arrays and objects                     OBJECTS AND ARRAYS EXPLAINED
//   async / await and Promises             ASYNC/AWAIT EXPLAINED
//   try / catch                            TRY-CATCH EXPLAINED
//   template literals (`...${x}...`)       TEMPLATE LITERALS EXPLAINED
//   arrow functions and forEach            ARROW FUNCTIONS EXPLAINED
//   map and join                           MAP EXPLAINED
//   destructuring                          DESTRUCTURING EXPLAINED
//   the ternary operator (a ? b : c)       TERNARY
//   guard clauses (return early)           GUARD CLAUSE EXPLAINED
//   the DOM and innerHTML                  DOM MANIPULATION EXPLAINED
//   escaping text to stay safe             SECURITY EXPLAINED
//   events and event delegation            EVENT OBJECT EXPLAINED, delegation
//   localStorage                           readSavedDataset (and the
//                                          top of appearance.js)
//   JSDoc type comments (/** ... */)       TYPE DEFINITIONS
//
// SQL
//   CREATE TABLE, primary and foreign keys CREATE TABLE EXPLAINED
//   INSERT with prepared statements        PREPARED STATEMENTS EXPLAINED
//   DROP TABLE                             DROP TABLE EXPLAINED
//   the database's own catalogue           SQLITE_MASTER EXPLAINED
//
// The queries students write (SELECT, WHERE, JOIN...) aren't in this
// file: they're typed into the playground and passed to executeQuery().

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
 * @typedef {Object} Student
 * @property {number} student_id - Unique student identifier
 * @property {string} student_name - Student's full name
 * @property {string} county - County the student lives in
 */

/**
 * @typedef {Object} Module
 * @property {number} module_id - Unique module identifier
 * @property {string} module_name - What the module is called
 * @property {string} department - Computing, Business...
 * @property {number} credits - Credits the module is worth
 * @property {number} hours - Teaching hours a week (0 = not running)
 */

/**
 * @typedef {Object} Result
 * One exam result: which student, which module, what mark
 * @property {number} result_id - Unique result identifier
 * @property {string} exam_date - Date as text, YYYY-MM-DD
 * @property {number} mark - Mark out of 100 (40 is a pass)
 * @property {number} student_id - Points at a row in student_tbl
 * @property {number} module_id - Points at a row in module_tbl
 */

/**
 * @typedef {'shop' | 'school'} DatasetName
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
// LET AND CONST EXPLAINED:
// Both create a variable. A `let` variable can be given a new value
// later (db starts as null and becomes the database once it's ready);
// a `const` one can't. Use const unless you know the value will change:
// it tells the reader, and the browser, that it won't.
// (A const array or object can still have its contents changed: const
// only stops the name being pointed at a different array or object.)

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
        
        // Create a new, empty database. It lives in memory (RAM), which
        // is why refreshing the page gives you a fresh one.
        db = new SQL.Database();
        
        // Create the chosen sample tables and fill them
        buildDatabase(currentDataset);
        
        updateStatus('ready', `${DATASETS[currentDataset].label} database ready. Try running a query.`);
        dbStatus = 'ready';
        
    } catch (error) {
        // THE ERROR OBJECT:
        // Whatever went wrong arrives here as `error`. Its .message is a
        // human-readable description, which we show on the page;
        // console.error also prints the full details in the browser's
        // DevTools console (F12), for whoever is debugging.
        console.error('Failed to initialize database:', error);
        updateStatus('error', `Database initialization failed: ${error.message}`);
        dbStatus = 'error';
    }
}

// ============================================
// THE TWO SAMPLE DATABASES
// ============================================
// Students choose a shop or a school. Both follow the same conventions:
// - Every table name ends in _tbl
// - Every table's id is named after it: product_tbl has product_id
// - Foreign keys go at the bottom of the table, with the same name
//   as the id they point at
//
// SQL CREATE TABLE EXPLAINED:
// - Creates a new table in the database
// - Defines column names and data types
// - PRIMARY KEY: Unique identifier for each row
// - NOT NULL: Column cannot be empty
//
// FOREIGN KEYS EXPLAINED:
// A foreign key holds the id of a row in another table. REFERENCES
// records which table and column it points at. That link is what a JOIN
// follows to put a name back next to each number.
//
// The names come from many backgrounds on purpose: a class should be
// able to see itself in its examples. Both databases share them.

/** Where the student's choice of database is remembered */
const DATASET_KEY = 'html-css-sql-tutorial:dataset';

/** @type {Array<[string, string]>} [name, county] */
const PEOPLE = [
    ['Aoife Murphy', 'Galway'],
    ['Kwame Mensah', 'Dublin'],
    ['Priya Sharma', 'Cork'],
    ['Mateus Oliveira', 'Dublin'],
    ['Zofia Nowak', 'Limerick'],
    ['Wei Chen', 'Cork'],             // person 6 hasn't bought or sat anything yet
    ['Amina Yusuf', 'Dublin'],
    ['Dmytro Kovalenko', 'Waterford']
];

// OBJECTS AND ARRAYS EXPLAINED:
// An array [a, b, c] is a list, read by position: PEOPLE[0] is the first.
// An object { name: value, ... } is a set of labelled values, read by
// name: DATASETS.shop.label is 'Shop'. Here they're nested: an object
// of datasets, each holding arrays of rows, each row an array of values.
//
// TEMPLATE LITERALS EXPLAINED:
// Strings in backticks (`...`) can run over several lines, like the
// CREATE TABLE statements below, and can include values with ${...}:
// `Hello ${name}` puts the value of name into the string.
const DATASETS = {
    shop: {
        label: 'Shop',
        defaultQuery: 'SELECT * FROM product_tbl;',
        // Child tables first, so nothing is dropped while something points at it
        tables: ['order_tbl', 'customer_tbl', 'product_tbl'],
        create: [
            `CREATE TABLE customer_tbl (
                customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
                customer_name TEXT NOT NULL,
                county TEXT NOT NULL
            );`,
            `CREATE TABLE product_tbl (
                product_id INTEGER PRIMARY KEY AUTOINCREMENT,
                product_name TEXT NOT NULL,
                category TEXT NOT NULL,
                price REAL NOT NULL,
                stock INTEGER NOT NULL
            );`,
            `CREATE TABLE order_tbl (
                order_id INTEGER PRIMARY KEY AUTOINCREMENT,
                order_date TEXT NOT NULL,
                quantity INTEGER NOT NULL,
                customer_id INTEGER NOT NULL,
                product_id INTEGER NOT NULL,
                FOREIGN KEY (customer_id) REFERENCES customer_tbl (customer_id),
                FOREIGN KEY (product_id) REFERENCES product_tbl (product_id)
            );`
        ],
        rows: {
            'INSERT INTO customer_tbl (customer_name, county) VALUES (?, ?)': PEOPLE,
            // The headphones are out of stock and nobody has ordered them,
            // which Exercises 7 and 13 go looking for
            'INSERT INTO product_tbl (product_name, category, price, stock) VALUES (?, ?, ?, ?)': [
                ['Notebook', 'Stationery', 3.50, 40],
                ['Gel pens (pack of 3)', 'Stationery', 4.25, 25],
                ['Water bottle', 'Accessories', 12.00, 8],
                ['Hoodie', 'Clothing', 35.00, 6],
                ['USB stick', 'Tech', 9.99, 15],
                ['Headphones', 'Tech', 24.50, 0]
            ],
            // [order_date, quantity, customer_id, product_id]: one line on a receipt each
            'INSERT INTO order_tbl (order_date, quantity, customer_id, product_id) VALUES (?, ?, ?, ?)': [
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
            ]
        }
    },
    school: {
        label: 'School',
        defaultQuery: 'SELECT * FROM module_tbl;',
        tables: ['result_tbl', 'student_tbl', 'module_tbl'],
        create: [
            `CREATE TABLE student_tbl (
                student_id INTEGER PRIMARY KEY AUTOINCREMENT,
                student_name TEXT NOT NULL,
                county TEXT NOT NULL
            );`,
            `CREATE TABLE module_tbl (
                module_id INTEGER PRIMARY KEY AUTOINCREMENT,
                module_name TEXT NOT NULL,
                department TEXT NOT NULL,
                credits INTEGER NOT NULL,
                hours INTEGER NOT NULL
            );`,
            `CREATE TABLE result_tbl (
                result_id INTEGER PRIMARY KEY AUTOINCREMENT,
                exam_date TEXT NOT NULL,
                mark INTEGER NOT NULL,
                student_id INTEGER NOT NULL,
                module_id INTEGER NOT NULL,
                FOREIGN KEY (student_id) REFERENCES student_tbl (student_id),
                FOREIGN KEY (module_id) REFERENCES module_tbl (module_id)
            );`
        ],
        rows: {
            'INSERT INTO student_tbl (student_name, county) VALUES (?, ?)': PEOPLE,
            // Robotics isn't running this year (0 hours) and has no results,
            // which Exercises 7 and 13 go looking for
            'INSERT INTO module_tbl (module_name, department, credits, hours) VALUES (?, ?, ?, ?)': [
                ['Web Development', 'Computing', 15, 4],
                ['Databases', 'Computing', 10, 3],
                ['Maths for Computing', 'Computing', 5, 2],
                ['Communications', 'General Studies', 5, 2],
                ['Marketing', 'Business', 10, 3],
                ['Robotics', 'Computing', 15, 0]
            ],
            // [exam_date, mark, student_id, module_id]: one exam result each
            'INSERT INTO result_tbl (exam_date, mark, student_id, module_id) VALUES (?, ?, ?, ?)': [
                ['2026-05-11', 72, 1, 1],   // Aoife: Web Development
                ['2026-05-11', 65, 1, 2],   // Aoife: Databases
                ['2026-05-12', 58, 2, 1],   // Kwame: Web Development
                ['2026-05-12', 81, 3, 4],   // Priya: Communications
                ['2026-05-13', 47, 4, 3],   // Mateus: Maths for Computing
                ['2026-05-13', 90, 4, 1],   // Mateus: Web Development
                ['2026-05-14', 38, 5, 5],   // Zofia: Marketing
                ['2026-05-14', 74, 7, 2],   // Amina: Databases
                ['2026-05-15', 55, 7, 5],   // Amina: Marketing
                ['2026-05-15', 69, 8, 3],   // Dmytro: Maths for Computing
                ['2026-05-16', 83, 8, 2],   // Dmytro: Databases
                ['2026-05-16', 61, 2, 4]    // Kwame: Communications
            ]
        }
    }
};

/** @type {DatasetName} */
let currentDataset = readSavedDataset();

/** @returns {DatasetName} */
function readSavedDataset() {
    try {
        const saved = localStorage.getItem(DATASET_KEY);
        return saved === 'school' ? 'school' : 'shop';
    } catch (error) {
        return 'shop';
    }
}

/**
 * Empty the database and fill it with the chosen sample tables
 * 
 * @param {DatasetName} name
 * @returns {void}
 */
function buildDatabase(name) {
    const dataset = DATASETS[name];
    
    // DROP TABLE EXPLAINED:
    // Completely removes a table from the database
    // IF EXISTS prevents errors if table doesn't exist
    // Both databases' tables are dropped, so switching leaves nothing behind
    for (const table of [...DATASETS.shop.tables, ...DATASETS.school.tables]) {
        db.run(`DROP TABLE IF EXISTS ${table}`);
    }
    
    // ARROW FUNCTIONS EXPLAINED:
    // sql => db.run(sql) is a short way to write
    //     function (sql) { return db.run(sql); }
    // forEach calls it once for every item in the array, in order.
    dataset.create.forEach(sql => db.run(sql));
    
    // PREPARED STATEMENTS EXPLAINED:
    // The ? placeholders are filled in by the database engine, which
    // treats each value as data, never as part of the SQL command. Gluing
    // values into the SQL text yourself would let a value like
    //     '); DROP TABLE customer_tbl; --
    // become a command. That attack is called SQL injection.
    // (The playground deliberately runs whatever SQL you type: here,
    // that's the point.)
    //
    // OBJECT.ENTRIES EXPLAINED:
    // Turns { key: value, ... } into [[key, value], ...] so we can loop
    // over it: here each key is an INSERT and each value is its rows
    for (const [insertSql, rows] of Object.entries(dataset.rows)) {
        const statement = db.prepare(insertSql);
        rows.forEach(row => statement.run(row));
        // CLEANUP: free the memory the prepared statement used
        statement.free();
    }
}

/**
 * Switch to the other sample database. Starts it fresh.
 * 
 * @param {DatasetName} name
 * @returns {void}
 */
function setDataset(name) {
    currentDataset = name === 'school' ? 'school' : 'shop';
    
    // The page shows only the explanations and exercises for this
    // database: styles.css hides the rest using this attribute
    document.documentElement.setAttribute('data-dataset', currentDataset);
    
    try {
        localStorage.setItem(DATASET_KEY, currentDataset);
    } catch (error) {
        // Private browsing: the choice lasts until the page is closed
    }
    
    setQuery(DATASETS[currentDataset].defaultQuery);
    
    if (dbStatus === 'ready') {
        buildDatabase(currentDataset);
        updateStatus('ready', `${DATASETS[currentDataset].label} database ready. Try running a query.`);
        const resultsDiv = document.getElementById('query-results');
        if (resultsDiv) {
            resultsDiv.innerHTML = `<h4>Switched to the ${DATASETS[currentDataset].label.toLowerCase()} database</h4>`;
        }
    }
}

// Show the right explanations straight away, before the database loads
document.documentElement.setAttribute('data-dataset', currentDataset);

/**
 * Update the database status display
 * 
 * @param {DatabaseStatus} status - The status to display
 * @param {string} message - Status message
 * @returns {void}
 */
function updateStatus(status, message) {
    // DOM MANIPULATION EXPLAINED:
    // The DOM (Document Object Model) is the browser's live copy of the
    // HTML, which JavaScript can read and change. document.getElementById()
    // finds the element with that id; changing its className or innerHTML
    // changes what's on screen straight away.
    
    const statusDiv = document.getElementById('db-status');
    if (!statusDiv) return;
    
    // CONDITIONAL (TERNARY) OPERATOR EXPLAINED:
    // (Search word: TERNARY)
    // condition ? valueIfTrue : valueIfFalse
    // Shorthand for if-else statements
    const statusClass = status === 'ready' ? 'ready' : status === 'error' ? 'error' : '';
    
    statusDiv.className = `db-status ${statusClass}`;
    // innerHTML treats the text as HTML, so the message is escaped first
    // (see escapeHtml below for why)
    statusDiv.innerHTML = `<span class="status-indicator"></span> ${escapeHtml(message)}`;
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
    // map() builds a new array by running a function on every item:
    // here, each column name becomes '<th>name</th>'. join('') then glues
    // the array of strings into one long string, with nothing between.
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
 * Escape text so it can be put inside HTML safely
 * 
 * SECURITY EXPLAINED:
 * Anything put into innerHTML is read as HTML. If a result from the
 * database contained <img src=x onerror="...">, the browser would run
 * the code in it. That's called cross-site scripting (XSS).
 * 
 * The trick here: setting textContent stores the text as plain text,
 * and reading innerHTML back gives it with & < and > turned into
 * &amp; &lt; and &gt;, which the browser displays but never runs.
 * (Quotes aren't changed, so this is safe between tags, as it's used
 * here, but not inside an attribute's value.)
 * 
 * @param {string} text - Text to escape
 * @returns {string} - The same text, safe to put between HTML tags
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
        // Drop every table and rebuild the chosen sample database
        buildDatabase(currentDataset);
        
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
// addEventListener('something', fn) asks the browser to run fn every
// time "something" happens: a click, a key press, the page loading.

/**
 * Initialize when DOM is ready
 */
document.addEventListener('DOMContentLoaded', function() {
    // DOM CONTENT LOADED EXPLAINED:
    // Fires when HTML is parsed and DOM is built
    // Safe to access and manipulate HTML elements
    
    console.log('Page loaded. Initializing database...');
    initializeDatabase();
    
    // CHOOSE YOUR DATABASE:
    // The radio buttons at the top of Part 3 switch between the shop and
    // the school. Tick the one that matches the saved choice first.
    for (const radio of document.querySelectorAll('input[name="dataset"]')) {
        radio.checked = radio.value === currentDataset;
        radio.addEventListener('change', function() {
            if (radio.checked) setDataset(radio.value);
        });
    }
    setQuery(DATASETS[currentDataset].defaultQuery);
    
    // "LOAD IT INTO THE PLAYGROUND" BUTTONS:
    // Each answer's button keeps its query in a data-query attribute,
    // which JavaScript reads as button.dataset.query.
    //
    // EVENT DELEGATION:
    // Instead of one listener per button (there are dozens), one listener
    // on the whole document hears every click. closest() then checks
    // whether the click landed on, or inside, one of those buttons.
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
// window is the browser's global object: anything on it can be used from
// anywhere, including onclick="..." attributes in the HTML.
//
// Functions declared at the top level of an ordinary script like this
// one are already on window, so these lines don't change anything. They
// are here to say out loud which functions the HTML relies on. The other
// three scripts (appearance.js, code-lab.js, page-nav.js) do the opposite:
// they wrap themselves in an IIFE so that nothing leaks out.

window.executeQuery = executeQuery;
window.setQuery = setQuery;
window.clearQuery = clearQuery;
window.resetDatabase = resetDatabase;
window.showTables = showTables;
window.setDataset = setDataset;
