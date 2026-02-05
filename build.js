import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

try {
  console.log('🔨 Building backend for production...');
  
  // Create dist directory
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist', { recursive: true });
  }
  
  // Compile TypeScript
  console.log('📦 Compiling TypeScript...');
  execSync('npx tsc --project tsconfig.prod.json', { 
    stdio: 'inherit' 
  });
  
  // Copy package.json for production dependencies
  console.log('📋 Copying package.json...');
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const prodPackageJson = {
    name: packageJson.name,
    version: packageJson.version,
    type: 'commonjs',
    scripts: {
      start: 'node server/index.js'
    },
    dependencies: packageJson.dependencies
  };
  
  fs.writeFileSync('dist/package.json', JSON.stringify(prodPackageJson, null, 2));
  
  console.log('✅ Backend built successfully!');
  console.log('📁 Output directory: dist/');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}