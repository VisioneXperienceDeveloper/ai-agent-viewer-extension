"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
function activate(context) {
    console.log('Congratulations, your extension "ai-agent-visualizer" is now active!');
    let panel = undefined;
    let disposable = vscode.commands.registerCommand('ai-agent-visualizer.show', () => {
        if (panel) {
            panel.reveal(vscode.ViewColumn.One);
            return;
        }
        panel = vscode.window.createWebviewPanel('aiAgentVisualizer', 'AI Agent Visualizer', vscode.ViewColumn.One, {
            enableScripts: true,
            localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'media'))]
        });
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
exports.activate = activate;
function getWebviewContent(styleUri, scriptUri) {
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
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map