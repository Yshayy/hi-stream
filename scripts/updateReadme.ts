import fs from 'fs';
import path from 'path';
import ts from 'typescript';

const OPERATORS_DIR = path.join(__dirname, '../src/operators');
const README_PATH = path.join(__dirname, '../README.md');
const OPERATORS_BEGIN = '<!-- OPERATORS_BEGIN -->';
const OPERATORS_END = '<!-- OPERATORS_END -->';

function extractOperatorDetails(filePath: string): { name: string, signature: string, description: string, example: string } {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const sourceFile = ts.createSourceFile(filePath, fileContent, ts.ScriptTarget.Latest, true);
  let name = '';
  let signature = '';
  let description = '';
  let example = '';

  function visit(node: ts.Node) {
    if (ts.isFunctionDeclaration(node) && node.name && node.jsDoc) {
      if (node.name.getText().endsWith('Stream')) {
        return;
      }
      name = node.name.getText();
      
      signature = node.getText().split('{')[0].trim() + ';';
      for (const jsDoc of node.jsDoc) {
        if (jsDoc.comment) {
          description = jsDoc.comment;
        }
        if (jsDoc.tags) {
          for (const tag of jsDoc.tags) {
            if (tag.tagName.text === 'example') {
              example = tag.comment || '';
            }
          }
        }
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return { name, signature, description, example };
}

function updateReadme() {
  const operatorFiles = fs.readdirSync(OPERATORS_DIR).filter(file => file.endsWith('.ts'));
  const operatorDetails = operatorFiles.map(file => {
    const { name, signature, description, example } = extractOperatorDetails(path.join(OPERATORS_DIR, file));
    return { name, details: `### ${name}\n\n**Signature:**\n\`\`\`ts\n${signature}\n\`\`\`\n\n**Description:**\n${description}\n\n<details><summary>Example</summary>\n\n\`\`\`ts\n${example}\n\`\`\`\n\n</details>` };
  }).filter(detail => detail !== '').sort((a, b) => a.name.localeCompare(b.name)).map(detail => detail.details).join('\n\n');

  let readmeContent = fs.readFileSync(README_PATH, 'utf-8');
  const beginIndex = readmeContent.indexOf(OPERATORS_BEGIN) + OPERATORS_BEGIN.length;
  const endIndex = readmeContent.indexOf(OPERATORS_END);
  readmeContent = readmeContent.slice(0, beginIndex) + '\n' + operatorDetails + '\n' + readmeContent.slice(endIndex);
  fs.writeFileSync(README_PATH, readmeContent, 'utf-8');
}

updateReadme();
