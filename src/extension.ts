import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "ai-agent-visualizer" is now active!');

    let panel: vscode.WebviewPanel | undefined = undefined;

    let disposable = vscode.commands.registerCommand('ai-agent-visualizer.show', () => {
        if (panel) {
            panel.reveal(vscode.ViewColumn.One);
            return;
        }

        panel = vscode.window.createWebviewPanel(
            'aiAgentVisualizer',
            'AI Agent Visualizer',
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'media'))]
            }
        );

        const styleUri = panel.webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, 'media', 'style.css')));
        const scriptUri = panel.webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, 'media', 'main.js')));

        panel.webview.html = getWebviewContent(styleUri, scriptUri);

        panel.onDidDispose(() => {
            panel = undefined;
        }, null, context.subscriptions);

        // 1번 방식: 파일 감시 (FileSystemWatcher)
        // 워크스페이스 루트의 'agents.log' 파일을 감시합니다.
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (workspaceFolders) {
            const logFilePath = path.join(workspaceFolders[0].uri.fsPath, 'agents.log');
            
            // 초기 파일 생성 (없을 경우)
            if (!fs.existsSync(logFilePath)) {
                fs.writeFileSync(logFilePath, 'Visualizer started.\n');
            }

            const watcher = vscode.workspace.createFileSystemWatcher(logFilePath);
            
            watcher.onDidChange(() => {
                if (panel) {
                    // 파일의 마지막 줄을 읽어 파싱합니다.
                    const content = fs.readFileSync(logFilePath, 'utf8');
                    const lines = content.trim().split('\n');
                    const lastLine = lines[lines.length - 1];
                    
                    // 예상 포맷: "AGENT_0: 작업내용"
                    const match = lastLine.match(/AGENT_(\d+):\s*(.*)/);
                    if (match) {
                        const agentId = parseInt(match[1]);
                        const taskText = match[2];
                        
                        panel.webview.postMessage({
                            type: 'task',
                            text: taskText,
                            agentId: agentId
                        });
                    }
                }
            });

            context.subscriptions.push(watcher);
        }
    });

    context.subscriptions.push(disposable);
}

function getWebviewContent(styleUri: vscode.Uri, scriptUri: vscode.Uri) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Agent Visualizer</title>
    <link rel="stylesheet" href="${styleUri}">
</head>
<body>
    <div class="container">
        <h1>AI Agent Visualizer</h1>
        <div id="landscape" class="landscape">
            <div id="agent-container"></div>
        </div>
        <div class="controls">
            <button id="add-agent">Add Agent</button>
        </div>
    </div>
    <script src="${scriptUri}"></script>
</body>
</html>`;
}

export function deactivate() {}
