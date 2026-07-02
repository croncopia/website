export const snippetLangs = [
	{ id: 'curl', label: 'curl' },
	{ id: 'javascript', label: 'JavaScript' },
	{ id: 'python', label: 'Python' },
	{ id: 'node', label: 'Node.js' },
	{ id: 'go', label: 'Go' }
] as const;

export type SnippetLang = (typeof snippetLangs)[number]['id'];

export function requestSnippet(lang: SnippetLang, url: string): string {
	switch (lang) {
		case 'javascript':
		case 'node':
			return `const res = await fetch(\n  "${url}"\n);\nconst data = await res.json();\nconsole.log(data);`;
		case 'python':
			return `import requests\n\nurl = "${url}"\ndata = requests.get(url).json()\nprint(data)`;
		case 'go':
			return `resp, err := http.Get(\n  "${url}")\nif err != nil {\n  log.Fatal(err)\n}\ndefer resp.Body.Close()\n\nvar data map[string]any\njson.NewDecoder(resp.Body).Decode(&data)`;
		default:
			return `curl ${url}`;
	}
}
