<script lang="ts">
	import type { CommoditySeries } from '$lib/data/types';
	import { fmtPrice } from '$lib/utils/format';

	interface Props {
		title: string;
		/** Endpoint glob shown next to the title, e.g. "/energy/*.json" */
		pathLabel: string;
		series: CommoditySeries[];
		/** Feed timestamp shown in the section meta line. */
		lastUpdated?: string;
	}

	let { title, pathLabel, series, lastUpdated }: Props = $props();
</script>

<section class="flex flex-col gap-2">
	<div class="flex items-baseline gap-2.5">
		<h2 class="text-[13px] font-bold tracking-[1px] uppercase">{title}</h2>
		<span class="text-[11px] text-muted">
			{pathLabel} · {series.length} series{#if lastUpdated}&nbsp;· updated {lastUpdated}{/if}
		</span>
	</div>
	<table class="w-full border-collapse text-[12.5px]">
		<thead>
			<tr class="text-left text-[11px] text-muted">
				<th class="border-b border-line pt-1 pr-2 pb-1.5 font-normal">series</th>
				<th class="border-b border-line px-2 pt-1 pb-1.5 text-right font-normal">price</th>
				<th class="border-b border-line pt-1 pb-1.5 pl-2 font-normal">unit</th>
			</tr>
		</thead>
		<tbody>
			{#each series as row (row.file)}
				<tr class="border-b border-line-soft hover:bg-hover">
					<td class="py-[5px] pr-2" title={row.file}>{row.name}</td>
					<td class="px-2 py-[5px] text-right font-semibold">{fmtPrice(row.price)}</td>
					<td class="py-[5px] pl-2 text-muted">{row.unit}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</section>
