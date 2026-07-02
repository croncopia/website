<script lang="ts">
	interface Props {
		section?: string;
		repoUrl?: string;
	}

	let { section = 'docs', repoUrl = 'https://github.com/croncopia' }: Props = $props();
</script>

<div class="flex flex-wrap items-baseline gap-4 border-b border-line px-6 py-4">
	<a href="/" class="text-[16px] font-bold tracking-[-0.5px] text-ink">croncopia</a>
	<span class="text-xs text-muted">/ {section}</span>
	<div class="ml-auto flex gap-[18px] text-xs">
		<a href="/" class="border-b border-accent-soft text-accent">data ↗</a>
		<a href={repoUrl} class="border-b border-accent-soft text-accent">github ↗</a>
	</div>
</div>
