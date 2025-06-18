const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

// Configuration for import path updates
const importUpdates = [
  {
    // Old: @/components/dashboard/dashboard-layout
    // New: @/components/dashboard/layout/dashboard-layout
    pattern: /@\/components\/dashboard\/([^'"`\s]*)(?<!\.jsx?)(?!\/)/g,
    replacement: (match, p1) => {
      const component = p1;
      const mappings = {
        'dashboard-layout': 'layout/dashboard-layout',
        'modern-sidebar': 'layout/modern-sidebar',
        'task-management': 'tasks/task-management',
        'task-heatmap': 'tasks/task-heatmap',
        'project-management': 'projects/project-management',
        'user-management': 'users/user-management',
        'user-activity': 'users/user-activity',
        'experiment-tracker': 'experiments/experiment-tracker',
        'experiment-progress': 'experiments/experiment-progress',
        'system-logs': 'equipment/system-logs',
        'compliance-alerts': 'inventory/compliance-alerts',
        'stats-card': 'shared/stats-card',
        'quick-actions': 'shared/quick-actions',
        'notification-center': 'shared/notification-center',
        'pending-approvals': 'shared/pending-approvals',
        'smart-insights': 'shared/smart-insights'
      };
      
      if (mappings[component]) {
        return `@/components/dashboard/${mappings[component]}`;
      }
      return match;
    }
  }
];

// Find all JSX/TSX files in the project
async function findFiles(dir, filePattern = /\.(jsx|tsx|js|ts)$/) {
  const files = [];
  const items = await fs.readdir(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    
    // Skip node_modules and .next directories
    if (item.isDirectory() && 
        (item.name === 'node_modules' || item.name === '.next')) {
      continue;
    }
    
    if (item.isDirectory()) {
      files.push(...(await findFiles(fullPath, filePattern)));
    } else if (filePattern.test(item.name)) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Update imports in a file
async function updateFileImports(filePath) {
  try {
    let content = await fs.readFile(filePath, 'utf8');
    let updated = false;
    
    for (const { pattern, replacement } of importUpdates) {
      const newContent = content.replace(pattern, replacement);
      if (newContent !== content) {
        updated = true;
        content = newContent;
      }
    }
    
    if (updated) {
      await fs.writeFile(filePath, content, 'utf8');
      console.log(`✅ Updated imports in: ${path.relative(process.cwd(), filePath)}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
    return false;
  }
}

// Main function
async function main() {
  console.log('🔍 Finding files to update...');
  const files = await findFiles(path.join(process.cwd(), 'src'));
  console.log(`📂 Found ${files.length} files to check`);
  
  let updatedCount = 0;
  
  for (const file of files) {
    const updated = await updateFileImports(file);
    if (updated) updatedCount++;
  }
  
  console.log(`\n✨ Import update complete!`);
  console.log(`✅ Updated ${updatedCount} files`);
  
  // Run Prettier to format the updated files
  console.log('\n🔄 Formatting updated files with Prettier...');
  try {
    execSync('npx prettier --write "src/**/*.{js,jsx,ts,tsx}"', { stdio: 'inherit' });
    console.log('✨ Formatting complete!');
  } catch (error) {
    console.warn('⚠️  Could not run Prettier. Make sure it is installed.');
  }
}

// Run the script
main().catch(console.error);
