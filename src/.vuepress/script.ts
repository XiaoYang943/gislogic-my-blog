import * as fs from 'fs';
import * as path from 'path';
import { fillTemplate } from 'markmap-render';
import { Transformer } from 'markmap-lib';
import * as childProcess from 'child_process';
const directory = 'src/.vuepress/public/markmap';
const markdownFiles: string[] = [];
const transformer = new Transformer();
function findMarkdownFiles(dir: string): void {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            findMarkdownFiles(fullPath);
        } else if (path.extname(fullPath) === '.md') {
            let fileName = path.basename(fullPath,".md");
            markdownFiles.push(fullPath);
            const content = fs.readFileSync(fullPath, 'utf8');
            const header = parseMarkdownHeader(content);
            if (header.isMarkmap === 'true') {
                const { root, features } = transformer.transform(content);
                const assets = transformer.getUsedAssets(features);
                const html = fillTemplate(root, assets);
                fs.writeFile(directory+
                    "/"+fileName+".html",
                    html,
                    {
                        encoding: "utf8"
                    },
                    (err) => {
                        console.log("err:" + err);
                    }
                );
            }
        }
    });
}
function parseMarkdownHeader(content: string): Record<string, any> {
    const headerRegex = /---([\s\S]*?)---/;
    const headerMatch = content.match(headerRegex);
    if (!headerMatch) {
        return {};
    }
    const headerContent = headerMatch[1];
    const lines = headerContent.split('\n');
    const header: Record<string, any> = {};
    for (const line of lines) {
        const [key, value] = line.split(':').map(s => s.trim());
        header[key] = value;
    }
    return header;
}

findMarkdownFiles(directory);

