import type { CommoditySeries, CurrencyRate, MarketData, MarketDataProvider } from './types';

type CommodityTuple = [slug: string, name: string, price: number, unit: string];
type FxTuple = [code: string, name: string, rate: number];

// Slugs mirror the JSON endpoint filenames (including "steal" and "colbalt",
// which are spelled that way in the feed).
const energyData: CommodityTuple[] = [
	['brent_crude', 'Brent Crude', 74.32, 'USD/bbl'],
	['wti_crude', 'WTI Crude', 70.18, 'USD/bbl'],
	['natural_gas_henry_hub', 'Natural Gas (Henry Hub)', 2.87, 'USD/MMBtu'],
	['natural_gas_ttf', 'Natural Gas (TTF)', 33.45, 'EUR/MWh'],
	['natural_gas_nbp', 'Natural Gas (NBP)', 81.6, 'GBp/thm'],
	['lng_jkm', 'LNG (JKM)', 11.92, 'USD/MMBtu'],
	['gasoline', 'Gasoline', 2.14, 'USD/gal'],
	['diesel', 'Diesel', 2.41, 'USD/gal'],
	['heating_oil', 'Heating Oil', 2.28, 'USD/gal'],
	['jet_fuel', 'Jet Fuel', 2.06, 'USD/gal'],
	['coal_newcastle', 'Coal (Newcastle)', 133.5, 'USD/t'],
	['coal_capp', 'Coal (CAPP)', 77.25, 'USD/t'],
	['coal_coking', 'Coal (Coking)', 246.0, 'USD/t'],
	['coal_generic', 'Coal (Generic)', 104.8, 'USD/t'],
	['marine_vlsfo', 'Marine VLSFO', 562.0, 'USD/t'],
	['marine_hfo_380', 'Marine HFO 380', 438.5, 'USD/t'],
	['marine_mgo_05s', 'Marine MGO 0.5S', 621.0, 'USD/t']
];

const metalsData: CommodityTuple[] = [
	['gold', 'Gold', 2384.6, 'USD/ozt'],
	['silver', 'Silver', 28.42, 'USD/ozt'],
	['platinum', 'Platinum', 986.0, 'USD/ozt'],
	['palladium', 'Palladium', 1021.5, 'USD/ozt'],
	['rhodium', 'Rhodium', 4650.0, 'USD/ozt'],
	['iridium', 'Iridium', 4890.0, 'USD/ozt'],
	['ruthenium', 'Ruthenium', 465.0, 'USD/ozt'],
	['copper', 'Copper', 9448.0, 'USD/t'],
	['aluminum', 'Aluminum', 2341.0, 'USD/t'],
	['zinc', 'Zinc', 2779.5, 'USD/t'],
	['nickel', 'Nickel', 17255.0, 'USD/t'],
	['lead', 'Lead', 2064.0, 'USD/t'],
	['tin', 'Tin', 32410.0, 'USD/t'],
	['iron', 'Iron Ore', 108.2, 'USD/t'],
	['steal', 'Steel (HRC)', 542.0, 'USD/t'],
	['lithium', 'Lithium Carbonate', 13480.0, 'USD/t'],
	['colbalt', 'Cobalt', 27850.0, 'USD/t'],
	['molybdenum', 'Molybdenum', 41.8, 'USD/kg'],
	['uranium', 'Uranium (U3O8)', 84.25, 'USD/lb'],
	['gallium', 'Gallium', 426.0, 'USD/kg'],
	['indium', 'Indium', 338.0, 'USD/kg'],
	['tellurium', 'Tellurium', 81.5, 'USD/kg'],
	['neodymium', 'Neodymium', 61.9, 'USD/kg']
];

// prettier-ignore
const fxData: FxTuple[] = [
	['AED', 'UAE Dirham', 3.6725], ['AFN', 'Afghan Afghani', 70.85], ['ALL', 'Albanian Lek', 91.42],
	['AMD', 'Armenian Dram', 387.6], ['ANG', 'Netherlands Antillean Guilder', 1.79], ['AOA', 'Angolan Kwanza', 885.4],
	['ARS', 'Argentine Peso', 1182.5], ['AUD', 'Australian Dollar', 1.5124], ['AWG', 'Aruban Florin', 1.79],
	['AZN', 'Azerbaijani Manat', 1.7], ['BAM', 'Bosnian Convertible Mark', 1.7842], ['BBD', 'Barbadian Dollar', 2.0],
	['BDT', 'Bangladeshi Taka', 119.35], ['BGN', 'Bulgarian Lev', 1.7845], ['BHD', 'Bahraini Dinar', 0.376],
	['BIF', 'Burundian Franc', 2965.0], ['BMD', 'Bermudian Dollar', 1.0], ['BND', 'Brunei Dollar', 1.3412],
	['BOB', 'Bolivian Boliviano', 6.91], ['BRL', 'Brazilian Real', 5.482], ['BSD', 'Bahamian Dollar', 1.0],
	['BTN', 'Bhutanese Ngultrum', 85.62], ['BWP', 'Botswana Pula', 13.65], ['BYN', 'Belarusian Ruble', 3.27],
	['BYR', 'Belarusian Ruble (old)', 32700.0], ['BZD', 'Belize Dollar', 2.0], ['CAD', 'Canadian Dollar', 1.3642],
	['CDF', 'Congolese Franc', 2845.0], ['CHF', 'Swiss Franc', 0.8892], ['CLF', 'Chilean UF', 0.0243],
	['CLP', 'Chilean Peso', 935.8], ['CNH', 'Chinese Yuan (Offshore)', 7.2485], ['CNY', 'Chinese Yuan', 7.2412],
	['COP', 'Colombian Peso', 4128.0], ['CRC', 'Costa Rican Colón', 512.4], ['CUC', 'Cuban Convertible Peso', 1.0],
	['CUP', 'Cuban Peso', 24.0], ['CVE', 'Cape Verdean Escudo', 100.6], ['CZK', 'Czech Koruna', 22.94],
	['DJF', 'Djiboutian Franc', 177.72], ['DKK', 'Danish Krone', 6.808], ['DOP', 'Dominican Peso', 59.85],
	['DZD', 'Algerian Dinar', 134.2], ['EGP', 'Egyptian Pound', 48.35], ['ERN', 'Eritrean Nakfa', 15.0],
	['ETB', 'Ethiopian Birr', 121.8], ['EUR', 'Euro', 0.9124], ['FJD', 'Fijian Dollar', 2.245],
	['FKP', 'Falkland Islands Pound', 0.7842], ['GBP', 'British Pound', 0.7845], ['GEL', 'Georgian Lari', 2.735],
	['GGP', 'Guernsey Pound', 0.7845], ['GHS', 'Ghanaian Cedi', 14.85], ['GIP', 'Gibraltar Pound', 0.7845],
	['GMD', 'Gambian Dalasi', 71.5], ['GNF', 'Guinean Franc', 8620.0], ['GTQ', 'Guatemalan Quetzal', 7.72],
	['GYD', 'Guyanese Dollar', 209.4], ['HKD', 'Hong Kong Dollar', 7.8102], ['HNL', 'Honduran Lempira', 25.42],
	['HRK', 'Croatian Kuna', 6.875], ['HTG', 'Haitian Gourde', 131.6], ['HUF', 'Hungarian Forint', 362.4],
	['IDR', 'Indonesian Rupiah', 16240.0], ['ILS', 'Israeli New Shekel', 3.652], ['IMP', 'Isle of Man Pound', 0.7845],
	['INR', 'Indian Rupee', 85.64], ['IQD', 'Iraqi Dinar', 1310.0], ['IRR', 'Iranian Rial', 42050.0],
	['ISK', 'Icelandic Króna', 138.5], ['JEP', 'Jersey Pound', 0.7845], ['JMD', 'Jamaican Dollar', 157.2],
	['JOD', 'Jordanian Dinar', 0.709], ['JPY', 'Japanese Yen', 154.85], ['KES', 'Kenyan Shilling', 129.4],
	['KGS', 'Kyrgyzstani Som', 87.45], ['KHR', 'Cambodian Riel', 4085.0], ['KMF', 'Comorian Franc', 448.9],
	['KPW', 'North Korean Won', 900.0], ['KRW', 'South Korean Won', 1362.5], ['KWD', 'Kuwaiti Dinar', 0.3072],
	['KYD', 'Cayman Islands Dollar', 0.833], ['KZT', 'Kazakhstani Tenge', 478.6], ['LAK', 'Lao Kip', 21850.0],
	['LBP', 'Lebanese Pound', 89500.0], ['LKR', 'Sri Lankan Rupee', 298.4], ['LRD', 'Liberian Dollar', 192.5],
	['LSL', 'Lesotho Loti', 18.12], ['LTL', 'Lithuanian Litas', 3.1506], ['LVL', 'Latvian Lats', 0.6414],
	['LYD', 'Libyan Dinar', 4.865], ['MAD', 'Moroccan Dirham', 9.925], ['MDL', 'Moldovan Leu', 17.68],
	['MGA', 'Malagasy Ariary', 4620.0], ['MKD', 'Macedonian Denar', 56.15], ['MMK', 'Myanmar Kyat', 2098.0],
	['MNT', 'Mongolian Tögrög', 3425.0], ['MOP', 'Macanese Pataca', 8.045], ['MRO', 'Mauritanian Ouguiya (old)', 396.5],
	['MRU', 'Mauritanian Ouguiya', 39.65], ['MUR', 'Mauritian Rupee', 46.35], ['MVR', 'Maldivian Rufiyaa', 15.42],
	['MWK', 'Malawian Kwacha', 1735.0], ['MXN', 'Mexican Peso', 18.42], ['MYR', 'Malaysian Ringgit', 4.425],
	['MZN', 'Mozambican Metical', 63.85], ['NAD', 'Namibian Dollar', 18.12], ['NGN', 'Nigerian Naira', 1542.0],
	['NIO', 'Nicaraguan Córdoba', 36.82], ['NOK', 'Norwegian Krone', 10.685], ['NPR', 'Nepalese Rupee', 137.0],
	['NZD', 'New Zealand Dollar', 1.6512], ['OMR', 'Omani Rial', 0.3845], ['PAB', 'Panamanian Balboa', 1.0],
	['PEN', 'Peruvian Sol', 3.742], ['PGK', 'Papua New Guinean Kina', 3.925], ['PHP', 'Philippine Peso', 58.45],
	['PKR', 'Pakistani Rupee', 278.6], ['PLN', 'Polish Złoty', 3.892], ['PYG', 'Paraguayan Guaraní', 7485.0],
	['QAR', 'Qatari Riyal', 3.641], ['RON', 'Romanian Leu', 4.542], ['RSD', 'Serbian Dinar', 106.85],
	['RUB', 'Russian Ruble', 89.45], ['RWF', 'Rwandan Franc', 1362.0], ['SAR', 'Saudi Riyal', 3.7502],
	['SBD', 'Solomon Islands Dollar', 8.42], ['SCR', 'Seychellois Rupee', 14.25], ['SDG', 'Sudanese Pound', 601.5],
	['SEK', 'Swedish Krona', 10.425], ['SGD', 'Singapore Dollar', 1.3418], ['SHP', 'Saint Helena Pound', 0.7845],
	['SLE', 'Sierra Leonean Leone', 22.65], ['SLL', 'Sierra Leonean Leone (old)', 22650.0], ['SOS', 'Somali Shilling', 571.5],
	['SRD', 'Surinamese Dollar', 34.85], ['SSP', 'South Sudanese Pound', 4520.0], ['STD', 'São Tomé Dobra (old)', 22350.0],
	['STN', 'São Tomé Dobra', 22.35], ['SVC', 'Salvadoran Colón', 8.75], ['SYP', 'Syrian Pound', 13002.0],
	['SZL', 'Swazi Lilangeni', 18.12], ['THB', 'Thai Baht', 34.25], ['TJS', 'Tajikistani Somoni', 10.68],
	['TMT', 'Turkmenistani Manat', 3.5], ['TND', 'Tunisian Dinar', 3.115], ['TOP', 'Tongan Paʻanga', 2.365],
	['TRY', 'Turkish Lira', 38.65], ['TTD', 'Trinidad and Tobago Dollar', 6.785], ['TWD', 'New Taiwan Dollar', 32.15],
	['TZS', 'Tanzanian Shilling', 2645.0], ['UAH', 'Ukrainian Hryvnia', 41.35], ['UGX', 'Ugandan Shilling', 3685.0],
	['USD', 'United States Dollar', 1.0], ['UYU', 'Uruguayan Peso', 42.85], ['UZS', 'Uzbekistani Som', 12850.0],
	['VEF', 'Venezuelan Bolívar (old)', 3654200.0], ['VES', 'Venezuelan Bolívar', 64.25], ['VND', 'Vietnamese Đồng', 25485.0],
	['VUV', 'Vanuatu Vatu', 119.5], ['WST', 'Samoan Tālā', 2.785], ['XAF', 'Central African CFA Franc', 598.5],
	['XAG', 'Silver (troy oz)', 0.0352], ['XAU', 'Gold (troy oz)', 0.000419], ['XCD', 'East Caribbean Dollar', 2.7],
	['XCG', 'Caribbean Guilder', 1.79], ['XDR', 'IMF Special Drawing Rights', 0.7562], ['XOF', 'West African CFA Franc', 598.5],
	['XPD', 'Palladium (troy oz)', 0.000979], ['XPF', 'CFP Franc', 108.9], ['XPT', 'Platinum (troy oz)', 0.001014],
	['YER', 'Yemeni Rial', 245.8], ['ZAR', 'South African Rand', 18.14], ['ZMK', 'Zambian Kwacha (old)', 26450.0],
	['ZMW', 'Zambian Kwacha', 26.45], ['ZWG', 'Zimbabwe Gold', 13.85], ['ZWL', 'Zimbabwean Dollar (old)', 32180.0]
];

function toSeries(category: string, tuples: CommodityTuple[]): CommoditySeries[] {
	return tuples.map(([slug, name, price, unit]) => ({
		file: `${category}/${slug}.json`,
		name,
		price,
		unit
	}));
}

export const dummyMarketData: MarketData = {
	energy: toSeries('energy', energyData),
	metals: toSeries('metals', metalsData),
	commoditiesUpdated: '2026-07-02 06:00 UTC',
	fx: fxData.map(([code, name, rate]) => ({ code, name, rate })),
	fxBase: 'USD',
	fxBases: fxData.map(([code]) => code),
	fxUpdated: '2026-07-02 06:00 UTC',
	dummyNote: 'values below are dummy data'
};

export const dummyProvider: MarketDataProvider = {
	getMarketData: async () => dummyMarketData
};
