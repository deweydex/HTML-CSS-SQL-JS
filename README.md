# HTML, CSS & SQL Interactive Tutorial

An interactive, browser-based tutorial for teaching web development fundamentals and SQL database querying. Students can learn HTML structure, CSS styling, and SQL queries all in one place, with live code examples and a fully functional SQL playground powered by SQL.js.

## Features

- **Interactive SQL Playground**: Run real SQL queries in the browser (no server needed!)
- **Comprehensive Coverage**: HTML basics, CSS styling, and SQL fundamentals
- **Hands-on Learning**: Students can experiment and see results immediately
- **Hints and Answers**: Every exercise has a hint first, then an answer that can be loaded straight into the editor
- **Appearance Panel**: Each reader can pick light or dark, a font (including Lexend and OpenDyslexic), text size, page width, high contrast and reduced motion; choices are remembered in their browser
- **Made for Laptops and Desktops**: On a wide screen each editor stays beside its exercises; on smaller screens the page still works, stacked
- **No Installation Required**: Runs entirely in the browser

## Files Included

```
sql-tutorial-site/
├── index.html          # Main student tutorial page
├── styles.css          # All the styling (colours live in CSS variables at the top)
├── tutorial.js         # JavaScript for SQL functionality
├── appearance.js       # The Appearance panel (theme, font, size, contrast)
├── code-lab.js         # The live HTML/CSS editors in Parts 1 and 2
├── page-nav.js         # The bar at the top: highlights the part you're reading
├── fonts/              # Lexend and OpenDyslexic, self-hosted (SIL Open Font Licence)
└── README.md          # This file
```

## Learning from the Code

The code is written to be read. Every file opens with a comment saying what it does and which ideas it shows, and comments point out each HTML, CSS, JavaScript or SQL idea the first time the code uses it. You can read the files here on GitHub (click any file above), or open the tutorial and use your browser's **View Page Source** (Ctrl+U, or ⌘+Option+U on a Mac).

A good order to read them in:

1. **`index.html`**: the page itself. Every tag Part 1 teaches, used for real: semantic elements, forms and labels, `<details>`, `data-` attributes, an `<iframe>`, and an SVG diagram written as code.
2. **`styles.css`**: how the page looks. Starts with CSS variables, the idea behind the light and dark themes, then works through selectors, the box model, flexbox and grid, `position: sticky`, media queries and animation. Its opening comment lists where each idea is.
3. **`page-nav.js`**: the shortest script. A good first JavaScript file: events, measuring elements on screen, and `aria-current`.
4. **`appearance.js`**: saving settings in the browser with `localStorage` and JSON, and changing CSS variables from JavaScript.
5. **`code-lab.js`**: the live editors. Iframes, debouncing and closures.
6. **`tutorial.js`**: the SQL playground and the sample databases. The biggest file, so it starts with an index: search for a word like `ASYNC/AWAIT EXPLAINED` to jump to where that idea is explained and used.

A useful habit: change something small, reload the page, and see what happens. Nothing you change on your own computer can break the tutorial for anyone else.

## Quick Start (Local Testing)

1. Download all files to a folder
2. Open `index.html` in any modern web browser
3. Start learning!

Students don't need to install anything - it runs completely in the browser using SQL.js (SQLite compiled to JavaScript).

---

## 🌐 Deploying on GitHub Pages 

Follow these steps to host the tutorial online so students can access it via a link:

### Step 1: Create a GitHub Account (if you don't have one)

1. Go to [github.com](https://github.com)
2. Click "Sign up" and create a free account

### Step 2: Create a New Repository

1. Once logged in, click the **"+"** icon in the top right
2. Select **"New repository"**
3. Fill in the details:
   - **Repository name**: `sql-tutorial` (or any name you prefer)
   - **Description**: "Interactive HTML, CSS & SQL Tutorial"
   - Make it **Public** (required for free GitHub Pages)
   - Check "Add a README file"
4. Click **"Create repository"**

### Step 3: Upload Your Files

#### Option A: Upload via Web Interface (Easiest)

1. On your repository page, click **"Add file"** → **"Upload files"**
2. Drag and drop these files:
   - `index.html`
   - `styles.css`
   - `tutorial.js`
   - `appearance.js`
   - `code-lab.js`
   - `page-nav.js`
   - the `fonts` folder
   - `README.md` (optional - there's already one)
3. Scroll down and click **"Commit changes"**

#### Option B: Using Git (If you're familiar with it)

```bash
# Clone your repository
git clone https://github.com/YOUR-USERNAME/sql-tutorial.git
cd sql-tutorial

# Copy the tutorial files into this directory
# (copy index.html, styles.css, tutorial.js, appearance.js, code-lab.js, page-nav.js and fonts/ here)

# Add and commit
git add .
git commit -m "Add SQL tutorial files"
git push origin main
```

### Step 4: Enable GitHub Pages

1. In your repository, click **"Settings"** (top right)
2. In the left sidebar, click **"Pages"**
3. Under **"Source"**, select:
   - Branch: **main** (or master)
   - Folder: **/ (root)**
4. Click **"Save"**

### Step 5: Access Your Tutorial

After a few minutes, your site will be live at:

```
https://YOUR-USERNAME.github.io/sql-tutorial/
```

For example: `https://johndoe.github.io/sql-tutorial/`


---

## Important Notes for GitHub Pages

### File Names Matter!
- Keep the file named `index.html` (this is the default page GitHub Pages serves)
- All other files (`styles.css`, `tutorial.js`, `appearance.js`, `code-lab.js`, `page-nav.js`) and the `fonts` folder must be in the same directory
- File names are case-sensitive!

### HTTPS is Automatic
- GitHub Pages serves everything over HTTPS automatically
- Students can safely access the tutorial from any device

### No Backend Required
- This tutorial runs entirely in the browser using SQL.js
- No database server needed
- SQL.js is loaded from a CDN (Content Delivery Network)

### Updates Are Easy
1. Edit your files locally
2. Upload them to GitHub (same process as Step 3)
3. Changes appear on your site within minutes

---

## For Teachers (Students, you are welcome to read further but it won't really apply to you!)

### What Students Will Learn

**HTML:**
- Document structure and basic tags
- Forms and input elements
- Semantic HTML

**CSS:**
- Selectors and properties
- Box model
- Basic styling and layout
- CSS variables (through the Appearance panel)

**SQL:**
- SELECT queries with WHERE clauses, AND and OR
- ORDER BY sorting
- INSERT, UPDATE, DELETE operations
- COUNT, SUM, AVG and ROUND, and arithmetic in a SELECT
- Primary keys, foreign keys, JOIN and LEFT JOIN

### Teaching Tips

1. **Start Simple**: Have students run the example queries first
2. **Encourage Experimentation**: Breaking things is part of learning
3. **Use DevTools**: Teach students to press F12 to see the console
4. **Answers on the Page**: Every exercise has a hint, then a "Show answer" button, so students can check their own work
5. **Reset Database**: Students can reset to original data anytime

### Sample Database

Part 3 lets each student choose between two sample databases, a shop or a school. The explanations, diagram and all 13 exercises switch with the choice, and the exercises teach the same thing in both, so a class can mix choices. Both follow three naming conventions: every table name ends in `_tbl`, every table's id is named after it (`product_tbl` has `product_id`), and foreign keys sit at the bottom of the table with the same name as the id they point at.

**The shop:**
- `customer_tbl`: customer_id, customer_name, county (8 customers)
- `product_tbl`: product_id, product_name, category, price, stock (6 products; the headphones are out of stock and nobody has ordered them)
- `order_tbl`: order_id, order_date, quantity, customer_id, product_id (12 orders, each one line on a receipt; quantity gives students something to think about: items sold versus orders placed, price × quantity)

**The school:**
- `student_tbl`: student_id, student_name, county (the same 8 people)
- `module_tbl`: module_id, module_name, department, credits, hours (6 modules; Robotics has 0 hours and no results)
- `result_tbl`: result_id, exam_date, mark, student_id, module_id (12 exam results, marked out of 100)

The names come from many backgrounds so every class can see itself in the examples.

---

## Customization

### Adding More Exercises

Each exercise in `index.html` has a hint, then an answer with a button that loads it into the playground. Copy an existing one and change it:

```html
<div class="exercise">
    <h4>SQL exercise 14: Your title</h4>
    <p>Your question here</p>
    <details class="hint">
        <summary>Show hint</summary>
        <p>Your hint here</p>
    </details>
    <details class="answer">
        <summary>Show answer</summary>
        <pre><code>SELECT * FROM product_tbl;</code></pre>
        <p>What the student should see</p>
        <button type="button" class="try-answer" data-query="SELECT * FROM product_tbl;">Load it into the playground</button>
    </details>
</div>
```

Part 3 is written twice, once for each database. Put a shop exercise inside the list marked `data-for-dataset="shop"` and a school one inside `data-for-dataset="school"`. HTML and CSS exercises use `class="load-into-lab"` buttons instead; copy one from Part 1 or 2.

### Changing the Database

Both sample databases are in `tutorial.js`, in the object called `DATASETS`. Each has its `CREATE TABLE` statements (`create`) and its rows (`rows`). Add a row to one of the lists, or a column to a `CREATE TABLE` and a matching value to every row. If you change what a query returns, update the answers in `index.html` to match.

### Styling Changes

Edit `styles.css` to change colors, fonts, or layout.

---

## Troubleshooting

### "Database not loading"
- Make sure you're using a modern browser (Chrome, Firefox, Edge, Safari)
- Check your internet connection (SQL.js loads from CDN)
- Try hard-refreshing the page (Ctrl+Shift+R or Cmd+Shift+R)

### "Page not found on GitHub"
- Wait 5-10 minutes after enabling GitHub Pages
- Check that the repository is Public
- Verify the file is named `index.html` (case-sensitive!)

### "Styles not working"
- Make sure `styles.css` is in the same folder as `index.html`
- Check for typos in the file name
- Try clearing your browser cache

### "SQL queries not running"
- SQL.js requires an internet connection to load initially
- Make sure JavaScript is enabled in your browser
- Check the browser console (F12) for error messages

---

## Browser Compatibility

Works on all modern browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Mobile browsers:
- iOS Safari
- Chrome for Android

---

## 📄 License

This tutorial is free to use for educational purposes. Feel free to:
- Share with students
- Modify for your curriculum
- Use in online or in-person classes
- Please cite Jsaaron.com and Joshua Aaron as the Author

---

## Support

### For Teachers:
- Every exercise's answer is on the page itself, under its hint
- The earlier teacher version (teaching notes, common errors, marking rubric) is in this repository's history if you want it back

### For Students:
- Read error messages carefully - they tell you what's wrong
- Try the example queries before writing your own
- Use the "Reset Database" button if you get stuck
- Practice makes perfect!

---

## Credits

- **SQL.js**: SQLite compiled to JavaScript via Emscripten
- **SQL Tutorial Database**: Sample data designed for learning
- Built with vanilla HTML, CSS, and JavaScript

---

## Questions?

If you have questions about deployment:
1. Check GitHub's official Pages documentation
2. Search for "GitHub Pages tutorial" on YouTube
3. Ask in the GitHub Community Forum

---

**Happy Teaching! 🎓**
