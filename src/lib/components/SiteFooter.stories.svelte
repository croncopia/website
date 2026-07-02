<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect } from 'storybook/test';
	import SiteFooter from './SiteFooter.svelte';

	const { Story } = defineMeta({
		title: 'Components/SiteFooter',
		component: SiteFooter
	});
</script>

<Story
	name="Default"
	play={async ({ canvas }) => {
		await expect(canvas.getByText('croncopia · public domain data')).toBeInTheDocument();
		await expect(canvas.getByText('updated hourly via github actions')).toBeInTheDocument();
	}}
/>
