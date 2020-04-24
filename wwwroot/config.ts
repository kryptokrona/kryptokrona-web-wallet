let global : any = typeof window !== 'undefined' ? window : self;
global.config = {
    //apiUrl: typeof window !== 'undefined' && window.location ? window.location.href.substr(0, window.location.href.lastIndexOf('/') + 1) + 'api/' : 'https://wallet.kryptokrona.com/api/',
    apiUrl: 'http://wallet.kryptokrona.se/api/', //temporary testing front end
	mainnetExplorerUrl: "http://explorer.kryptokrona.com",
    coinUnitPlaces: 2,
    coinDisplayUnitPlaces: 2,
	txMinConfirms: 60,         
	txCoinbaseMinConfirms: 120, 
	addressPrefix: 2239254,
	integratedAddressPrefix: 0,
    addressPrefixTestnet: 0,
    integratedAddressPrefixTestnet: 0,
    subAddressPrefix: 0,
    subAddressPrefixTestnet: 0,
    feePerKB: new JSBigInt('100'),//20^10 - for testnet its not used, as fee is dynamic.
    dustThreshold: new JSBigInt('1'),//10^10 used for choosing outputs/change - we decompose all the way down if the receiver wants now regardless of threshold
	defaultMixin: 7, // default value mixins
	idleTimeout: 30,
	idleWarningDuration: 20,
	coinSymbol: 'XKR',
	coinName: 'kryptokrona',
	coinUriPrefix: 'kryptokrona:',
	avgBlockTime: 90,
	maxBlockNumber: 500000000,
};