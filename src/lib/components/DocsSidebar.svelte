<script lang="ts">
	import type { DocGroup } from '$lib/docs';

	interface Props {
		groups: DocGroup[];
		activeSlug: string;
	}

	let { groups, activeSlug }: Props = $props();
</script>

<nav class="flex flex-col gap-5 pt-6 pb-12">
	{#each groups as group (group.label)}
		<div class="flex flex-col gap-0.5">
			<div class="px-5 pb-1.5 text-[10.5px] font-bold tracking-[1px] text-muted uppercase">
				{group.label}
			</div>
			{#each group.pages as page (page.slug)}
				<a
					href="/docs/{page.slug}"
					aria-current={page.slug === activeSlug ? 'page' : undefined}
					class="border-l-2 px-5 py-[5px] {page.slug === activeSlug
						? 'border-accent bg-hover text-ink'
						: 'border-transparent text-body hover:bg-hover'}"
				>
					{page.title}
				</a>
			{/each}
		</div>
	{/each}
</nav>
