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
        
        updateStatus('loading', 'Initializing database...');
        
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
 * Create the students and courses tables
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
    
    // TEMPLATE LITERALS EXPLAINED:
    // Backticks (`) allow multi-line strings and string interpolation
    // Example: `Hello ${name}` - embeds variables in strings
    
    // Execute the CREATE TABLE statements
    db.run(createStudentsTable);
    db.run(createCoursesTable);
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
    
    // PREPARED STATEMENTS EXPLAINED:
    // The ? placeholders prevent SQL injection attacks
    // Values are safely inserted by the database engine
    const studentStmt = db.prepare('INSERT INTO students (name, age, grade) VALUES (?, ?, ?)');
    const courseStmt = db.prepare('INSERT INTO courses (name, instructor, credits) VALUES (?, ?, ?)');
    
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
    
    // CLEANUP:
    // Free memory used by prepared statements
    studentStmt.free();
    courseStmt.free();
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
