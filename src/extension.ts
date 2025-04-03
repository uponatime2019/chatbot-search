import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('chatbot-search', async () => {
        // Define search providers as QuickPick items without descriptions
        const searchProviders = [
            { label: 'Grok', url: 'http://grok.com/?q=' },
            { label: 'ChatGPT', url: 'https://chat.openai.com/?q=' },
            { label: 'Claude', url: 'https://claude.ai/new?q=' },
            { label: 'Grok on X', url: 'https://x.com/i/grok?text=' },
            { label: 'Google', url: 'https://www.google.com/search?q=' },
            // { label: 'Gemini', url: 'https://gemini.google.com/' }
        ];

        // Show QuickPick to select a search provider
        const selectedProvider = await vscode.window.showQuickPick(searchProviders, {
            placeHolder: 'Select a search provider'
        });

        // If a provider is selected, proceed to get the query
        if (selectedProvider) {
            const query = await vscode.window.showInputBox({
                placeHolder: 'Enter your search query',
                prompt: `Type something to search with ${selectedProvider.label}`,
                value: ''
            });

            // Check if the user entered something
            if (query && query.trim()) {
                // Special handling for Gemini (no query parameter support)
                let searchUrl = selectedProvider.url;
                if (selectedProvider.label === 'Gemini') {
                    // Open Gemini base URL without query; user must input manually
                    searchUrl = 'https://gemini.google.com/';
                } else {
                    // Append query for other providers
                    searchUrl = `${selectedProvider.url}${encodeURIComponent(query.trim())}`;
                }
                
                // Open the URL in the default browser
                vscode.env.openExternal(vscode.Uri.parse(searchUrl));
            } else if (query !== undefined) {
                vscode.window.showInformationMessage('Please enter a search query');
            }
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}