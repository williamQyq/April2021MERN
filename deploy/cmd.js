import { spawn } from 'child_process'
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__filename)
console.log(__dirname)
// const ls = spawn('cmd.exe', ['/d', '\William\William\April2021MERN\deploy.bat']);

// ls.stdout.on('data', function (data) {
//     console.log('stdout: ' + data);
// });

// ls.stderr.on('data', function (data) {
//     console.log('stderr: ' + data);
// });

// ls.on('exit', function (code) {
//     console.log('child process exited with code ' + code);
// });