import { describe, expect, it } from 'vitest';
import { highlightJson, highlightRequest } from './highlight';

describe('highlightJson', () => {
	it('tokenizes keys, strings, and numbers', () => {
		const html = highlightJson('{\n  "base": "USD",\n  "price": 71.59\n}');
		expect(html).toContain('hljs-attr');
		expect(html).toContain('hljs-string');
		expect(html).toContain('hljs-number');
	});

	it('escapes html in the input', () => {
		expect(highlightJson('{"a": "<b>"}')).toContain('&lt;b&gt;');
		expect(highlightJson('{"a": "<b>"}')).not.toContain('<b>');
	});
});

describe('highlightRequest', () => {
	it('keeps the url readable for curl', () => {
		const html = highlightRequest('curl https://croncopia.com/api/metals/gold.json', 'curl');
		expect(html).toContain('https://croncopia.com/api/metals/gold.json');
	});

	it('tokenizes keywords per language', () => {
		expect(highlightRequest('import requests', 'python')).toContain('hljs-keyword');
		expect(highlightRequest('const a = await fetch("u");', 'javascript')).toContain(
			'hljs-keyword'
		);
		expect(highlightRequest('resp, err := http.Get("u")', 'go')).toContain('hljs-');
	});
});
