<script lang="ts">
	import { highlightJson, highlightRequest } from '$lib/docs/highlight';
	import { requestSnippet, snippetLangs, type SnippetLang } from '$lib/docs/snippets';

	interface Example {
		url: string;
		response: string;
	}

	interface Props {
		/** Full request URL the snippets are generated for. */
		url: string;
		/** Full example response JSON; the block is hidden when empty. */
		response?: string;
		/** Selectable ids for the interactive picker; hidden when empty. */
		ids?: string[];
		/** Id the initial url/response belong to. */
		selectedId?: string;
		/** Fetches the example for a newly picked id — override in stories/tests. */
		loadExample?: (id: string) => Promise<Example>;
		/** Responses longer than this many lines are clipped behind "view all". */
		clipLines?: number;
	}

	let {
		url,
		response = '',
		ids = [],
		selectedId = '',
		loadExample,
		clipLines = 24
	}: Props = $props();

	let lang = $state<SnippetLang>('curl');
	/** Example loaded for a picked id; null means the props are current. */
	let loaded = $state<(Example & { id: string }) | null>(null);
	let expanded = $state(false);
	let loading = $state(false);
	let loadError = $state('');
	let copied = $state('');

	const currentId = $derived(loaded?.id ?? selectedId);
	const currentUrl = $derived(loaded?.url ?? url);
	const currentResponse = $derived(loaded?.response ?? response);
	const request = $derived(requestSnippet(lang, currentUrl));
	const requestHtml = $derived(highlightRequest(request, lang));
	const responseHtml = $derived(highlightJson(currentResponse));
	const lineCount = $derived(currentResponse.split('\n').length);
	const clipped = $derived(!expanded && lineCount > clipLines);

	async function switchId(id: string) {
		if (!loadExample) return;
		loading = true;
		loadError = '';
		try {
			loaded = { id, ...(await loadExample(id)) };
			expanded = false;
		} catch {
			loadError = `failed to load ${id}`;
		} finally {
			loading = false;
		}
	}

	async function copy(text: string, which: string) {
		try {
			await navigator.clipboard.writeText(text);
		} catch {
			// clipboard API unavailable (permissions, older browsers)
			const helper = document.createElement('textarea');
			helper.value = text;
			document.body.appendChild(helper);
			helper.select();
			document.execCommand('copy');
			helper.remove();
		}
		copied = which;
		setTimeout(() => {
			if (copied === which) copied = '';
		}, 1500);
	}
</script>

<div class="flex flex-col gap-5">
	<div class="flex flex-col gap-2">
		<div class="flex flex-wrap items-center gap-2.5">
			<span class="flex-1 text-[10.5px] font-bold tracking-[1px] text-muted uppercase">request</span>
			{#if ids.length > 0 && loadExample}
				<select
					value={currentId}
					onchange={(e) => switchId(e.currentTarget.value)}
					disabled={loading}
					aria-label="example id"
					class="max-w-[140px] rounded border border-line bg-white px-2 py-1 font-mono text-xs text-ink focus:border-accent focus:outline-none disabled:opacity-50"
				>
					{#each ids as id (id)}
						<option value={id}>{id}</option>
					{/each}
				</select>
			{/if}
			<select
				bind:value={lang}
				aria-label="request language"
				class="rounded border border-line bg-white px-2 py-1 font-mono text-xs text-ink focus:border-accent focus:outline-none"
			>
				{#each snippetLangs as l (l.id)}
					<option value={l.id}>{l.label}</option>
				{/each}
			</select>
			<button
				onclick={() => copy(request, 'request')}
				class="cursor-pointer text-[11px] text-muted hover:text-ink"
			>
				{copied === 'request' ? 'copied' : 'copy'}
			</button>
		</div>
		{#if loadError}
			<span class="text-[11px] text-muted">{loadError}</span>
		{/if}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -- hljs escapes its input -->
		<pre
			class="m-0 overflow-x-auto rounded-md bg-ink px-4 py-3.5 text-xs leading-[1.6] whitespace-pre text-terminal-text">{@html requestHtml}</pre>
	</div>
	{#if currentResponse}
		<div class="flex flex-col gap-2">
			<div class="flex items-center gap-2.5">
				<span class="flex-1 text-[10.5px] font-bold tracking-[1px] text-muted uppercase">
					response
				</span>
				<button
					onclick={() => copy(currentResponse, 'response')}
					class="cursor-pointer text-[11px] text-muted hover:text-ink"
				>
					{copied === 'response' ? 'copied' : 'copy'}
				</button>
			</div>
			<div class="relative">
				<!-- eslint-disable-next-line svelte/no-at-html-tags -- hljs escapes its input -->
				<pre
					class="m-0 overflow-x-auto rounded-md bg-ink px-4 py-3.5 text-xs leading-[1.6] whitespace-pre text-terminal-soft {clipped
						? 'max-h-[340px] overflow-y-hidden'
						: ''}">{@html responseHtml}</pre>
				{#if clipped}
					<div
						class="absolute inset-x-0 bottom-0 flex h-24 items-end justify-center rounded-b-md bg-gradient-to-t from-ink via-ink/80 to-transparent pb-3"
					>
						<button
							onclick={() => (expanded = true)}
							class="cursor-pointer rounded border border-terminal-prompt bg-ink px-3 py-1 text-[11px] text-terminal-text hover:text-white"
						>
							view all · {lineCount} lines
						</button>
					</div>
				{/if}
			</div>
			{#if expanded && lineCount > clipLines}
				<button
					onclick={() => (expanded = false)}
					class="cursor-pointer self-center text-[11px] text-muted hover:text-ink"
				>
					show less
				</button>
			{/if}
		</div>
	{/if}
	<span class="text-[11px] text-muted">no auth · no keys · no rate limits</span>
</div>
