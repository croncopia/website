import { describe, expect, it } from 'vitest';
import { docGroups, docPages, getDocPage } from './index';
import { requestSnippet, snippetLangs } from './snippets';

describe('docs module', () => {
	it('loads every markdown page with frontmatter applied', () => {
		expect(docPages.length).toBeGreaterThanOrEqual(5);
		for (const page of docPages) {
			expect(page.title).not.toBe('Untitled');
			expect(page.method).toBe('GET');
			expect(page.path).toMatch(/^https:\/\/croncopia\.com\/api\//);
			expect(page.example).toMatch(/^api\//);
			expect(page.html).toContain('<p>');
		}
	});

	it('sorts pages by order and keeps slugs unique', () => {
		const orders = docPages.map((p) => p.order);
		expect(orders).toEqual([...orders].sort((a, b) => a - b));
		expect(new Set(docPages.map((p) => p.slug)).size).toBe(docPages.length);
	});

	it('groups pages in order of first appearance', () => {
		expect(docGroups.map((g) => g.label)).toEqual([
			'Getting Started',
			'Exchange Rates',
			'Commodity Prices'
		]);
	});

	it('renders markdown tables and inline code', () => {
		const intro = getDocPage('intro');
		expect(intro?.html).toContain('<table>');
		expect(intro?.html).toContain('<code>exchange</code>');
	});

	it('returns undefined for unknown slugs', () => {
		expect(getDocPage('nope')).toBeUndefined();
	});

	it('wires id rules through frontmatter', () => {
		expect(getDocPage('energy')?.ids).toBe('energy');
		expect(getDocPage('metals')?.ids).toBe('metals');
		expect(getDocPage('exchange')?.ids).toBe('exchange');
		expect(getDocPage('intro')?.ids).toBe('');
	});
});

describe('requestSnippet', () => {
	it('includes the url in every language', () => {
		for (const { id } of snippetLangs) {
			expect(requestSnippet(id, 'https://croncopia.com/metals/gold.json')).toContain(
				'https://croncopia.com/metals/gold.json'
			);
		}
	});

	it('generates language-specific code', () => {
		expect(requestSnippet('curl', 'u')).toBe('curl u');
		expect(requestSnippet('python', 'u')).toContain('import requests');
		expect(requestSnippet('go', 'u')).toContain('http.Get');
	});
});
