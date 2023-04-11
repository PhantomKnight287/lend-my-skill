const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Get the folder path from the first command-line argument
const folderPath = process.argv[2];

// Check if the folder path exists
if (!fs.existsSync(folderPath)) {
  console.error(`Folder "${folderPath}" does not exist!`);
  process.exit(1);
}

// Read the package.json file in the folder
const packageJsonPath = path.join(folderPath, 'package.json');
let packageJson;

try {
  const packageJsonData = fs.readFileSync(packageJsonPath, 'utf-8');
  packageJson = JSON.parse(packageJsonData);
} catch (err) {
  console.error(`Error reading package.json in "${folderPath}":`, err);
  process.exit(1);
}

// Get a list of all dependencies and devDependencies
const dependencies = Object.keys(packageJson.dependencies || {});
const devDependencies = Object.keys(packageJson.devDependencies || {});
const packages = [...dependencies, ...devDependencies];
const packagesString = packages.join('@latest ');

console.log(`Run: \`pnpm i ${packagesString}@latest\``);
