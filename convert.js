const fs = require('fs-extra');
const path = require('path');
const { marked } = require('marked');
const matter = require('gray-matter');

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
      const relativePath = path.relative(__dirname, filePath);
      const fileContent = await fs.readFile(filePath, 'utf-8');
      
      // Parse the frontmatter and content using gray-matter
      const { content, data } = matter(fileContent);
      
      // Optionally, use the frontmatter (data) here
      // For example, include the title in the HTML
      const title = data.title ? `<a href="${relativePath.replace('.md', '.html')}">${data.title}</a>` : '';

      // Convert the Markdown content to HTML using Marked
      const html = convertMarkdownToHtml(content);
      
      // Append the HTML content to the main HTML
      htmlContent += `<div class="note">${title}${html}</div>`;

      // use filesystem write to write the html content to a file
      const singlePagePath = path.join(outputDir, relativePath.replace('.md', '.html'));
      
      // makedir if not exists
      await fs.ensureDir(path.dirname(singlePagePath));

      // write the html content to the file
      await fs.writeFile(singlePagePath, htmlContent, 'utf-8');
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
