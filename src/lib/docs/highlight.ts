import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import go from 'highlight.js/lib/languages/go';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import python from 'highlight.js/lib/languages/python';
import type { SnippetLang } from './snippets';

hljs.registerLanguage('bash', bash);
hljs.registerLanguage('go', go);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('json', json);
hljs.registerLanguage('python', python);

const hljsLang: Record<SnippetLang, string> = {
	curl: 'bash',
	javascript: 'javascript',
	node: 'javascript',
	python: 'python',
	go: 'go'
};

/** Highlighted HTML for a request snippet; hljs escapes the input. */
export function highlightRequest(code: string, lang: SnippetLang): string {
	return hljs.highlight(code, { language: hljsLang[lang] }).value;
}

/** Highlighted HTML for a JSON response; hljs escapes the input. */
export function highlightJson(code: string): string {
	return hljs.highlight(code, { language: 'json' }).value;
}
