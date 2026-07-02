/** "2026-07-02T20:02:11.812Z" → "2026-07-02 20:02 UTC" */
export function fmtTimestamp(iso: string): string {
	return iso ? `${iso.slice(0, 10)} ${iso.slice(11, 16)} UTC` : '';
}

/** Commodity prices: always two decimals with thousands separators. */
export function fmtPrice(value: number): string {
	return value.toLocaleString('en-US', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	});
}

/**
 * Exchange rates: large rates round to one decimal, tiny rates keep three
 * significant figures, everything else shows up to `precision` decimals.
 */
export function fmtRate(value: number, precision = 4): string {
	if (value >= 1000) return value.toLocaleString('en-US', { maximumFractionDigits: 1 });
	if (value < 0.01) return value.toPrecision(3);
	return value.toLocaleString('en-US', {
		minimumFractionDigits: 2,
		maximumFractionDigits: precision
	});
}
