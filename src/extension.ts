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

	// Command: Open cheatsheets viewer
	const openCommand = vscode.commands.registerCommand('dev-cheatsheet.open', () => {
		const panel = vscode.window.createWebviewPanel(
			'devCheatsheet',
			'Dev Cheatsheets',
			vscode.ViewColumn.One,
			{
				enableScripts: true,
				retainContextWhenHidden: true
			}
		);

		// Load webview HTML
		let htmlPath = path.join(context.extensionPath, 'out', 'webview.html');
	
		if (!fs.existsSync(htmlPath)) {
			htmlPath = path.join(context.extensionPath, 'src', 'webview.html');
		}
		const html = fs.readFileSync(htmlPath, 'utf8');

		panel.webview.html = html;

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

	// Command: Export cheatsheets to current folder
	const exportCommand = vscode.commands.registerCommand('dev-cheatsheet.export', async () => {
		try {
			// Get the workspace folder (current folder)
			const workspaceFolders = vscode.workspace.workspaceFolders;
			if (!workspaceFolders || workspaceFolders.length === 0) {
				vscode.window.showErrorMessage('No workspace folder open. Please open a folder first.');
				return;
			}

			const targetFolder = workspaceFolders[0].uri.fsPath;
			const sourceFile = path.join(context.extensionPath, 'data', 'cheats.json');
			const targetFile = path.join(targetFolder, 'cheats.json');

			// Check if file already exists
			if (fs.existsSync(targetFile)) {
				const choice = await vscode.window.showWarningMessage(
					'cheats.json already exists in the current folder. Overwrite?',
					'Yes', 'No'
				);
				if (choice !== 'Yes') {
					return;
				}
			}

			// Copy the file
			fs.copyFileSync(sourceFile, targetFile);
			vscode.window.showInformationMessage(`Cheatsheets exported to: ${targetFile}`);

			// Ask if user wants to open the file
			const openChoice = await vscode.window.showInformationMessage(
				'Export successful! Open the file?',
				'Open', 'Close'
			);
			if (openChoice === 'Open') {
				const doc = await vscode.workspace.openTextDocument(targetFile);
				await vscode.window.showTextDocument(doc);
			}
		} catch (error) {
			vscode.window.showErrorMessage(`Failed to export cheatsheets: ${error}`);
		}
	});

	// Command: Import cheatsheets from file
	const importCommand = vscode.commands.registerCommand('dev-cheatsheet.import', async () => {
		try {
			// Open file picker
			const fileUri = await vscode.window.showOpenDialog({
				canSelectFiles: true,
				canSelectFolders: false,
				canSelectMany: false,
				filters: {
					'JSON Files': ['json'],
					'All Files': ['*']
				},
				openLabel: 'Select Cheatsheets File'
			});

			if (!fileUri || fileUri.length === 0) {
				return; // User cancelled
			}

			const selectedFile = fileUri[0].fsPath;

			// Read and validate the file
			const fileContent = fs.readFileSync(selectedFile, 'utf8');
			const importedCheatsheets = JSON.parse(fileContent);

			// Validate that it's an array
			if (!Array.isArray(importedCheatsheets)) {
				vscode.window.showErrorMessage('Invalid file format. Expected a JSON array of cheatsheets.');
				return;
			}

			// Store the file path in configuration
			const config = vscode.workspace.getConfiguration('dev-cheatsheet');
			await config.update('importedFilePath', selectedFile, vscode.ConfigurationTarget.Global);

			vscode.window.showInformationMessage(
				`Successfully imported ${importedCheatsheets.length} cheatsheet(s) from ${path.basename(selectedFile)}`
			);

			// Suggest to open the viewer
			const openChoice = await vscode.window.showInformationMessage(
				'Import successful! Open cheatsheets viewer?',
				'Open', 'Close'
			);
			if (openChoice === 'Open') {
				vscode.commands.executeCommand('dev-cheatsheet.open');
			}
		} catch (error) {
			vscode.window.showErrorMessage(`Failed to import cheatsheets: ${error}`);
		}
	});

	context.subscriptions.push(openCommand, exportCommand, importCommand);
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

	// Load imported cheatsheets from file (if set)
	let importedCheatsheets: Cheatsheet[] = [];
	const config = vscode.workspace.getConfiguration('dev-cheatsheet');
	const importedFilePath: string | undefined = config.get('importedFilePath');
	if (importedFilePath && fs.existsSync(importedFilePath)) {
		try {
			const importedData = fs.readFileSync(importedFilePath, 'utf8');
			importedCheatsheets = JSON.parse(importedData);
			if (!Array.isArray(importedCheatsheets)) {
				importedCheatsheets = [];
			}
		} catch (error) {
			console.error('Error loading imported cheatsheets:', error);
			vscode.window.showWarningMessage('Failed to load imported cheatsheets file');
		}
	}

	// Merge default and imported cheatsheets
	const allCheatsheets = [...defaultCheatsheets, ...importedCheatsheets];

	// Set default subcategory to "Other" if not provided
	allCheatsheets.forEach(cheat => {
		if (!cheat.subcategory) {
			cheat.subcategory = 'Other';
		}
	});

	return allCheatsheets;
}

export function deactivate() {}
