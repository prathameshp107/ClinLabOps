const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

async function* walk(dir) {
  const files = await readdir(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stats = await stat(filePath);
    
    if (stats.isDirectory()) {
      yield* walk(filePath);
    } else if (stats.isFile() && file.endsWith('.tsx')) {
      yield filePath;
    }
  }
}

async function convertFile(filePath) {
  try {
    console.log(`Converting ${filePath}...`);
    
    // Read the file content
    const content = await readFile(filePath, 'utf8');
    
    // Remove TypeScript-specific syntax
    let jsContent = content
      // Remove type annotations from function parameters
      .replace(/:\s*[\w\[\]{}|<>]+(?=\s*[),])/g, '')
      // Remove type assertions (angle bracket and as syntax)
      .replace(/<[\w\s,{}[\]<>]+>(?=\s*[\w({\[])/g, '')
      .replace(/\s+as\s+[\w\s,{}[\]<>|&]+/g, '')
      // Remove interface and type declarations
      .replace(/\b(interface|type)\s+\w+\s*({[^}]*}|\s*=\s*[^;\n]+);?/g, '')
      // Remove import type statements
      .replace(/import\s+type\s+{[^}]*}\s+from\s+['"][^'"]+['"];?\n?/g, '')
      // Remove type parameters from function declarations
      .replace(/<[\w\s,]+>(?=\s*\()/g, '')
      // Remove readonly modifiers
      .replace(/\breadonly\s+/g, '')
      // Remove declare keywords
      .replace(/\bdeclare\s+/g, '')
      // Remove empty lines with only whitespace
      .replace(/^\s*\n/gm, '');

    // Create the new file path with .jsx extension
    const newFilePath = filePath.replace(/\.tsx$/, '.jsx');
    
    // Write the converted content to the new file
    await writeFile(newFilePath, jsContent, 'utf8');
    console.log(`Created ${newFilePath}`);
    
    // Delete the original .tsx file
    await unlink(filePath);
    console.log(`Deleted ${filePath}`);
    
    return { success: true, filePath, newFilePath };
  } catch (error) {
    console.error(`Error converting ${filePath}:`, error);
    return { success: false, filePath, error };
  }
}

async function main() {
  try {
    const rootDir = path.join(__dirname, '..', 'src');
    const results = [];
    
    console.log('Starting TypeScript to JavaScript conversion...');
    
    // Process all .tsx files in the src directory
    for await (const filePath of walk(rootDir)) {
      const result = await convertFile(filePath);
      results.push(result);
    }
    
    // Summary
    const successCount = results.filter(r => r.success).length;
    const errorCount = results.length - successCount;
    
    console.log('\nConversion complete!');
    console.log(`✅ Successfully converted ${successCount} files`);
    console.log(`❌ Failed to convert ${errorCount} files`);
    
    // List failed conversions if any
    if (errorCount > 0) {
      console.log('\nFailed conversions:');
      results
        .filter(r => !r.success)
        .forEach((r, i) => console.log(`${i + 1}. ${r.filePath}: ${r.error.message}`));
    }
  } catch (error) {
    console.error('An error occurred during conversion:', error);
    process.exit(1);
  }
}

// Run the script
main();
