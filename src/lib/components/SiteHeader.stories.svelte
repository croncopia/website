<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect } from 'storybook/test';
	import SiteHeader from './SiteHeader.svelte';

	const { Story } = defineMeta({
		title: 'Components/SiteHeader',
		component: SiteHeader
	});
</script>

<Story
	name="Default"
	play={async ({ canvas }) => {
		await expect(canvas.getByRole('heading', { level: 1, name: 'croncopia' })).toBeInTheDocument();
		await expect(canvas.getByRole('link', { name: /github repo/ })).toHaveAttribute(
			'href',
			'https://github.com/croncopia'
		);
		await expect(canvas.getByRole('link', { name: 'docs' })).toHaveAttribute('href', '/docs');
		await expect(canvas.getByText(/curl https:\/\/croncopia\.com/)).toBeInTheDocument();
	}}
/>

<Story
	name="With dummy data note"
	args={{ dummyNote: 'exchange rates are dummy data' }}
	play={async ({ canvas }) => {
		await expect(canvas.getByText('exchange rates are dummy data')).toBeInTheDocument();
	}}
/>

<Story
	name="Custom endpoint and repo"
	args={{
		repoUrl: 'https://github.com/example/croncopia',
		exampleEndpoint: 'https://croncopia.com/exchange/eur.json'
	}}
	play={async ({ canvas }) => {
		await expect(canvas.getByText('curl https://croncopia.com/exchange/eur.json')).toBeInTheDocument();
	}}
/>
