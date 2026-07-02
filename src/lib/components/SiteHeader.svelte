<script lang="ts">
	interface Props {
		repoUrl?: string;
		exampleEndpoint?: string;
		/** Note about any values that are still placeholders. */
		dummyNote?: string;
	}

	let {
		repoUrl = 'https://github.com/croncopia',
		exampleEndpoint = 'https://croncopia.com/api/energy/brent_crude.json',
		dummyNote
	}: Props = $props();
</script>

<header class="mb-9 flex flex-col gap-3 border-b border-line pb-7">
	<div class="flex flex-wrap items-baseline gap-4">
		<h1 class="text-[22px] font-bold tracking-[-0.5px]">croncopia</h1>
		<span class="text-muted">free, open market data · no keys · no rate limits</span>
	</div>
	<p class="max-w-[640px] text-body">
		Exchange rates and commodity prices fetched and aggregated by GitHub Actions, served as plain
		JSON from GitHub. Grab any endpoint directly:
	</p>
	<div
		class="flex items-center gap-2.5 overflow-x-auto rounded bg-ink px-3.5 py-2.5 text-xs whitespace-nowrap text-terminal-text"
	>
		<span class="select-none text-terminal-prompt">$</span>
		<span>curl {exampleEndpoint}</span>
	</div>
	<div class="flex flex-wrap gap-5 text-xs">
		<a href={repoUrl} class="border-b border-accent-soft text-accent">github repo ↗</a>
		{#if dummyNote}
			<span class="text-muted">{dummyNote}</span>
		{/if}
	</div>
</header>
