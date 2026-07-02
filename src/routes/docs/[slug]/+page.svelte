<script lang="ts">
	import CodePanel from '$lib/components/CodePanel.svelte';
	import DocsSidebar from '$lib/components/DocsSidebar.svelte';
	import DocsTopBar from '$lib/components/DocsTopBar.svelte';
	import { docGroups } from '$lib/docs';
	import { idRules } from '$lib/docs/ids';

	let { data } = $props();
	const page = $derived(data.page);
	const rule = $derived(page.ids ? idRules[page.ids] : undefined);

	async function loadExample(id: string) {
		if (!rule) throw new Error('no id rule');
		const path = rule.pathFor(id);
		const res = await fetch(`/${path}`);
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		return {
			url: `https://croncopia.com/${path}`,
			response: JSON.stringify(await res.json(), null, 2)
		};
	}
</script>

<svelte:head>
	<title>{page.title} — croncopia docs</title>
</svelte:head>

<div class="flex min-h-screen flex-col">
	<DocsTopBar />
	<div class="grid flex-1 grid-cols-1 lg:grid-cols-[220px_minmax(360px,1fr)_minmax(340px,440px)]">
		<div class="border-b border-line lg:border-r lg:border-b-0">
			<DocsSidebar groups={docGroups} activeSlug={page.slug} />
		</div>
		<main class="min-w-0 px-9 pt-8 pb-24">
			<div class="mb-1.5 flex items-center gap-2.5">
				<span class="rounded-[3px] bg-ink px-[7px] py-0.5 text-[10.5px] font-bold text-terminal-text">
					{page.method}
				</span>
				<span class="text-[12.5px] break-words text-body">{page.path}</span>
			</div>
			<h1 class="mb-3.5 text-[20px] font-bold tracking-[-0.4px]">{page.title}</h1>
			<div class="docs-prose">
				<!-- eslint-disable-next-line svelte/no-at-html-tags -- our own markdown -->
				{@html page.html}
			</div>
		</main>
		<aside class="border-t border-line bg-hover px-6 pt-8 pb-24 lg:border-t-0 lg:border-l">
			{#key page.slug}
				<CodePanel
					url="https://croncopia.com/{page.example}"
					response={data.response}
					ids={data.ids}
					selectedId={data.exampleId}
					loadExample={rule ? loadExample : undefined}
				/>
			{/key}
		</aside>
	</div>
</div>
