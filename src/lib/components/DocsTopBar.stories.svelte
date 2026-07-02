<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect } from 'storybook/test';
	import DocsTopBar from './DocsTopBar.svelte';

	const { Story } = defineMeta({
		title: 'Components/DocsTopBar',
		component: DocsTopBar
	});
</script>

<Story
	name="Default"
	play={async ({ canvas }) => {
		await expect(canvas.getByRole('link', { name: 'croncopia' })).toHaveAttribute('href', '/');
		await expect(canvas.getByText('/ docs')).toBeInTheDocument();
		await expect(canvas.getByRole('link', { name: /data/ })).toHaveAttribute('href', '/');
		await expect(canvas.getByRole('link', { name: /github/ })).toBeInTheDocument();
	}}
/>

<Story
	name="Custom section"
	args={{ section: 'changelog' }}
	play={async ({ canvas }) => {
		await expect(canvas.getByText('/ changelog')).toBeInTheDocument();
	}}
/>
