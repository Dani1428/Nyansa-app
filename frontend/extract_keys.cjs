const fs = require('fs');
const path = require('path');

function getFiles(dir, files = []) {
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getFiles(filePath, files);
    } else if (filePath.endsWith('.tsx')) {
      files.push(filePath);
    }
  }
  return files;
}

const files = getFiles('./src');
const keys = new Set();
const regex = /t\(['"]([a-zA-Z0-9_\.]+)['"]/g;

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = regex.exec(content)) !== null) {
    keys.add(match[1]);
  }
});

const existingEn = JSON.parse(fs.readFileSync('./src/locales/en.json', 'utf8'));

function setNested(obj, pathParts) {
  let curr = obj;
  for (let i = 0; i < pathParts.length - 1; i++) {
    const part = pathParts[i];
    if (!curr[part]) curr[part] = {};
    curr = curr[part];
  }
  const last = pathParts[pathParts.length - 1];
  if (curr[last] === undefined) {
    curr[last] = '';
  }
}

const missing = {};
for (const key of keys) {
  const parts = key.split('.');
  let curr = existingEn;
  let found = true;
  for (const p of parts) {
    if (curr[p] === undefined) {
      found = false;
      break;
    }
    curr = curr[p];
  }
  if (!found) {
    setNested(missing, parts);
  }
}

console.log(JSON.stringify(missing, null, 2));
