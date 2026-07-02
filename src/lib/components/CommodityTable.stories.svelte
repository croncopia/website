<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect } from 'storybook/test';
	import CommodityTable from './CommodityTable.svelte';
	import { dummyMarketData } from '$lib/data';

	const { Story } = defineMeta({
		title: 'Components/CommodityTable',
		component: CommodityTable
	});
</script>

<Story
	name="Energy"
	args={{
		title: 'energy',
		pathLabel: '/energy/*.json',
		series: dummyMarketData.energy,
		lastUpdated: '2026-07-02 06:00 UTC'
	}}
	play={async ({ canvas }) => {
		await expect(canvas.getByRole('heading', { name: 'energy' })).toBeInTheDocument();
		await expect(
			canvas.getByText(`/energy/*.json · ${dummyMarketData.energy.length} series`, {
				exact: false
			})
		).toBeInTheDocument();
		await expect(canvas.getByText('updated 2026-07-02 06:00 UTC', { exact: false })).toBeInTheDocument();
		// prices are formatted to two decimals and the row tooltip carries the endpoint
		await expect(canvas.getByText('74.32')).toBeInTheDocument();
		await expect(canvas.getByText('Brent Crude')).toHaveAttribute(
			'title',
			'energy/brent_crude.json'
		);
	}}
/>

<Story
	name="Metals"
	args={{ title: 'metals', pathLabel: '/metals/*.json', series: dummyMarketData.metals }}
	play={async ({ canvas }) => {
		await expect(canvas.getByText('2,384.60')).toBeInTheDocument();
		await expect(canvas.getAllByText('USD/ozt')).toHaveLength(7);
	}}
/>

<Story
	name="Empty"
	args={{ title: 'energy', pathLabel: '/energy/*.json', series: [] }}
	play={async ({ canvas }) => {
		await expect(canvas.getByText('/energy/*.json · 0 series')).toBeInTheDocument();
	}}
/>
