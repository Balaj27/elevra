import fs from 'node:fs/promises';
const response = await fetch('https://elevra.framer.media/');
if (!response.ok) throw new Error(`Reference request failed: ${response.status}`);
await fs.mkdir('reference', { recursive: true });
await fs.writeFile('reference/original.html', await response.text());
console.log('Saved original server markup for responsive variants.');
