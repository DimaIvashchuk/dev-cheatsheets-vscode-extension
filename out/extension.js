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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
function activate(context) {
    console.log('Dev Cheatsheet extension is now active!');
    const disposable = vscode.commands.registerCommand('dev-cheatsheet.open', () => {
        const panel = vscode.window.createWebviewPanel('devCheatsheet', 'Dev Cheatsheets Open', vscode.ViewColumn.One, {
            enableScripts: true,
            retainContextWhenHidden: true
        });
        // Load webview HTML
        const htmlPath = path.join(context.extensionPath, 'src', 'webview.html');
        let html = fs.readFileSync(htmlPath, 'utf8');
        // Set the webview's HTML content
        panel.webview.html = html;
        // Handle messages from the webview
        panel.webview.onDidReceiveMessage(message => {
            if (message.type === 'ready') {
                // Load and merge cheatsheets
                const cheatsheets = loadCheatsheets(context);
                panel.webview.postMessage({
                    type: 'loadCheatsheets',
                    data: cheatsheets
                });
            }
        }, undefined, context.subscriptions);
    });
    context.subscriptions.push(disposable);
}
function loadCheatsheets(context) {
    // Load default cheatsheets from JSON file
    const defaultCheatsPath = path.join(context.extensionPath, 'data', 'cheats.json');
    let defaultCheatsheets = [];
    try {
        const data = fs.readFileSync(defaultCheatsPath, 'utf8');
        defaultCheatsheets = JSON.parse(data);
    }
    catch (error) {
        console.error('Error loading default cheatsheets:', error);
        vscode.window.showErrorMessage('Failed to load default cheatsheets');
    }
    // Load user custom cheatsheets from settings
    const config = vscode.workspace.getConfiguration('dev-cheatsheet');
    const customCheatsheets = config.get('customCheatsheets', []);
    // Merge default and custom cheatsheets
    const allCheatsheets = [...defaultCheatsheets, ...customCheatsheets];
    // Set default subcategory to "Other" if not provided
    allCheatsheets.forEach(cheat => {
        if (!cheat.subcategory) {
            cheat.subcategory = 'Other';
        }
    });
    return allCheatsheets;
}
function deactivate() { }
//# sourceMappingURL=extension.js.map