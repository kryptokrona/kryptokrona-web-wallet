"use strict";
var global = typeof window !== 'undefined' ? window : self;
global.config = {
    //apiUrl: typeof window !== 'undefined' && window.location ? window.location.href.substr(0, window.location.href.lastIndexOf('/') + 1) + 'api/' : 'https://wallet.kryptokrona.com/api/',
    apiUrl: 'http://wallet.kryptokrona.se/',
    mainnetExplorerUrl: "http://explorer.kryptokrona.se",
    coinUnitPlaces: 2,
    coinDisplayUnitPlaces: 2,
    txMinConfirms: 20,
    txCoinbaseMinConfirms: 20,
    addressPrefix: 2239254,
    integratedAddressPrefix: 2239254,
    feePerKB: new JSBigInt('0'),
    dustThreshold: new JSBigInt('1000000'),
    defaultMixin: 3,
    idleTimeout: 30,
    idleWarningDuration: 20,
    coinSymbol: 'XKR',
    coinName: 'Kryptokrona',
    coinUriPrefix: 'kryptokrona:',
    avgBlockTime: 90,
    maxBlockNumber: 500000000,
};
