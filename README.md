# Simple Plagiarism Checker

A basic plagiarism checker implemented using HTML, CSS, and JavaScript. This web app reads a reference text file (db.txt) and compares it against the input provided by the user.
It calculates a basic similarity percentage using cosine similarity logic, and displays the result dynamically on the web page—no server-side backend required.
---

## Table of Contents

- [Key Highlights](#key-highlights)
- [System Requirements](#system-requirements)
- [Setup Instructions](#setup-instructions)
- [Directory Layout](#directory-layout)
- [Using It](#using-it)
- [How this program works](#how-this-program-works)
- [Extending and Customizing](#extending-and-customizing)

---
## Key Highlights

- Simple and intuitive web UI using plain HTML/CSS.
- Cosine similarity-based text matching using JavaScript.
- Reference text (db.txt) compared with live user input.
- Dynamic display of similarity percentage—no page reload.
- No backend required: fully client-side.

---

## System Requirements

- A modern web browser (Chrome, Firefox, Edge, etc.)
- No installations or dependencies required.

---
## Setup Instructions

1. Download the repository or files.
2. Ensure the following files are in the same directory:
```
project-folder/
├── db.txt
├── plag.js
├── plag_web.html
└── style.css
```
3. Simply double-click plag_web.html to launch the app in your default browser.

---

## Directory Layout
```
project-folder/
│
├── plag_web.html      # Main HTML file for UI
├── style.css          # Styling for UI elements
├── plag.js            # JS logic for similarity detection
└── db.txt             # Reference text file used for comparison
```

## Using It

- Open plag_web.html in your web browser.
- Type or paste your input text in the provided text area.
- Click the "Check Plagiarism" button.
- The system will read the reference text from db.txt, compute cosine similarity, and display the match percentage on the screen.

## How this Program Works

1. Reading the Reference File
 - The JavaScript fetches the contents of db.txt using the fetch() API.

2. Tokenization & Normalization
 - Both user input and reference text are converted to lowercase, punctuation removed, and split into word lists.

3.Term Frequency Vectors
 - JavaScript builds frequency vectors for both the input and reference text, counting occurrences of each word.

4.Cosine Similarity Calculation
 - Calculates the dot product and magnitude of both vectors.
 - Uses the formula:
  ```
    cosine_similarity = (dot_product) / (|vec1| * |vec2|)
  ```
 - Multiplies the result by 100 to get a percentage.

5. Result Display
 - The result is shown in the HTML dynamically without page reload using DOM manipulation.

---

## Extending and Customizing

1. Multiple Reference Files
 - Enhance the app to support comparing against several txt files or options via dropdowns.

2. File Upload for Reference
 - Allow users to upload their own .txt files for both input and reference.

3. Use Web Workers
 - Offload cosine similarity computation for large inputs using Web Workers to avoid UI freezing.

 4. Add Stopword Removal
 - Improve matching accuracy by removing common stopwords (like “the”, “is”, “and”).

5. UI Enhancements
 - Integrate Bootstrap or Tailwind CSS for more responsive and modern styling.

6. Save History in Local Storage
 - Store and show past comparisons using localStorage for user reference.

---

Built with ❤️ using pure HTML, CSS, and JavaScript — no frameworks, no servers, just browser magic!
