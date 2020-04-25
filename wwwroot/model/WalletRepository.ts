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

import {RawWallet, Wallet} from "./Wallet";
import {CoinUri} from "./CoinUri";
import {Storage} from "./Storage";
import { Mnemonic } from "../model/Mnemonic";

export class WalletRepository{

	static hasOneStored() : Promise<boolean>{
		return Storage.getItem('wallet', null).then(function (wallet : any) {
			return wallet !== null;
		});
	}
	
	static getWithPassword(rawWallet : RawWallet, password : string) : Wallet|null{
		if(password.length > 32)
			password = password.substr(0 , 32);
		if(password.length < 32){
			password = ('00000000000000000000000000000000'+password).slice(-32);
		}

		let privKey = new (<any>TextEncoder)("utf8").encode(password);
		let nonce = new (<any>TextEncoder)("utf8").encode(rawWallet.nonce);
		// rawWallet.encryptedKeys = this.b64DecodeUnicode(rawWallet.encryptedKeys);
		let encrypted = new Uint8Array(<any>rawWallet.encryptedKeys);
		let decrypted = nacl.secretbox.open(encrypted, nonce, privKey);
		if(decrypted === null)
			return null;
		rawWallet.encryptedKeys = new TextDecoder("utf8").decode(decrypted);
		return Wallet.loadFromRaw(rawWallet);
	}

	static getLocalWalletWithPassword(password : string) : Promise<Wallet|null>{
		return Storage.getItem('wallet', null).then((existingWallet : any) => {
			//console.log(existingWallet);
			if(existingWallet !== null){
				//console.log(JSON.parse(existingWallet));
				let wallet : Wallet|null = this.getWithPassword(JSON.parse(existingWallet), password);
				//console.log(wallet);
				return wallet;
			}else{
				return null;
			}
		});
	}
	
	static save(wallet : Wallet, password : string) : Promise<void>{
		let rawWallet = this.getEncrypted(wallet, password);
		return Storage.setItem('wallet', JSON.stringify(rawWallet));
	}

	static getEncrypted(wallet : Wallet, password : string){
		if(password.length > 32)
			password = password.substr(0 , 32);
		if(password.length < 32){
			password = ('00000000000000000000000000000000'+password).slice(-32);
		}

		let privKey = new (<any>TextEncoder)("utf8").encode(password);
		let rawNonce = nacl.util.encodeBase64(nacl.randomBytes(16));
		let nonce = new (<any>TextEncoder)("utf8").encode(rawNonce);
		let rawWallet = wallet.exportToRaw();
		let uint8EncryptedKeys = new (<any>TextEncoder)("utf8").encode(rawWallet.encryptedKeys);

		let encrypted : Uint8Array = nacl.secretbox(uint8EncryptedKeys, nonce, privKey);
		rawWallet.encryptedKeys = <any>encrypted.buffer;
		let tabEncrypted = [];
		for(let i = 0; i < encrypted.length; ++i){
			tabEncrypted.push(encrypted[i]);
		}
		rawWallet.encryptedKeys = <any>tabEncrypted;
		rawWallet.nonce = rawNonce;
		return rawWallet;
	}

	static deleteLocalCopy() : Promise<void>{
		return Storage.remove('wallet');
	}

    static dottedLine(doc: any, xFrom: number, yFrom: number, xTo: number, yTo: number, segmentLength: number) {
        // Calculate line length (c)
        var a = Math.abs(xTo - xFrom);
        var b = Math.abs(yTo - yFrom);
        var c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));

        // Make sure we have an odd number of line segments (drawn or blank) to fit it nicely
        var fractions = c / segmentLength;
        var adjustedSegmentLength = (Math.floor(fractions) % 2 === 0) ? (c / Math.ceil(fractions)) : (c / Math.floor(fractions));

        // Calculate x, y deltas per segment
        var deltaX = adjustedSegmentLength * (a / c);
        var deltaY = adjustedSegmentLength * (b / c);

        var curX = xFrom, curY = yFrom;
        while (curX <= xTo && curY <= yTo) {
            doc.line(curX, curY, curX + deltaX, curY + deltaY);
            curX += 2 * deltaX;
            curY += 2 * deltaY;
        }
    }

	static downloadEncryptedPdf(wallet : Wallet){
		if(wallet.keys.priv.spend === '')
			throw 'missing_spend';

		let coinWalletUri = CoinUri.encodeWalletKeys(
			wallet.getPublicAddress(),
			wallet.keys.priv.spend,
			wallet.keys.priv.view,
			wallet.creationHeight
		);

		let publicQrCode = kjua({
			render: 'canvas',
			text: wallet.getPublicAddress(),
			size:300,
		});

        let privateSpendQrCode = kjua({
            render: 'canvas',
            text: wallet.keys.priv.spend,
            size: 300,
        });

        let privateViewQrCode = kjua({
            render: 'canvas',
            text: wallet.keys.priv.view,
            size: 300,
        });

        
        let logo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAS8AAAEvCAYAAAAU3kfYAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAGvmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKE1hY2ludG9zaCkiIHhtcDpDcmVhdGVEYXRlPSIyMDE5LTA0LTI1VDIwOjUyOjQxKzAyOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxOS0wNC0yNlQxNToxMzoxMSswMjowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAxOS0wNC0yNlQxNToxMzoxMSswMjowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoyNzNmMTM0ZC1mMjFiLTRjMjYtYTMwOC1mMGQ1YzAyOTcyY2YiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpkZGQ5ZWM2Zi05YzJhLTE5NDEtOWRmNC04MDM4MmJhM2QxYjciIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo1MWEwNDkxZi02YTY5LTRlNDAtYmE4NS00ZWM1YmE1YmZkODQiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjUxYTA0OTFmLTZhNjktNGU0MC1iYTg1LTRlYzViYTViZmQ4NCIgc3RFdnQ6d2hlbj0iMjAxOS0wNC0yNVQyMDo1Mjo0MSswMjowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo3MTFmM2Y5OS0wYzlkLTRjMjItOTdmZC00MDAxMDI0NDMxZTYiIHN0RXZ0OndoZW49IjIwMTktMDQtMjZUMTU6MTM6MTErMDI6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAoTWFjaW50b3NoKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MjczZjEzNGQtZjIxYi00YzI2LWEzMDgtZjBkNWMwMjk3MmNmIiBzdEV2dDp3aGVuPSIyMDE5LTA0LTI2VDE1OjEzOjExKzAyOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgKE1hY2ludG9zaCkiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8++yqdOgAAE7FJREFU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";

		let doc = new jsPDF('landscape');

        // background color
        doc.setFillColor(0, 118, 168);
        doc.rect(0, 0, 297, 210, "F");

        

        // middle line
        doc.setLineWidth(0.2);
        doc.setDrawColor(255, 255, 255);
        this.dottedLine(doc, 0, 105, 297, 105, 2);
        // column lines
        doc.setDrawColor(255, 255, 255);
        this.dottedLine(doc, 99, 0, 99, 210, 2);
        this.dottedLine(doc, 198, 0, 198, 210, 2);


        // BOX 1 [x = 5, y = 10]
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(251, 191, 46);
        doc.rect(5, 5, 90, 90, "F");
        doc.setFillColor(251, 191, 46);
        doc.rect(5, 75, 90, 15, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(30);
        doc.text('Private View', 79, 79, null, 180);
        doc.addImage(privateViewQrCode, 'PNG', 25, 20, 50, 50);
        let qrViewText = wallet.keys.priv.view;
        let qrViewSplit = Math.ceil(qrViewText.length / 2);
        doc.setFontSize(8)
        doc.setTextColor(0, 0, 0)
        doc.text(qrViewText.slice(0, qrViewSplit), 74, 15, null, 180);
        doc.text(qrViewText.slice(qrViewSplit), 74, 11, null, 180);


        // BOX 2 - [x = 104, y = 10]
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(251, 191, 46);
        doc.rect(104, 5, 90, 90, "F");
        doc.setFillColor(251, 191, 46);
        doc.rect(104, 75, 90, 15, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(30);
        doc.text('Private Spend', 182.5, 79, null, 180);
        doc.addImage(privateSpendQrCode, 'PNG', 124, 20, 50, 50);
        let qrSpendText = wallet.keys.priv.spend;
        let qrSpendSplit = Math.ceil(qrSpendText.length / 2);
        doc.setFontSize(8)
        doc.setTextColor(0, 0, 0)
        doc.text(qrSpendText.slice(0, qrSpendSplit), 174, 15, null, 180);
        doc.text(qrSpendText.slice(qrSpendSplit), 174, 11, null, 180);


        // BOX 3 - [x = 203, y = 10]
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(251, 191, 46);
        doc.rect(203, 5, 90, 90, "F");
        doc.setFillColor(251, 191, 46);
        doc.rect(203, 75, 90, 15, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(30);
        doc.text('Mnemonic Seed', 286, 79, null, 180);
        //todo, add mnemonic text
        doc.setFontSize(12)
        let mnemon = Mnemonic.mn_encode(wallet.keys.priv.spend, "english");
        let mnemonicWords = mnemon !== null ? mnemon.split(' ') : [];
        doc.setTextColor(0, 0, 0);
        try {
            let lineOne = mnemonicWords.splice(0, 5);
            let lineTwo = mnemonicWords.splice(0, 5);
            let lineThree = mnemonicWords.splice(0, 5);
            let lineFour = mnemonicWords.splice(0, 5);
            let lineFive = mnemonicWords.splice(0, 5);
            let startPos = 291;
            let strLineOne = lineOne.join(' ');
            let startLineOne = startPos - parseInt(Math.floor((50 - strLineOne.length) / 2).toString());
            doc.text(strLineOne, startLineOne, 63, null, 180);
            let strLineTwo = lineTwo.join(' ');
            let startLineTwo = startPos - parseInt(Math.floor((50 - strLineTwo.length) / 2).toString());
            doc.text(strLineTwo, startLineTwo, 52, null, 180);
            let strLineThree = lineThree.join(' ');
            let startLineThree = startPos - parseInt(Math.floor((50 - strLineThree.length) / 2).toString());
            doc.text(strLineThree, startLineThree, 39, null, 180);
            let strLineFour = lineFour.join(' ');
            let startLineFour = startPos - parseInt(Math.floor((50 - strLineFour.length) / 2).toString());
            doc.text(strLineFour, startLineFour, 27, null, 180);
            let strLineFive = lineFive.join(' ');
            let startLineFive = startPos - parseInt(Math.floor((50 - strLineFive.length) / 2).toString());
            doc.text(strLineFive, startLineFive, 15, null, 180);
        }
        catch (e) {
            console.log("Couldn't get Mnemonic, ignoring!");
        }
        // BOX 4 - [x = 0, y = 100]
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(251, 191, 46);
        doc.rect(5, 115, 90, 90, "F");
        doc.setFillColor(251, 191, 46);
        doc.rect(5, 120, 90, 15, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(30);
        doc.text('Public Wallet', 20, 132, null, 0);
        doc.addImage(publicQrCode, 'PNG', 25, 140, 50, 50);
        let qrPublicText = wallet.getPublicAddress();
        let qrPublicSplit = Math.ceil(qrPublicText.length / 3);
        doc.setFontSize(8)
        doc.setTextColor(0, 0, 0)
        doc.text(qrPublicText.slice(0, qrPublicSplit), 23, 194, null, 0);
        doc.text(qrPublicText.slice(qrPublicSplit, qrPublicSplit * 2), 22, 198, null, 0);
        doc.text(qrPublicText.slice(qrPublicSplit * 2), 23, 202, null, 0);


        // BOX 5 - [x = 104, y = 110]
        doc.setFillColor(251, 191, 46);
        doc.roundedRect(104, 115, 89, 85, 2, 2, 'F');
        doc.setFontSize(10)
        doc.setTextColor(255, 255, 255)
        doc.text(108, 125, 'To deposit funds to this paper wallet, send the');
        doc.text(108, 130, 'Kryptokrona (XKR) coins to the public address.');
        doc.text(108, 150, 'DO NOT REVEAL THE PRIVATE SPEND KEY.');
        doc.text(108, 165, 'Until you are ready to import the balance from this');
        doc.text(108, 170, 'wallet to your Kryptokrona wallet, a cryptocurrency');
        doc.text(108, 175, 'client, or exchange.');
        doc.text(108, 185, 'Amount:');
        doc.setDrawColor(255, 255, 255);
        doc.line(122, 185, 150, 185);
        doc.text(155, 185, 'Date:');
        doc.line(164, 185, 182, 185);
        doc.text(108, 190, 'Notes:');
        doc.line(119, 190, 182, 190);


        // BOX 6 - [x = 203, y = 110]
        doc.addImage(logo, 'PNG', 208, 135, 80, 36.44);


		try {
			doc.save('wallet_backup.pdf');
		} catch(e) {
			alert('Error ' + e);
		}

	}

}