# HTML, CSS & SQL Interactive Tutorial

An interactive, browser-based tutorial for teaching web development fundamentals and SQL database querying. Students can learn HTML structure, CSS styling, and SQL queries all in one place, with live code examples and a fully functional SQL playground powered by SQL.js.

## Features

- **Interactive SQL Playground**: Run real SQL queries in the browser (no server needed!)
- **Comprehensive Coverage**: HTML basics, CSS styling, and SQL fundamentals
- **Hands-on Learning**: Students can experiment and see results immediately
- **Teacher Version**: Includes complete solutions and teaching notes
- **Appearance Panel**: Each reader can pick light or dark, a font (including Lexend and OpenDyslexic), text size, page width, high contrast and reduced motion; choices are remembered in their browser
- **Mobile Responsive**: Works on all devices
- **No Installation Required**: Runs entirely in the browser

## Files Included

```
sql-tutorial-site/
├── index.html          # Main student tutorial page
├── teacher.html        # Teacher version with solutions
├── styles.css          # Stylesheet for both pages (colours live in CSS variables at the top)
├── tutorial.js         # JavaScript for SQL functionality
├── appearance.js       # The Appearance panel (theme, font, size, contrast)
├── fonts/              # Lexend and OpenDyslexic, self-hosted (SIL Open Font Licence)
└── README.md          # This file
```

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
   - the `fonts` folder
   - `README.md` (optional - there's already one)
3. Scroll down and click **"Commit changes"**

#### Option B: Using Git (If you're familiar with it)

```bash
# Clone your repository
git clone https://github.com/YOUR-USERNAME/sql-tutorial.git
cd sql-tutorial

# Copy the tutorial files into this directory
# (copy index.html, styles.css, tutorial.js, appearance.js and fonts/ here)

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
- All other files (`styles.css`, `tutorial.js`, `appearance.js`, `teacher.html`) and the `fonts` folder must be in the same directory
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

**SQL:**
- SELECT queries with WHERE clauses
- ORDER BY sorting
- INSERT, UPDATE, DELETE operations
- Aggregate functions (COUNT, AVG, etc.)

### Teaching Tips

1. **Start Simple**: Have students run the example queries first
2. **Encourage Experimentation**: Breaking things is part of learning
3. **Use DevTools**: Teach students to press F12 to see the console
4. **Check Solutions**: All answers are in `teacher.html`
5. **Reset Database**: Students can reset to original data anytime

### Sample Database

The tutorial includes two tables:

**Students Table:**
- id, name, age, grade
- 8 sample students

**Courses Table:**
- id, name, instructor, credits
- 6 sample courses

---

## Customization

### Adding More Exercises

Edit `index.html` and add to the exercises section:

```html
<div class="exercise">
    <h4>Exercise X: Your Title</h4>
    <p>Your question here</p>
    <details>
        <summary>Show Hint</summary>
        <p>Your hint here</p>
    </details>
</div>
```

### Changing the Database

Edit `tutorial.js` - look for the `initializeDatabase()` function:

```javascript
// Add more sample data
db.run(`
    INSERT INTO students (name, age, grade) VALUES
        ('New Student', 20, 88.0);
`);

// Create new tables
db.run(`
    CREATE TABLE your_table (
        id INTEGER PRIMARY KEY,
        column1 TEXT
    );
`);
```

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
- Review the `teacher.html` file for all solutions
- The teaching notes section has helpful tips
- Check the assessment rubric for grading guidance

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
