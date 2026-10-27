// Syntax/decorator transpilation only. Real Creator SDK semantic validation is separate.
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const folder = path.join(__dirname, '../assets/scripts/common/cocos');
let count = 0;
for (const file of fs.readdirSync(folder).filter(name => name.endsWith('.ts'))) {
  const result = ts.transpileModule(fs.readFileSync(path.join(folder, file), 'utf8'), {
    fileName: file, reportDiagnostics: true,
    compilerOptions: {target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ESNext, experimentalDecorators: true},
  });
  const errors = (result.diagnostics ?? []).filter(d => d.category === ts.DiagnosticCategory.Error);
  if (errors.length) {
    console.error(ts.formatDiagnosticsWithColorAndContext(errors, {
      getCurrentDirectory: () => process.cwd(), getCanonicalFileName: f => f, getNewLine: () => '\n',
    }));
    process.exitCode = 1;
  }
  count++;
}
console.log(`${count} Cocos bridge files syntax-checked; use check:cocos for SDK types. Runtime requires separate preview.`);
