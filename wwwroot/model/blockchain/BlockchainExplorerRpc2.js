/*
 * Copyright (c) 2018, Gnock
 * Copyright (c) 2018, The Masari Project
 * Copyright (c) 2018, The Plenteum Project
 *
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
define(["require", "exports", "../TransactionsExplorer", "../Transaction", "../MathUtil"], function (require, exports, TransactionsExplorer_1, Transaction_1, MathUtil_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var WalletWatchdog = /** @class */ (function () {
        function WalletWatchdog(wallet, explorer) {
            this.intervalMempool = 0;
            this.stopped = false;
            this.transactionsToProcess = [];
            this.intervalTransactionsProcess = 0;
            this.workerProcessingReady = false;
            this.workerProcessingWorking = false;
            this.workerCurrentProcessing = [];
            this.workerCountProcessed = 0;
            this.lastBlockLoading = -1;
            this.lastMaximumHeight = 0;
            this.wallet = wallet;
            this.explorer = explorer;
            this.initWorker();
            this.initMempool();
        }
        WalletWatchdog.prototype.initWorker = function () {
            var self = this;
            this.workerProcessing = new Worker('./workers/TransferProcessingEntrypoint.js');
            this.workerProcessing.onmessage = function (data) {
                var message = data.data;
                // console.log(message);
                if (message === 'ready') {
                    self.signalWalletUpdate();
                }
                else if (message === 'readyWallet') {
                    self.workerProcessingReady = true;
                }
                else if (message.type) {
                    if (message.type === 'processed') {
                        var transactions = message.transactions;
                        if (transactions.length > 0) {
                            for (var _i = 0, transactions_1 = transactions; _i < transactions_1.length; _i++) {
                                var tx = transactions_1[_i];
                                self.wallet.addNew(Transaction_1.Transaction.fromRaw(tx));
                            }
                            self.signalWalletUpdate();
                        }
                        if (self.workerCurrentProcessing.length > 0) {
                            var transactionHeight = self.workerCurrentProcessing[self.workerCurrentProcessing.length - 1].height;
                            if (typeof transactionHeight !== 'undefined')
                                self.wallet.lastHeight = transactionHeight;
                        }
                        self.workerProcessingWorking = false;
                    }
                }
            };
        };
        WalletWatchdog.prototype.signalWalletUpdate = function () {
            var self = this;
            this.lastBlockLoading = -1; //reset scanning
            this.workerProcessing.postMessage({
                type: 'initWallet',
                wallet: this.wallet.exportToRaw(true)
            });
            clearInterval(this.intervalTransactionsProcess);
            this.intervalTransactionsProcess = setInterval(function () {
                self.checkTransactionsInterval();
            }, this.wallet.options.readSpeed);
        };
        WalletWatchdog.prototype.initMempool = function () {
            var self = this;
            if (this.intervalMempool === 0) {
                this.intervalMempool = setInterval(function () {
                    self.checkMempool();
                }, 2 * 60 * 1000);
            }
            self.checkMempool();
        };
        WalletWatchdog.prototype.stop = function () {
            clearInterval(this.intervalTransactionsProcess);
            this.transactionsToProcess = [];
            clearInterval(this.intervalMempool);
            this.stopped = true;
        };
        WalletWatchdog.prototype.checkMempool = function () {
            var self = this;
            if (this.lastMaximumHeight === 0 || this.lastBlockLoading === -1 || (this.lastMaximumHeight - this.lastBlockLoading > 1)) { //only check memory pool if the user is up to date to ensure outs & ins will be found in the wallet
                return false;
            }
            this.wallet.txsMem = [];
            this.wallet.fusionTxs = [];
            this.explorer.getTransactionPool().then(function (data) {
                if (typeof data !== 'undefined')
                    for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                        var rawTx = data_1[_i];
                        var tx = TransactionsExplorer_1.TransactionsExplorer.parse(rawTx, self.wallet);
                        if (tx !== null) {
                            if (tx.isFusionTx()) {
                                self.wallet.fusionTxs.push(tx);
                            }
                            else {
                                self.wallet.txsMem.push(tx);
                            }
                        }
                    }
            }).catch(function () { });
            return true;
        };
        WalletWatchdog.prototype.terminateWorker = function () {
            this.workerProcessing.terminate();
            this.workerProcessingReady = false;
            this.workerCurrentProcessing = [];
            this.workerProcessingWorking = false;
            this.workerCountProcessed = 0;
        };
        WalletWatchdog.prototype.checkTransactions = function (rawTransactions) {
            for (var _i = 0, rawTransactions_1 = rawTransactions; _i < rawTransactions_1.length; _i++) {
                var rawTransaction = rawTransactions_1[_i];
                var height = rawTransaction.height;
                if (typeof height !== 'undefined') {
                    var transaction = TransactionsExplorer_1.TransactionsExplorer.parse(rawTransaction, this.wallet);
                    if (transaction !== null) {
                        this.wallet.addNew(transaction);
                    }
                    if (height - this.wallet.lastHeight >= 2) {
                        this.wallet.lastHeight = height - 1;
                    }
                }
            }
            if (this.transactionsToProcess.length == 0) {
                this.wallet.lastHeight = this.lastBlockLoading;
            }
        };
        WalletWatchdog.prototype.checkTransactionsInterval = function () {
            //somehow we're repeating and regressing back to re-process Tx's 
            //loadHistory getting into a stack overflow ?
            //need to work out timinings and ensure process does not reload when it's already running... 
            if (this.workerProcessingWorking || !this.workerProcessingReady) {
                return;
            }
            //we destroy the worker in charge of decoding the transactions every 250 transactions to ensure the memory is not corrupted
            //cnUtil bug, see https://github.com/mymonero/mymonero-core-js/issues/8
            if (this.workerCountProcessed >= 500) {
                console.log('Recreate worker..');
                this.terminateWorker();
                this.initWorker();
                return;
            }
            var transactionsToProcess = this.transactionsToProcess.splice(0, 100); //process 100 tx's at a time
            if (transactionsToProcess.length > 0) {
                this.workerCurrentProcessing = transactionsToProcess;
                this.workerProcessing.postMessage({
                    type: 'process',
                    transactions: transactionsToProcess
                });
                ++this.workerCountProcessed;
                this.workerProcessingWorking = true;
            }
            else {
                clearInterval(this.intervalTransactionsProcess);
                this.intervalTransactionsProcess = 0;
            }
        };
        WalletWatchdog.prototype.processTransactions = function (transactions) {
            var transactionsToAdd = [];
            for (var _i = 0, transactions_2 = transactions; _i < transactions_2.length; _i++) {
                var tr = transactions_2[_i];
                if (typeof tr.height !== 'undefined')
                    if (tr.height > this.wallet.lastHeight) {
                        transactionsToAdd.push(tr);
                    }
            }
            this.transactionsToProcess.push.apply(this.transactionsToProcess, transactionsToAdd);
            if (this.intervalTransactionsProcess === 0) {
                var self_1 = this;
                this.intervalTransactionsProcess = setInterval(function () {
                    self_1.checkTransactionsInterval();
                }, this.wallet.options.readSpeed);
            }
        };
        WalletWatchdog.prototype.loadHistory = function () {
            if (this.stopped)
                return;
            if (this.lastBlockLoading === -1)
                this.lastBlockLoading = this.wallet.lastHeight;
            var self = this;
            //don't reload until it's finished processing the last batch of transactions
            if (this.workerProcessingWorking || !this.workerProcessingReady) {
                setTimeout(function () {
                    self.loadHistory();
                }, 500);
                return;
            }
            if (this.transactionsToProcess.length > 250) {
                //to ensure no pile explosion
                setTimeout(function () {
                    self.loadHistory();
                }, 2000);
                return;
            }
            // console.log('checking');
            this.explorer.getHeight().then(function (height) {
                //console.log("loading height:", self.lastBlockLoading,height);
                if (height > self.lastMaximumHeight)
                    self.lastMaximumHeight = height;
                if (self.lastBlockLoading !== height) {
                    var previousStartBlock = self.lastBlockLoading;
                    var startBlock = Math.floor(self.lastBlockLoading / 100) * 100;
                    // console.log('=>',self.lastBlockLoading, endBlock, height, startBlock, self.lastBlockLoading);
                    console.log('load block from ' + startBlock + ' (actual block: ' + previousStartBlock + ') at height :' + height);
                    if (previousStartBlock <= height) {
                        self.explorer.getTransactionsForBlocks(previousStartBlock + 1, self.wallet.options.localNode).then(function (transactions) {
                            //to ensure no pile explosion
                            if (transactions.length > 0) {
                                var lastTx = transactions[transactions.length - 1];
                                if (typeof lastTx.height !== 'undefined') {
                                    self.lastBlockLoading = lastTx.height;
                                }
                            }
                            self.processTransactions(transactions);
                            if (self.lastBlockLoading < height - 1) {
                                setTimeout(function () {
                                    self.loadHistory();
                                }, 1); // then try load history again... 
                            }
                            else {
                                setTimeout(function () {
                                    self.loadHistory();
                                }, 30000); // wait 30 seconds, then try load history again... 
                            }
                        }).catch(function () {
                            setTimeout(function () {
                                self.loadHistory();
                            }, 30 * 1000); //retry 30s later if an error occurred
                        });
                    }
                    else {
                        //if we're on the current height, then only try sync every 30 seconds... 
                        setTimeout(function () {
                            self.loadHistory();
                        }, 30000); // then try load history again... 
                    }
                }
                else {
                    setTimeout(function () {
                        self.loadHistory();
                    }, 30 * 1000); //retry 30s later if an error occurred
                }
            }).catch(function () {
                setTimeout(function () {
                    self.loadHistory();
                }, 30 * 1000); //retry 30s later if an error occurred
            });
        };
        return WalletWatchdog;
    }());
    exports.WalletWatchdog = WalletWatchdog;
    var BlockchainExplorerRpc2 = /** @class */ (function () {
        function BlockchainExplorerRpc2() {
            this.serverAddress = config.apiUrl;
            this.heightCache = 0;
            this.heightLastTimeRetrieve = 0;
            this.scannedHeight = 0;
            this.nonRandomBlockConsumed = false;
            this.existingOuts = [];
        }
        BlockchainExplorerRpc2.prototype.getHeight = function () {
            if (Date.now() - this.heightLastTimeRetrieve < 20 * 1000 && this.heightCache !== 0) {
                return Promise.resolve(this.heightCache);
            }
            var self = this;
            this.heightLastTimeRetrieve = Date.now();
            return new Promise(function (resolve, reject) {
                $.ajax({
                    url: config.apiUrl + "height",
                    method: 'GET'
                }).done(function (raw) {
                    self.heightCache = parseInt(raw.height);
                    resolve(self.heightCache);
                }).fail(function (data) {
                    reject(data);
                });
            });
        };
        BlockchainExplorerRpc2.prototype.getScannedHeight = function () {
            return this.scannedHeight;
        };
        BlockchainExplorerRpc2.prototype.watchdog = function (wallet) {
            var watchdog = new WalletWatchdog(wallet, this);
            watchdog.loadHistory();
            return watchdog;
        };
        BlockchainExplorerRpc2.prototype.getTransactionsForBlocks = function (startBlock, localNode) {
            if (localNode === void 0) { localNode = ''; }
            var self = this;
            return new Promise(function (resolve, reject) {
                //old way, hitting cache
                if (localNode === '') {
                    $.ajax({
                        url: config.apiUrl + "sync",
                        method: 'POST',
                        dataType: "json",
                        contentType: 'application/json',
                        data: JSON.stringify({ 'blockCount': 100, 'scanHeight': startBlock })
                    }).done(function (response) {
                        var blocks = response;
                        var transactions = [];
                        for (var i = 0; i < blocks.length; i++) {
                            var blockTransactions = blocks[i].transactions;
                            for (var j = 0; j < blockTransactions.length; j++) {
                                blockTransactions[j].height = blocks[i].height; //add height to the Tx
                                blockTransactions[j].timestamp = blocks[i].timestamp; //add timestamp to the Tx
                                transactions.push(blockTransactions[j]);
                            }
                        }
                        resolve(transactions);
                    }).fail(function (data) {
                        reject(data);
                    });
                }
                else {
                    console.log('fetching from node ' + localNode);
                    var blocks = [];
                    for (var i = startBlock; i < startBlock + 100; i++) {
                        blocks.push(i);
                    }
                    $.ajax({
                        url: "http://" + localNode + "/get_blocks_details_by_heights",
                        method: 'POST',
                        dataType: "json",
                        processData: false,
                        data: JSON.stringify({ blockHeights: blocks })
                    }).done(function (data) {
                        var blocks = data.blocks;
                        var txs = [];
                        for (var i = 0; i < blocks.length; i++) {
                            for (var j = 0; j < blocks[i].transactions.length; j++) {
                                // transform Transactions
                                var rawTx = blocks[i].transactions[j];
                                var tx = {};
                                tx.fee = rawTx.fee;
                                tx.unlock_time = rawTx.unlockTime;
                                tx.height = rawTx.blockIndex;
                                tx.timestamp = rawTx.timestamp;
                                tx.hash = rawTx.hash;
                                tx.publicKey = rawTx.extra.publicKey;
                                tx.paymentId = rawTx.paymentId === "0000000000000000000000000000000000000000000000000000000000000000" ? "" : rawTx.paymentId;
                                tx.vin = [];
                                tx.vout = [];
                                //map the inputs and outputs
                                for (var x = 0; x < rawTx.inputs.length; x++) {
                                    var vin = {};
                                    var input = rawTx.inputs[x];
                                    vin.amount = input.data.input.amount;
                                    vin.k_image = input.data.input.k_image;
                                    input = null;
                                    tx.vin.push(vin);
                                }
                                for (var x = 0; x < rawTx.outputs.length; x++) {
                                    var vout = {};
                                    var output = rawTx.outputs[x];
                                    vout.amount = output.output.amount;
                                    vout.globalIndex = output.globalIndex;
                                    vout.key = output.output.target.data.key;
                                    output = null;
                                    tx.vout.push(vout);
                                }
                                rawTx = null;
                                txs.push(tx);
                            }
                        }
                        blocks = null;
                        resolve(txs);
                    }).fail(function (data) {
                        console.log(data);
                        reject(data);
                    });
                }
            });
        };
        BlockchainExplorerRpc2.prototype.getTransactionPool = function () {
            var self = this;
            return new Promise(function (resolve, reject) {
                $.ajax({
                    url: self.serverAddress + 'txpool',
                    method: 'GET',
                }).done(function (transactions) {
                    if (transactions !== null) {
                        resolve(JSON.parse(transactions));
                    }
                }).fail(function (data) {
                    console.log('REJECT');
                    try {
                        console.log(JSON.parse(data.responseText));
                    }
                    catch (e) {
                        console.log(e);
                    }
                    reject(data);
                });
            });
        };
        BlockchainExplorerRpc2.prototype.getRandomOuts = function (nbOutsNeeded, initialCall) {
            if (initialCall === void 0) { initialCall = true; }
            var self = this;
            if (initialCall) {
                self.existingOuts = [];
            }
            return this.getHeight().then(function (height) {
                var txs = [];
                var promises = [];
                var randomBlocksIndexesToGet = [];
                var numOuts = height;
                for (var i = 0; i < nbOutsNeeded; ++i) {
                    var selectedIndex = -1;
                    do {
                        selectedIndex = MathUtil_1.MathUtil.randomTriangularSimplified(numOuts);
                        if (selectedIndex >= height - config.txCoinbaseMinConfirms)
                            selectedIndex = -1;
                    } while (selectedIndex === -1 || randomBlocksIndexesToGet.indexOf(selectedIndex) !== -1);
                    randomBlocksIndexesToGet.push(selectedIndex);
                    var promise = self.getTransactionsForBlocks(Math.floor(selectedIndex / 100) * 100).then(function (rawTransactions) {
                        txs.push.apply(txs, rawTransactions);
                    });
                    promises.push(promise);
                }
                return Promise.all(promises).then(function () {
                    var txCandidates = {};
                    for (var iOut = 0; iOut < txs.length; ++iOut) {
                        var tx = txs[iOut];
                        if ((typeof tx.height !== 'undefined' && randomBlocksIndexesToGet.indexOf(tx.height) === -1) ||
                            typeof tx.height === 'undefined') {
                            continue;
                        }
                        for (var output_idx_in_tx = 0; output_idx_in_tx < tx.outputs.length; ++output_idx_in_tx) {
                            var newOut = {
                                public_key: tx.outputs[output_idx_in_tx].key,
                                global_index: tx.outputs[output_idx_in_tx].globalIndex,
                            };
                            if (typeof txCandidates[tx.height] === 'undefined')
                                txCandidates[tx.height] = [];
                            txCandidates[tx.height].push(newOut);
                        }
                    }
                    //console.log(txCandidates);
                    var selectedOuts = [];
                    for (var txsOutsHeight in txCandidates) {
                        var outIndexSelect = MathUtil_1.MathUtil.getRandomInt(0, txCandidates[txsOutsHeight].length - 1);
                        //console.log('select ' + outIndexSelect + ' for ' + txsOutsHeight + ' with length of ' + txCandidates[txsOutsHeight].length);
                        selectedOuts.push(txCandidates[txsOutsHeight][outIndexSelect]);
                    }
                    //console.log(selectedOuts);
                    return selectedOuts;
                });
            });
        };
        BlockchainExplorerRpc2.prototype.sendRawTx = function (rawTx) {
            var self = this;
            return new Promise(function (resolve, reject) {
                //console.log('sending:', rawTx);
                $.post(self.serverAddress + 'sendrawtx', { '': rawTx })
                    .done(function (transactions) {
                    if (transactions.status && transactions.status == 'OK') {
                        resolve(transactions);
                    }
                    else
                        reject(transactions);
                }).fail(function (data) {
                    reject(data);
                });
            });
        };
        return BlockchainExplorerRpc2;
    }());
    exports.BlockchainExplorerRpc2 = BlockchainExplorerRpc2;
});
