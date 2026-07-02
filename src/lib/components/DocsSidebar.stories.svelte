<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect } from 'storybook/test';
	import DocsSidebar from './DocsSidebar.svelte';
	import { docGroups } from '$lib/docs';

	const { Story } = defineMeta({
		title: 'Components/DocsSidebar',
		component: DocsSidebar,
		args: {
			groups: docGroups,
			activeSlug: 'intro'
		}
	});
</script>

<Story
	name="Default"
	play={async ({ canvas }) => {
		await expect(canvas.getByText('Getting Started')).toBeInTheDocument();
		await expect(canvas.getByText('Exchange Rates')).toBeInTheDocument();
		await expect(canvas.getByText('Commodity Prices')).toBeInTheDocument();
		const active = canvas.getByRole('link', { current: 'page' });
		await expect(active).toHaveTextContent('Introduction');
		await expect(active).toHaveAttribute('href', '/docs/intro');
	}}
/>

<Story
	name="Exchange page active"
	args={{ activeSlug: 'exchange' }}
	play={async ({ canvas }) => {
		await expect(canvas.getByRole('link', { current: 'page' })).toHaveTextContent(
			'Get exchange rates'
		);
	}}
/>
