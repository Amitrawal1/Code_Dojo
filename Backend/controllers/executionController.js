import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export const executeCode = async (req, res) => {
  const { language, code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Code is required' });
  }

  const tmpDir = path.join(process.cwd(), 'tmp');
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir);
  }

  const fileId = crypto.randomUUID();
  const runDir = path.join(tmpDir, fileId);
  fs.mkdirSync(runDir);
  
  let filePath = '';
  let command = '';

  if (language === 'javascript') {
    filePath = path.join(runDir, 'script.js');
    fs.writeFileSync(filePath, code);
    command = `node ${filePath}`;
  } else if (language === 'python') {
    filePath = path.join(runDir, 'script.py');
    fs.writeFileSync(filePath, code);
    command = `python3 ${filePath}`;
  } else if (language === 'java') {
    filePath = path.join(runDir, 'Solution.java');
    fs.writeFileSync(filePath, code);
    command = `cd ${runDir} && javac Solution.java && java Solution`;
  } else if (language === 'cpp') {
    filePath = path.join(runDir, 'main.cpp');
    fs.writeFileSync(filePath, code);
    command = `cd ${runDir} && g++ main.cpp -o main && ./main`;
  } else {
    return res.status(400).json({ error: `Execution for ${language} is not supported locally.` });
  }

  // Execute with a timeout of 5 seconds
  exec(command, { timeout: 5000 }, (error, stdout, stderr) => {
    // Cleanup temp directory
    fs.rm(runDir, { recursive: true, force: true }, () => {});

    // Clean up absolute paths from error messages so it looks like VS Code
    const cleanError = (errStr) => {
      if (!errStr) return "";
      let cleaned = errStr.split(runDir).join(''); // Remove absolute path prefix
      
      // Node.js specific path cleanup
      cleaned = cleaned.replace(/at Object\.<anonymous> \(\/script\.js:(\d+):(\d+)\)/g, 'at script.js:$1:$2');
      cleaned = cleaned.replace(/\/script\.js:(\d+)/g, 'Solution.js:$1');
      
      // Python specific path cleanup
      cleaned = cleaned.replace(/File "\/script\.py", line (\d+)/g, 'File "Solution.py", line $1');
      
      return cleaned.trim();
    };

    if (error) {
      if (error.killed) {
         return res.json({ output: '', error: 'Execution Timed Out (5s limit)' });
      }
      return res.json({ output: stdout, error: cleanError(stderr || error.message) });
    }

    res.json({ output: stdout, error: cleanError(stderr) });
  });
};
