const fs = require('fs');
const path = require('path');

// Get command line arguments
const ghPagesDir = process.argv[2];
const newReportPath = process.argv[3];

if (!ghPagesDir || !newReportPath) {
  console.error('Usage: node update_reports.js <gh-pages-directory> <new-report-path>');
  process.exit(1);
}

// Function to get all report files
function getReportFiles(dir) {
  const files = fs.readdirSync(dir);
  return files
    .filter(file => file.startsWith('playwright-report_') && fs.statSync(path.join(dir, file)).isDirectory())
    .map(file => ({
      name: file,
      path: path.join(dir, file),
      stats: fs.statSync(path.join(dir, file))
    }))
    .sort((a, b) => b.stats.mtime.getTime() - a.stats.mtime.getTime()); // Sort by modification time, newest first
}

// Function to create index.html content
function createIndexHtml(reports) {
  const reportLinks = reports.map((report, index) => {
    const date = new Date(report.stats.mtime);
    const formattedDate = date.toLocaleString();
    const isLatest = index === 0 ? ' (Latest)' : '';
    
    return `
      <div class="report-item">
        <a href="${report.name}/index.html" target="_blank">
          <h3>Playwright Test Report${isLatest}</h3>
          <p>Generated: ${formattedDate}</p>
          <p>Directory: ${report.name}</p>
        </a>
      </div>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Playwright Test Reports</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 10px;
        }
        .header h1 {
            margin: 0;
            font-size: 2.5em;
        }
        .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
        }
        .reports-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 20px;
            margin-top: 30px;
        }
        .report-item {
            background: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .report-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }
        .report-item a {
            text-decoration: none;
            color: inherit;
            display: block;
        }
        .report-item h3 {
            margin: 0 0 10px 0;
            color: #667eea;
            font-size: 1.2em;
        }
        .report-item p {
            margin: 5px 0;
            color: #666;
            font-size: 0.9em;
        }
        .latest {
            border: 2px solid #667eea;
            background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding: 20px;
            color: #666;
            font-size: 0.9em;
        }
        @media (max-width: 768px) {
            .reports-grid {
                grid-template-columns: 1fr;
            }
            .header h1 {
                font-size: 2em;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🧪 Playwright Test Reports</h1>
        <p>Latest 4 test execution reports from CI/CD pipeline</p>
    </div>
    
    <div class="reports-grid">
        ${reportLinks}
    </div>
    
    <div class="footer">
        <p>Generated automatically by GitHub Actions</p>
        <p>Last updated: ${new Date().toLocaleString()}</p>
    </div>
</body>
</html>`;
}

// Main execution
try {
  console.log('📁 Reading existing reports from:', ghPagesDir);
  
  // Get existing reports
  const existingReports = getReportFiles(ghPagesDir);
  console.log(`📊 Found ${existingReports.length} existing reports`);
  
  // Copy new report if it exists
  if (fs.existsSync(newReportPath)) {
    const newReportDir = path.dirname(newReportPath);
    const newReportName = path.basename(newReportDir);
    const newReportDest = path.join(ghPagesDir, newReportName);
    
    console.log(`📋 Copying new report directory: ${newReportName}`);
    if (fs.existsSync(newReportDest)) {
      fs.rmSync(newReportDest, { recursive: true, force: true });
    }
    fs.cpSync(newReportDir, newReportDest, { recursive: true });
    
    // Add new report to the list
    const newReportStats = fs.statSync(newReportDest);
    const updatedReports = existingReports.filter(r => r.name !== newReportName);
    updatedReports.unshift({
      name: newReportName,
      path: newReportDest,
      stats: newReportStats
    });
    
  } else {
    console.log('⚠️ New report not found:', newReportPath);
  }
  
  // Keep only the latest 4 reports
  const latestReports = existingReports.slice(0, 4);
  console.log(`🎯 Keeping latest ${latestReports.length} reports`);
  
  // Remove old reports beyond the 4th
  if (existingReports.length > 4) {
    const reportsToRemove = existingReports.slice(4);
    console.log(`🗑️ Removing ${reportsToRemove.length} old reports`);
    
    reportsToRemove.forEach(report => {
      try {
        fs.rmSync(report.path, { recursive: true, force: true });
        console.log(`   Removed: ${report.name}`);
      } catch (error) {
        console.log(`   Failed to remove: ${report.name}`, error.message);
      }
    });
  }
  
  // Generate new index.html
  const indexContent = createIndexHtml(latestReports);
  const indexPath = path.join(ghPagesDir, 'index.html');
  
  console.log('📝 Generating new index.html');
  fs.writeFileSync(indexPath, indexContent);
  
  console.log('✅ Successfully updated reports!');
  console.log(`📊 Total reports: ${latestReports.length}`);
  console.log(`📅 Latest report: ${latestReports[0]?.name || 'None'}`);
  
} catch (error) {
  console.error('❌ Error updating reports:', error.message);
  process.exit(1);
} 