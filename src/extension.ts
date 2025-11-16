import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

interface Cheatsheet {
	title: string;
	description: string;
	code: string;
	category: string;
	subcategory?: string;
	tags: string[];
}

export function activate(context: vscode.ExtensionContext) {
	console.log('Dev Cheatsheet extension is now active!');

	const disposable = vscode.commands.registerCommand('dev-cheatsheet.open', () => {
		const panel = vscode.window.createWebviewPanel(
			'devCheatsheet',
			'Dev Cheatsheets Open',
			vscode.ViewColumn.One,
			{
				enableScripts: true,
				retainContextWhenHidden: true
			}
		);

		// Load webview HTML
		const htmlPath = path.join(context.extensionPath, 'src', 'webview.html');
		let html = fs.readFileSync(htmlPath, 'utf8');

		// Set the webview's HTML content
		panel.webview.html = html;

		// Handle messages from the webview
		panel.webview.onDidReceiveMessage(
			message => {
				if (message.type === 'ready') {
					// Load and merge cheatsheets
					const cheatsheets = loadCheatsheets(context);
					panel.webview.postMessage({
						type: 'loadCheatsheets',
						data: cheatsheets
					});
				}
			},
			undefined,
			context.subscriptions
		);
	});

	context.subscriptions.push(disposable);
}

function loadCheatsheets(context: vscode.ExtensionContext): Cheatsheet[] {
	// Load default cheatsheets from JSON file
	const defaultCheatsPath = path.join(context.extensionPath, 'data', 'cheats.json');
	let defaultCheatsheets: Cheatsheet[] = [];

	try {
		const data = fs.readFileSync(defaultCheatsPath, 'utf8');
		defaultCheatsheets = JSON.parse(data);
	} catch (error) {
		console.error('Error loading default cheatsheets:', error);
		vscode.window.showErrorMessage('Failed to load default cheatsheets');
	}

	// Load user custom cheatsheets from settings
	const config = vscode.workspace.getConfiguration('dev-cheatsheet');
	const customCheatsheets: Cheatsheet[] = config.get('customCheatsheets', []);

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

export function deactivate() {}
