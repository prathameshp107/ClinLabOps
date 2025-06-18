const fs = require('fs').promises;
const path = require('path');

// Configuration for file moves
const moves = [
  // Move notification-center.jsx to shared
  {
    from: path.join('src', 'components', 'dashboard', 'notification-center.jsx'),
    to: path.join('src', 'components', 'dashboard', 'shared', 'notification-center.jsx')
  },
  // Move experiment-related files
  {
    from: path.join('src', 'components', 'dashboard', 'experiment-tracker.jsx'),
    to: path.join('src', 'components', 'dashboard', 'experiments', 'experiment-tracker.jsx')
  },
  {
    from: path.join('src', 'components', 'dashboard', 'experiment-progress.jsx'),
    to: path.join('src', 'components', 'dashboard', 'experiments', 'experiment-progress.jsx')
  },
  // Move equipment-related files
  {
    from: path.join('src', 'components', 'dashboard', 'system-logs.jsx'),
    to: path.join('src', 'components', 'dashboard', 'equipment', 'system-logs.jsx')
  },
  // Move inventory-related files
  {
    from: path.join('src', 'components', 'dashboard', 'compliance-alerts.jsx'),
    to: path.join('src', 'components', 'dashboard', 'inventory', 'compliance-alerts.jsx')
  },
  // Move remaining shared components
  {
    from: path.join('src', 'components', 'dashboard', 'pending-approvals.jsx'),
    to: path.join('src', 'components', 'dashboard', 'shared', 'pending-approvals.jsx')
  },
  {
    from: path.join('src', 'components', 'dashboard', 'smart-insights.jsx'),
    to: path.join('src', 'components', 'dashboard', 'shared', 'smart-insights.jsx')
  }
];

async function moveFiles() {
  console.log('Starting file reorganization...');
  let successCount = 0;
  let errorCount = 0;

  for (const move of moves) {
    try {
      // Ensure the destination directory exists
      const dir = path.dirname(move.to);
      await fs.mkdir(dir, { recursive: true });
      
      // Move the file
      await fs.rename(move.from, move.to);
      console.log(`✅ Moved: ${move.from} → ${move.to}`);
      successCount++;
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log(`ℹ️  Skipped (not found): ${move.from}`);
      } else {
        console.error(`❌ Error moving ${move.from}:`, error.message);
        errorCount++;
      }
    }
  }

  // Summary
  console.log('\nReorganization complete!');
  console.log(`✅ Successfully moved: ${successCount} files`);
  if (errorCount > 0) {
    console.log(`❌ Errors: ${errorCount} files`);
  }
}

// Run the script
moveFiles().catch(console.error);
