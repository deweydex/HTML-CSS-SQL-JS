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
 * @typedef {Object} Student
 * @property {number} id - Unique student identifier
 * @property {string} name - Student's full name
 * @property {number} age - Student's age
 * @property {number} grade - Student's grade (0-100)
 */

/**
 * @typedef {Object} Course
 * @property {number} id - Unique course identifier
 * @property {string} name - Course name
 * @property {string} instructor - Instructor's name
 * @property {number} credits - Number of credits
 */

/**
 * @typedef {Object} Enrolment
 * @property {number} id - Unique enrolment identifier
 * @property {number} student_id - Points at a row in students
 * @property {number} course_id - Points at a row in courses
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
 * Create the students, courses and enrolments tables
 * 
 * @returns {void}
 */
function createTables() {
    // SQL CREATE TABLE EXPLAINED:
    // - Creates a new table in the database
    // - Defines column names and data types
    // - PRIMARY KEY: Unique identifier for each row
    // - NOT NULL: Column cannot be empty
    
    const createStudentsTable = `
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            age INTEGER NOT NULL,
            grade INTEGER NOT NULL
        );
    `;
    
    const createCoursesTable = `
        CREATE TABLE IF NOT EXISTS courses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            instructor TEXT NOT NULL,
            credits INTEGER NOT NULL
        );
    `;
    
    // FOREIGN KEYS EXPLAINED:
    // student_id and course_id hold the id of a row in another table.
    // REFERENCES records which table and column they point at. That link
    // is what a JOIN follows to put a name back next to each number.
    const createEnrolmentsTable = `
        CREATE TABLE IF NOT EXISTS enrolments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER NOT NULL REFERENCES students(id),
            course_id INTEGER NOT NULL REFERENCES courses(id)
        );
    `;
    
    // TEMPLATE LITERALS EXPLAINED:
    // Backticks (`) allow multi-line strings and string interpolation
    // Example: `Hello ${name}` - embeds variables in strings
    
    // Execute the CREATE TABLE statements
    db.run(createStudentsTable);
    db.run(createCoursesTable);
    db.run(createEnrolmentsTable);
}

/**
 * Populate tables with sample data
 * 
 * @returns {void}
 */
function populateSampleData() {
    // ARRAY OF OBJECTS EXPLAINED:
    // Each object represents one row in the database
    // Keys are column names, values are the data
    
    /** @type {Array<{name: string, age: number, grade: number}>} */
    const students = [
        { name: 'Alice Johnson', age: 20, grade: 88 },
        { name: 'Bob Smith', age: 19, grade: 92 },
        { name: 'Carol Williams', age: 21, grade: 76 },
        { name: 'David Brown', age: 20, grade: 85 },
        { name: 'Eve Davis', age: 22, grade: 91 },
        { name: 'Frank Miller', age: 19, grade: 73 },
        { name: 'Grace Wilson', age: 21, grade: 89 },
        { name: 'Henry Moore', age: 20, grade: 94 }
    ];
    
    /** @type {Array<{name: string, instructor: string, credits: number}>} */
    const courses = [
        { name: 'Introduction to Programming', instructor: 'Dr. Smith', credits: 4 },
        { name: 'Data Structures', instructor: 'Prof. Johnson', credits: 3 },
        { name: 'Web Development', instructor: 'Dr. Lee', credits: 3 },
        { name: 'Database Systems', instructor: 'Prof. Garcia', credits: 4 },
        { name: 'Computer Networks', instructor: 'Dr. Martinez', credits: 3 }
    ];
    
    // [student_id, course_id] pairs: who takes what.
    // Frank Miller (id 6) takes nothing, which Exercise 13 goes looking for.
    /** @type {Array<[number, number]>} */
    const enrolments = [
        [1, 1], [1, 3],   // Alice: Intro to Programming, Web Development
        [2, 1], [2, 2],   // Bob: Intro to Programming, Data Structures
        [3, 3],           // Carol: Web Development
        [4, 2], [4, 4],   // David: Data Structures, Database Systems
        [5, 4], [5, 5],   // Eve: Database Systems, Computer Networks
        [7, 1], [7, 5],   // Grace: Intro to Programming, Computer Networks
        [8, 3], [8, 4]    // Henry: Web Development, Database Systems
    ];
    
    // PREPARED STATEMENTS EXPLAINED:
    // The ? placeholders prevent SQL injection attacks
    // Values are safely inserted by the database engine
    const studentStmt = db.prepare('INSERT INTO students (name, age, grade) VALUES (?, ?, ?)');
    const courseStmt = db.prepare('INSERT INTO courses (name, instructor, credits) VALUES (?, ?, ?)');
    const enrolmentStmt = db.prepare('INSERT INTO enrolments (student_id, course_id) VALUES (?, ?)');
    
    // FOREACH EXPLAINED:
    // Loops through each item in the array
    // student => {...} is an arrow function
    // Arrow functions are shorthand for function(student) {...}
    students.forEach(student => {
        studentStmt.run([student.name, student.age, student.grade]);
    });
    
    courses.forEach(course => {
        courseStmt.run([course.name, course.instructor, course.credits]);
    });
    
    enrolments.forEach(pair => {
        enrolmentStmt.run(pair);
    });
    
    // CLEANUP:
    // Free memory used by prepared statements
    studentStmt.free();
    courseStmt.free();
    enrolmentStmt.free();
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
        // EXEC EXPLAINED:
        // Executes the SQL query and returns results
        // Returns an array of result objects
        const results = db.exec(query);
        
        // ROWS MODIFIED:
        // How many rows the last INSERT, UPDATE or DELETE changed
        const rowsChanged = db.getRowsModified();
        
        // CONDITIONAL EXECUTION:
        // Different display based on query type
        if (results.length === 0) {
            // Query succeeded but returned no data (INSERT, UPDATE, DELETE)
            const detail = rowsChanged > 0
                ? `${rowsChanged} row${rowsChanged === 1 ? '' : 's'} changed.`
                : '(No data to display)';
            displaySuccess(`Query executed successfully! ${detail}`);
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
        <h4>Success!</h4>
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
        db.run('DROP TABLE IF EXISTS students');
        db.run('DROP TABLE IF EXISTS courses');
        db.run('DROP TABLE IF EXISTS enrolments');
        
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
            queryInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
// ✅ COUNT and aggregate functions
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
