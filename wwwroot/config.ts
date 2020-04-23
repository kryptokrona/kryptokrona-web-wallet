let global : any = typeof window !== 'undefined' ? window : self;
global.config = {
    //apiUrl: typeof window !== 'undefined' && window.location ? window.location.href.substr(0, window.location.href.lastIndexOf('/') + 1) + 'api/' : 'https://wallet.kryptokrona.com/api/',
    apiUrl: 'https://pool.kryptokrona.se:11898', //temporary testing front end
	mainnetExplorerUrl: "http://explorer.kryptokrona.com",
    coinUnitPlaces: 2,
    coinDisplayUnitPlaces: 2,
	txMinConfirms: 20,         
	txCoinbaseMinConfirms: 20, 
	addressPrefix: 2239254,
	integratedAddressPrefix: 2239254,
	feePerKB: new JSBigInt('0'), 
	dustThreshold: new JSBigInt('1000000'),//used for choosing outputs/change - we decompose all the way down if the receiver wants now regardless of threshold
	defaultMixin: 3, // default value mixins
	idleTimeout: 30,
	idleWarningDuration: 20,
	coinSymbol: 'XKR',
	coinName: 'kryptokrona',
	coinUriPrefix: 'kryptokrona:',
	avgBlockTime: 90,
	maxBlockNumber: 500000000,
};