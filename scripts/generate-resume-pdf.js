import fs from 'fs';
import path from 'path';
import { buildResumeDoc } from '../src/utils/resumeGenerator.ts';

// CLI execution to generate static PDF in public directory
const publicDir = path.resolve(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate complete 2-page PDF
const fullDoc = buildResumeDoc({ includeProjects: true });
const fullBuffer = Buffer.from(fullDoc.output('arraybuffer'));
fs.writeFileSync(path.join(publicDir, 'vignesh-k-n-resume.pdf'), fullBuffer);
fs.writeFileSync(path.join(publicDir, 'resume.pdf'), fullBuffer);
fs.writeFileSync(path.join(publicDir, 'Vignesh_K_N_Resume.pdf'), fullBuffer);

// Also generate exact 1-page original resume matching the attached PDF
const page1Doc = buildResumeDoc({ includeProjects: false });
const page1Buffer = Buffer.from(page1Doc.output('arraybuffer'));
fs.writeFileSync(path.join(publicDir, 'vignesh-k-n-resume-original.pdf'), page1Buffer);

console.log('Successfully generated ATS-compliant Resume PDFs in public/ folder.');
