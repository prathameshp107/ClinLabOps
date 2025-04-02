const fs = require('fs');
const path = require('path');

// Function to find all dynamic routes in the app directory
function findDynamicRoutes(dir, routes = []) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Check if this is a dynamic route directory (starts with [)
      if (file.startsWith('[') && file.endsWith(']')) {
        routes.push(filePath);
      }
      // Recursively check subdirectories
      findDynamicRoutes(filePath, routes);
    }
  }
  
  return routes;
}

// Function to check if a layout file exists with generateStaticParams
function checkLayoutFile(routePath) {
  const layoutPath = path.join(routePath, 'layout.jsx');
  const layoutTsPath = path.join(routePath, 'layout.tsx');
  
  if (fs.existsSync(layoutPath) || fs.existsSync(layoutTsPath)) {
    const layoutFile = fs.existsSync(layoutPath) ? layoutPath : layoutTsPath;
    const content = fs.readFileSync(layoutFile, 'utf8');
    
    if (!content.includes('generateStaticParams')) {
      console.warn(`⚠️ Layout file exists but missing generateStaticParams: ${layoutFile}`);
      return false;
    }
    return true;
  }
  
  return false;
}

// Main function
function main() {
  const appDir = path.join(__dirname, '..', 'src', 'app');
  const dynamicRoutes = findDynamicRoutes(appDir);
  
  console.log(`Found ${dynamicRoutes.length} dynamic routes:`);
  
  let missingLayouts = 0;
  
  for (const route of dynamicRoutes) {
    const relativePath = path.relative(appDir, route);
    console.log(`- /${relativePath}`);
    
    if (!checkLayoutFile(route)) {
      console.error(`❌ Missing layout file with generateStaticParams: /${relativePath}`);
      missingLayouts++;
    } else {
      console.log(`✅ Layout file with generateStaticParams exists: /${relativePath}`);
    }
  }
  
  if (missingLayouts > 0) {
    console.error(`\n❌ Found ${missingLayouts} routes missing proper layout files.`);
    process.exit(1);
  } else {
    console.log('\n✅ All dynamic routes have proper layout files with generateStaticParams.');
  }
}

main();