<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, waitFor } from 'storybook/test';
	import CodePanel from './CodePanel.svelte';

	// stub loader so stories never touch the network
	const loadExample = async (id: string) => ({
		url: `https://croncopia.com/api/metals/${id}.json`,
		response: `{\n  "id": "${id}",\n  "base": "USD"\n}`
	});

	const longResponse = JSON.stringify(
		Object.fromEntries(Array.from({ length: 60 }, (_, i) => [`key_${i}`, i])),
		null,
		2
	);

	// syntax highlighting splits code into spans, so assert on <pre> textContent
	const preText = (root: HTMLElement, index: number) =>
		root.querySelectorAll('pre')[index]?.textContent ?? '';

	const { Story } = defineMeta({
		title: 'Components/CodePanel',
		component: CodePanel,
		args: {
			url: 'https://croncopia.com/api/metals/gold.json',
			response: '{\n  "base": "USD",\n  "price": 4115.44\n}',
			ids: ['gold', 'silver', 'copper'],
			selectedId: 'gold',
			loadExample
		}
	});
</script>

<Story
	name="Default"
	play={async ({ canvas, canvasElement }) => {
		await expect(preText(canvasElement, 0)).toContain(
			'curl https://croncopia.com/api/metals/gold.json'
		);
		await expect(preText(canvasElement, 1)).toContain('"base": "USD"');
		// highlighting produced tokens
		await expect(canvasElement.querySelector('.hljs-attr')).toBeTruthy();
		await expect(canvas.getAllByRole('button', { name: 'copy' })).toHaveLength(2);
		await expect(canvas.getByText('no auth · no keys · no rate limits')).toBeInTheDocument();
	}}
/>

<Story
	name="Switching id"
	play={async ({ canvas, canvasElement, userEvent }) => {
		await userEvent.selectOptions(canvas.getByRole('combobox', { name: 'example id' }), 'silver');
		await waitFor(() =>
			expect(preText(canvasElement, 0)).toContain(
				'curl https://croncopia.com/api/metals/silver.json'
			)
		);
		await expect(preText(canvasElement, 1)).toContain('"id": "silver"');
	}}
/>

<Story
	name="Switching language"
	play={async ({ canvas, canvasElement, userEvent }) => {
		const select = canvas.getByRole('combobox', { name: 'request language' });
		await userEvent.selectOptions(select, 'python');
		await waitFor(() => expect(preText(canvasElement, 0)).toContain('import requests'));
		await userEvent.selectOptions(select, 'go');
		await waitFor(() => expect(preText(canvasElement, 0)).toContain('http.Get'));
	}}
/>

<Story
	name="Copy to clipboard"
	play={async ({ canvas, userEvent }) => {
		const [copyRequest] = canvas.getAllByRole('button', { name: 'copy' });
		await userEvent.click(copyRequest);
		await expect(await canvas.findByRole('button', { name: 'copied' })).toBeInTheDocument();
	}}
/>

<Story
	name="Long response clipping"
	args={{ response: longResponse }}
	play={async ({ canvas, userEvent }) => {
		const viewAll = canvas.getByRole('button', { name: /view all · 62 lines/ });
		await userEvent.click(viewAll);
		await expect(canvas.queryByRole('button', { name: /view all/ })).not.toBeInTheDocument();
		await expect(canvas.getByRole('button', { name: 'show less' })).toBeInTheDocument();
		await userEvent.click(canvas.getByRole('button', { name: 'show less' }));
		await expect(canvas.getByRole('button', { name: /view all/ })).toBeInTheDocument();
	}}
/>

<Story
	name="Id load failure"
	args={{
		loadExample: async () => {
			throw new Error('boom');
		}
	}}
	play={async ({ canvas, canvasElement, userEvent }) => {
		await userEvent.selectOptions(canvas.getByRole('combobox', { name: 'example id' }), 'copper');
		await expect(await canvas.findByText('failed to load copper')).toBeInTheDocument();
		// keeps showing the previous example
		await expect(preText(canvasElement, 1)).toContain('"price": 4115.44');
	}}
/>

<Story
	name="Without response"
	args={{ response: '', ids: [] }}
	play={async ({ canvas }) => {
		await expect(canvas.queryByText('response')).not.toBeInTheDocument();
		await expect(canvas.getAllByRole('button', { name: 'copy' })).toHaveLength(1);
	}}
/>
