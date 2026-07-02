<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect } from 'storybook/test';
	import ExchangeRates from './ExchangeRates.svelte';
	import { dummyMarketData } from '$lib/data';

	// stub loader so stories never touch the network
	const eurRates = [
		{ code: 'EUR', name: 'Euro', rate: 1 },
		{ code: 'GBP', name: 'Pound Sterling', rate: 0.8599 },
		{ code: 'USD', name: 'US Dollar', rate: 1.096 }
	];
	const loadRates = async (base: string) => ({
		rates: base === 'EUR' ? eurRates : dummyMarketData.fx,
		lastUpdated: '2026-07-02 21:00 UTC'
	});

	const { Story } = defineMeta({
		title: 'Components/ExchangeRates',
		component: ExchangeRates,
		args: {
			rates: dummyMarketData.fx,
			base: 'USD',
			bases: ['USD', 'EUR', 'GBP', 'JPY'],
			lastUpdated: '2026-07-02 06:00 UTC',
			loadRates
		}
	});

	const total = dummyMarketData.fx.length;
</script>

<Story
	name="Default"
	play={async ({ canvas }) => {
		await expect(canvas.getByText('units per 1 USD', { exact: false })).toBeInTheDocument();
		await expect(canvas.getByText('updated 2026-07-02 06:00 UTC', { exact: false })).toBeInTheDocument();
		await expect(canvas.getByText('United States Dollar')).toBeInTheDocument();
		await expect(canvas.getByText(`${total} of ${total} currencies shown`)).toBeInTheDocument();
	}}
/>

<Story
	name="Filtering"
	play={async ({ canvas, userEvent }) => {
		const input = canvas.getByPlaceholderText('filter by code or name…');
		await userEvent.type(input, 'yen');
		await expect(canvas.getByText('Japanese Yen')).toBeInTheDocument();
		await expect(canvas.queryByText('British Pound')).not.toBeInTheDocument();
		await expect(canvas.getByText(`1 of ${total} currencies shown`)).toBeInTheDocument();
		// matches on code as well as name
		await userEvent.clear(input);
		await userEvent.type(input, 'GBP');
		await expect(canvas.getByText('British Pound')).toBeInTheDocument();
	}}
/>

<Story
	name="No results"
	play={async ({ canvas, userEvent }) => {
		const input = canvas.getByPlaceholderText('filter by code or name…');
		await userEvent.type(input, 'zzzz');
		await expect(canvas.getByText('no currencies match "zzzz"')).toBeInTheDocument();
		await expect(canvas.getByText(`0 of ${total} currencies shown`)).toBeInTheDocument();
	}}
/>

<Story
	name="Switching base"
	play={async ({ canvas, userEvent }) => {
		await userEvent.selectOptions(canvas.getByRole('combobox'), 'EUR');
		await expect(canvas.getByText('units per 1 EUR', { exact: false })).toBeInTheDocument();
		await expect(canvas.getByText('Pound Sterling')).toBeInTheDocument();
		await expect(canvas.getByText('updated 2026-07-02 21:00 UTC', { exact: false })).toBeInTheDocument();
		await expect(canvas.getByText('3 of 3 currencies shown')).toBeInTheDocument();
	}}
/>

<Story
	name="Base load failure"
	args={{
		loadRates: async () => {
			throw new Error('boom');
		}
	}}
	play={async ({ canvas, userEvent }) => {
		await userEvent.selectOptions(canvas.getByRole('combobox'), 'JPY');
		await expect(canvas.getByText('failed to load JPY rates')).toBeInTheDocument();
		// keeps showing the previous rates
		await expect(canvas.getByText(`${total} of ${total} currencies shown`)).toBeInTheDocument();
	}}
/>

<Story
	name="Inverted rates"
	args={{ invertRates: true, ratePrecision: 4 }}
	play={async ({ canvas }) => {
		await expect(canvas.getByText('USD per 1 unit of currency', { exact: false })).toBeInTheDocument();
	}}
/>
