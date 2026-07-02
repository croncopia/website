<script lang="ts">
	import CommodityTable from '$lib/components/CommodityTable.svelte';
	import ExchangeRates from '$lib/components/ExchangeRates.svelte';
	import SiteFooter from '$lib/components/SiteFooter.svelte';
	import SiteHeader from '$lib/components/SiteHeader.svelte';

	let { data } = $props();
	const market = $derived(data.market);
</script>

<svelte:head>
	<title>croncopia — free, open source data</title>
	<meta
		name="description"
		content="Free, open exchange rates and commodity prices served as plain JSON. No keys, no rate limits."
	/>
</svelte:head>

<div class="mx-auto max-w-[1040px] px-6 pt-12 pb-24">
	<SiteHeader dummyNote={market.dummyNote} />

	<div class="mb-12 grid grid-cols-[repeat(auto-fit,minmax(380px,1fr))] gap-10">
		<CommodityTable
			title="energy"
			pathLabel="/energy/*.json"
			series={market.energy}
			lastUpdated={market.commoditiesUpdated}
		/>
		<CommodityTable
			title="metals"
			pathLabel="/metals/*.json"
			series={market.metals}
			lastUpdated={market.commoditiesUpdated}
		/>
	</div>

	<ExchangeRates
		rates={market.fx}
		base={market.fxBase}
		bases={market.fxBases}
		lastUpdated={market.fxUpdated}
	/>

	<SiteFooter />
</div>
