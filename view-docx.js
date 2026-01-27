const mammoth = require("mammoth");
const fs = require("fs");
const path = require("path");

async function viewDocx(filePath) {
  // Resolve path (handles relative paths)
  const resolvedPath = path.resolve(filePath);

  // Check if file exists
  if (!fs.existsSync(resolvedPath)) {
    console.error(`\nError: File not found: ${resolvedPath}\n`);
    process.exit(1);
  }

  // Check if it's a .docx file
  if (!resolvedPath.toLowerCase().endsWith(".docx")) {
    console.error(`\nError: File must be a .docx file\n`);
    process.exit(1);
  }

  try {
    // Extract text from docx
    const result = await mammoth.extractRawText({ path: resolvedPath });
    const text = result.value;

    // Get filename for header
    const filename = path.basename(resolvedPath);

    // Print header
    console.log("\n" + "═".repeat(70));
    console.log(`  ${filename}`);
    console.log("═".repeat(70) + "\n");

    // Print content
    if (text.trim()) {
      console.log(text);
    } else {
      console.log("(Document is empty or contains no extractable text)");
    }

    console.log("\n" + "═".repeat(70) + "\n");

    // Show any warnings
    if (result.messages.length > 0) {
      console.log("Warnings:");
      result.messages.forEach((msg) => console.log(`  - ${msg.message}`));
      console.log("");
    }
  } catch (error) {
    console.error(`\nError reading file: ${error.message}\n`);
    process.exit(1);
  }
}

// Get file path from command line arguments
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log(`
Usage: node view-docx.js <path-to-docx-file>

Examples:
  node view-docx.js 00-radar/radar-list.docx
  node view-docx.js "02-active/nomad-research-template-blank.docx"
`);
  process.exit(0);
}

viewDocx(args[0]);
