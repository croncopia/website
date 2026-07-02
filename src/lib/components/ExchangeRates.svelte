<script lang="ts">
	import type { CurrencyRate } from '$lib/data/types';
	import { fetchExchangeRates } from '$lib/data/exchange';
	import { fmtRate } from '$lib/utils/format';

	interface Props {
		rates: CurrencyRate[];
		/** Base currency the initial rates are quoted against. */
		base?: string;
		/** Codes selectable as a base; the picker is hidden when empty. */
		bases?: string[];
		/** Feed timestamp shown in the section meta line. */
		lastUpdated?: string;
		/** Show base per unit of currency instead of units per base. */
		invertRates?: boolean;
		/** Max decimals for mid-sized rates. */
		ratePrecision?: number;
		/** Fetches rates for a newly picked base — override in stories/tests. */
		loadRates?: (base: string) => Promise<{ rates: CurrencyRate[]; lastUpdated: string }>;
	}

	let {
		rates,
		base = 'USD',
		bases = [],
		lastUpdated = '',
		invertRates = false,
		ratePrecision = 4,
		loadRates = fetchExchangeRates
	}: Props = $props();

	let query = $state('');
	let loading = $state(false);
	let loadError = $state('');
	/** Rates loaded for a picked base; null means the props are current. */
	let loaded = $state<{ base: string; rates: CurrencyRate[]; lastUpdated: string } | null>(null);

	const currentBase = $derived(loaded?.base ?? base);
	const currentRates = $derived(loaded?.rates ?? rates);
	const currentUpdated = $derived(loaded?.lastUpdated ?? lastUpdated);

	async function switchBase(next: string) {
		loading = true;
		loadError = '';
		try {
			const res = await loadRates(next);
			loaded = { base: next, rates: res.rates, lastUpdated: res.lastUpdated };
		} catch {
			loadError = `failed to load ${next} rates`;
		} finally {
			loading = false;
		}
	}

	const q = $derived(query.trim().toLowerCase());
	const rows = $derived(
		currentRates.map(({ code, name, rate }) => ({
			code,
			name,
			rateFmt: fmtRate(invertRates ? (rate === 0 ? 0 : 1 / rate) : rate, ratePrecision)
		}))
	);
	const filtered = $derived(
		q ? rows.filter((r) => r.code.toLowerCase().includes(q) || r.name.toLowerCase().includes(q)) : rows
	);
	const rateLabel = $derived(
		invertRates ? `${currentBase} per 1 unit of currency` : `units per 1 ${currentBase}`
	);
</script>

<section class="flex flex-col gap-2">
	<div class="flex flex-wrap items-baseline gap-2.5">
		<h2 class="text-[13px] font-bold tracking-[1px] uppercase">exchange</h2>
		<span class="text-[11px] text-muted">
			/exchange/*.json · {rateLabel}{#if currentUpdated}&nbsp;· updated {currentUpdated}{/if}
		</span>
	</div>
	<div class="flex max-w-full flex-wrap items-center gap-2.5">
		<input
			type="text"
			placeholder="filter by code or name…"
			bind:value={query}
			class="w-[280px] max-w-full rounded border border-line bg-white px-2.5 py-[7px] font-mono text-[12.5px] text-ink focus:border-accent focus:outline-none"
		/>
		{#if bases.length > 0}
			<label class="flex items-center gap-2 text-[11px] text-muted">
				base
				<select
					value={currentBase}
					onchange={(e) => switchBase(e.currentTarget.value)}
					disabled={loading}
					class="rounded border border-line bg-white px-2 py-[7px] font-mono text-[12.5px] text-ink focus:border-accent focus:outline-none disabled:opacity-50"
				>
					{#each bases as code (code)}
						<option value={code}>{code}</option>
					{/each}
				</select>
			</label>
		{/if}
		{#if loadError}
			<span class="text-[11px] text-muted">{loadError}</span>
		{/if}
	</div>
	<table class="w-full border-collapse text-[12.5px]">
		<thead>
			<tr class="text-left text-[11px] text-muted">
				<th class="w-[70px] border-b border-line pt-1 pr-2 pb-1.5 font-normal">code</th>
				<th class="border-b border-line px-2 pt-1 pb-1.5 font-normal">currency</th>
				<th class="border-b border-line pt-1 pb-1.5 pl-2 text-right font-normal">rate</th>
			</tr>
		</thead>
		<tbody>
			{#each filtered as row (row.code)}
				<tr class="border-b border-line-soft hover:bg-hover">
					<td class="py-[5px] pr-2 font-semibold">{row.code}</td>
					<td class="px-2 py-[5px] text-body">{row.name}</td>
					<td class="py-[5px] pl-2 text-right">{row.rateFmt}</td>
				</tr>
			{/each}
		</tbody>
	</table>
	{#if filtered.length === 0}
		<div class="py-3.5 text-muted">no currencies match "{query}"</div>
	{/if}
	<div class="pt-1 text-[11px] text-muted">{filtered.length} of {rows.length} currencies shown</div>
</section>
