const fs = require('fs-extra');
const path = require('path');
const { marked } = require('marked');

// Paths
const notesDir = path.join(__dirname, 'notes');
const outputDir = path.join(__dirname, 'output');
const outputFile = path.join(outputDir, 'index.html');

const convertMarkdownToHtml = (markdown) => {
    return marked(markdown);
};

// Function to read markdown files and convert them to HTML
async function makeIndexPage() {
  try {
    // Ensure the output directory exists
    await fs.ensureDir(outputDir);

    // Read all markdown files from the notes directory
    const files = await fs.readdir(notesDir);
    const markdownFiles = files.filter(file => file.endsWith('.md'));

    // Convert markdown files to HTML
    let htmlContent = '<!DOCTYPE html><html><head><title>Notes</title><link rel="stylesheet" href="styles.css"></head><body>';
    for (const file of markdownFiles) {
      const filePath = path.join(notesDir, file);
      const markdown = await fs.readFile(filePath, 'utf-8');
      const html = convertMarkdownToHtml(markdown);
      htmlContent += `<div class="note">${html}</div>`;
    }
    htmlContent += '</body></html>';

    // Write the HTML content to the output file
    await fs.writeFile(outputFile, htmlContent, 'utf-8');

    console.log('Conversion complete. Check the output folder for the output.');
  } catch (error) {
    console.error('Error converting markdown to HTML:', error);
  }
}

// Run the conversion
makeIndexPage();
