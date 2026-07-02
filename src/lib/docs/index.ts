import { marked } from 'marked';

/**
 * Docs module system: drop a markdown file in src/lib/docs/pages/ and it
 * becomes a page at /docs/{filename}. Frontmatter:
 *
 *   title:   sidebar + page heading            (required)
 *   group:   sidebar section label             (required)
 *   order:   global sort number; groups appear in order of their first page
 *   method:  HTTP method badge                 (default GET)
 *   path:    endpoint pattern shown under the badge
 *   example: site-relative path fetched live for the code panel,
 *            e.g. "api/exchange/EUR.json"
 *   ids:     optional id-rule name (see src/lib/docs/ids.ts) that populates
 *            the interactive id picker in the code panel
 *
 * The body is plain markdown, styled by .docs-prose in app.css.
 */
export interface DocPage {
	slug: string;
	title: string;
	group: string;
	order: number;
	method: string;
	path: string;
	example: string;
	/** Name of the id rule in src/lib/docs/ids.ts, or '' for a static example. */
	ids: string;
	/** GitHub edit link for this page's markdown source. */
	editUrl: string;
	html: string;
}

export interface DocGroup {
	label: string;
	pages: DocPage[];
}

const GITHUB_EDIT_BASE = 'https://github.com/croncopia/website/edit/main/src/lib/docs/pages';

const raws = import.meta.glob('./pages/*.md', {
	eager: true,
	query: '?raw',
	import: 'default'
}) as Record<string, string>;

function parseFrontmatter(raw: string): { meta: Record<string, string>; body: string } {
	const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw);
	if (!match) return { meta: {}, body: raw };
	const meta: Record<string, string> = {};
	for (const line of match[1].split(/\r?\n/)) {
		const sep = line.indexOf(':');
		if (sep > 0) meta[line.slice(0, sep).trim()] = line.slice(sep + 1).trim();
	}
	return { meta, body: raw.slice(match[0].length) };
}

export const docPages: DocPage[] = Object.entries(raws)
	.map(([file, raw]) => {
		const { meta, body } = parseFrontmatter(raw);
		return {
			slug: file.replace('./pages/', '').replace('.md', ''),
			title: meta.title ?? 'Untitled',
			group: meta.group ?? 'Docs',
			order: Number(meta.order ?? 0),
			method: meta.method ?? 'GET',
			path: meta.path ?? '',
			example: meta.example ?? '',
			ids: meta.ids ?? '',
			html: marked.parse(body, { async: false })
		};
	})
	.sort((a, b) => a.order - b.order);

export const docGroups: DocGroup[] = docPages.reduce<DocGroup[]>((groups, page) => {
	const group = groups.find((g) => g.label === page.group);
	if (group) group.pages.push(page);
	else groups.push({ label: page.group, pages: [page] });
	return groups;
}, []);

export function getDocPage(slug: string): DocPage | undefined {
	return docPages.find((p) => p.slug === slug);
}
