"use strict";
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
importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.2.0/workbox-sw.js');
workbox.precaching.precacheAndRoute([
  {
    "url": "api.html",
    "revision": "5a71434db7307a451634f4addb0bb7ef"
  },
  {
    "url": "api.js",
    "revision": "cdb5f859eef334f87873586655503f09"
  },
  {
    "url": "assets/css/font-awesome.css",
    "revision": "c495654869785bc3df60216616814ad1"
  },
  {
    "url": "assets/css/font-awesome.min.css",
    "revision": "269550530cc127b6aa5a35925a7de6ce"
  },
  {
    "url": "assets/css/main.css",
    "revision": "1f5f2ec4f5fa88decd5c36d8c0a08c90"
  },
  {
    "url": "assets/css/main.min.css",
    "revision": "e2dbdb0427da41ec363d2dace647614a"
  },
  {
    "url": "assets/img/binary-background.jpg",
    "revision": "9950b9f8a4133456595e5e9a2bc3f7e8"
  },
  {
    "url": "assets/img/favicon.ico",
    "revision": "12458b914baedde9297ba45becb69400"
  },
  {
    "url": "assets/img/icons/icon-128x128.png",
    "revision": "e34530a36ef9cf074197b80b1560bb27"
  },
  {
    "url": "assets/img/icons/icon-144x144.png",
    "revision": "0a89c4a38cc10726b614a30227162b5e"
  },
  {
    "url": "assets/img/icons/icon-152x152.png",
    "revision": "5f68b0bff496d8566c349d90f23f3d48"
  },
  {
    "url": "assets/img/icons/icon-192x192.png",
    "revision": "64adddf26f140413e7214a94d78797f9"
  },
  {
    "url": "assets/img/icons/icon-256x256.png",
    "revision": "7dd6ad2b73c9938593268a9c53e804b7"
  },
  {
    "url": "assets/img/icons/icon-402x402.png",
    "revision": "0827310a1f622a90348340e64f2f8d5b"
  },
  {
    "url": "assets/img/landing/75-usersthink-stock-image.jpg",
    "revision": "7a00bbf57aacc5303e846055b6dae1cb"
  },
  {
    "url": "assets/img/landing/ple.png",
    "revision": "7b0c463806f9f516cae91bfce8e26c01"
  },
  {
    "url": "assets/img/logo_white.png",
    "revision": "2824d8ede1a1df017e3ede454fd7f2a4"
  },
  {
    "url": "assets/img/logo.png",
    "revision": "686c9eccc934e32076127f4671eba942"
  },
  {
    "url": "assets/img/logoQrCode.png",
    "revision": "998554cd3aa8de3de02cbbcf4962fdfd"
  },
  {
    "url": "assets/img/Plenteum_Vertical.png",
    "revision": "cc8bb367eafb7b2d7092a9f5e24e45a0"
  },
  {
    "url": "config.js",
    "revision": "298c8688f82e65a182343436057dab4c"
  },
  {
    "url": "d/vue-i118n.js",
    "revision": "5e60d2e13017ae982538f352d04a961c"
  },
  {
    "url": "filters/Filters.js",
    "revision": "c833e50817fc49b8edd24b1c1b9268ea"
  },
  {
    "url": "index.html",
    "revision": "cd70e1d98d36c9b33c0f7664a90fcee4"
  },
  {
    "url": "index.js",
    "revision": "181aff66d0f46349e9e90cfbf3faa62e"
  },
  {
    "url": "lib/base58.js",
    "revision": "3d523c0162d6911fd675c9ed1b7389a8"
  },
  {
    "url": "lib/biginteger.js",
    "revision": "f5a873c5716a9d3481501cad3f3e5ca7"
  },
  {
    "url": "lib/cn_utils_native.js",
    "revision": "94d65c88ed19007552b6593fa6fc68d1"
  },
  {
    "url": "lib/cn_utils.js",
    "revision": "3bcf0d73b24e68c17b47c6abe2120539"
  },
  {
    "url": "lib/crypto.js",
    "revision": "d51c76b2e08308f8cca1f68c5c298a6f"
  },
  {
    "url": "lib/decoder.min.js",
    "revision": "889b2bf53f2adc26ca2688e012c4e00b"
  },
  {
    "url": "lib/FileSaver.min.js",
    "revision": "e8fdc5ad52084fa417f1fec6b6de3b29"
  },
  {
    "url": "lib/jquery-3.2.1.min.js",
    "revision": "c9f5aeeca3ad37bf2aa006139b935f0a"
  },
  {
    "url": "lib/jspdf.min.js",
    "revision": "27385efc6fa2eccc9dde7da0081b1a98"
  },
  {
    "url": "lib/kjua-0.1.1.min.js",
    "revision": "ca69d4f40f8c17ff592123dc35c1ea18"
  },
  {
    "url": "lib/mnemonic.js",
    "revision": "f30940176ec1e71b5a5f0c9b784a98b9"
  },
  {
    "url": "lib/nacl-fast-cn.js",
    "revision": "1fe1387eb865d9e843697a9d315d95b1"
  },
  {
    "url": "lib/nacl-fast.js",
    "revision": "ac1c96e688baf1b33e3b07be1bda3026"
  },
  {
    "url": "lib/nacl-fast.min.js",
    "revision": "72444801c9affc1654ef12860c67e976"
  },
  {
    "url": "lib/nacl-util.min.js",
    "revision": "c7b843b9e9b5aad102c855c600c7edc8"
  },
  {
    "url": "lib/nacl.js",
    "revision": "bf72b0a25fc3edf0c1a638aa43642714"
  },
  {
    "url": "lib/nacl.min.js",
    "revision": "d8eaf281c8890a60ebe82840456edc33"
  },
  {
    "url": "lib/numbersLab/Context.js",
    "revision": "40c29d848d2e19cdff2399a1f4a0ec08"
  },
  {
    "url": "lib/numbersLab/DependencyInjector.js",
    "revision": "5ff09fd4a2472fcd5616757c02c10145"
  },
  {
    "url": "lib/numbersLab/DestructableView.js",
    "revision": "c34f21327cd00c4b69dd88f33a60b7fc"
  },
  {
    "url": "lib/numbersLab/Logger.js",
    "revision": "8c2a28644d0112f8934f6ac54ada17ac"
  },
  {
    "url": "lib/numbersLab/Observable.js",
    "revision": "84e5ac65bf05cee513a1fb77801de7b8"
  },
  {
    "url": "lib/numbersLab/Router.js",
    "revision": "387e2f40f0f6e0746a513ab16ac33d9f"
  },
  {
    "url": "lib/numbersLab/VueAnnotate.js",
    "revision": "322eccaecb8cbbfba7b1f7a10ba9cf3b"
  },
  {
    "url": "lib/particles.min.js",
    "revision": "a3c13de6d0767b030db206a16290cd8c"
  },
  {
    "url": "lib/require.js",
    "revision": "bebd45d1f406bbe61424136b03e50895"
  },
  {
    "url": "lib/sha3.js",
    "revision": "9f298ac7e4ee707645a8d711f3ed916b"
  },
  {
    "url": "lib/sweetalert2.js",
    "revision": "4b69bbd418e85d6efdac5630ed40d76e"
  },
  {
    "url": "lib/vue-i18n.js",
    "revision": "e6661e4c9407136f4aca71aaea06b35e"
  },
  {
    "url": "lib/vue.min.js",
    "revision": "5283b86cbf48a538ee3cbebac633ccd4"
  },
  {
    "url": "local.html",
    "revision": "bf45bb5fcec1b2762ad27540501efaac"
  },
  {
    "url": "local.js",
    "revision": "5e60d2e13017ae982538f352d04a961c"
  },
  {
    "url": "localforage.js",
    "revision": "35ba30bc6640adb836a6748b9453251b"
  },
  {
    "url": "manifest.json",
    "revision": "853e269ae97fc7e8e45ea338007b7099"
  },
  {
    "url": "model/AppState.js",
    "revision": "431a9f613cb28066c70838d1bf05eb44"
  },
  {
    "url": "model/blockchain/BlockchainExplorer.js",
    "revision": "e3404d8faa65802943baf504480b26f3"
  },
  {
    "url": "model/blockchain/BlockchainExplorerRpc2.js",
    "revision": "5631edbbc60692d6d665b46cda2920c3"
  },
  {
    "url": "model/CnUtilNative.js",
    "revision": "9a03972e8467977cec32845b1978881e"
  },
  {
    "url": "model/CoinUri.js",
    "revision": "1531860faa8fda92c1a38478de9d8f11"
  },
  {
    "url": "model/Constants.js",
    "revision": "e46d428bdc260687dc2bfa244506f8a7"
  },
  {
    "url": "model/CryptoUtils.js",
    "revision": "fd3a50bd3004daaed698d81a77e8ccb7"
  },
  {
    "url": "model/KeysRepository.js",
    "revision": "9624cfda708371af70be368d04dcdf52"
  },
  {
    "url": "model/MathUtil.js",
    "revision": "fbcf9ddfb1a45adb5e279ef3bf0043fb"
  },
  {
    "url": "model/Mnemonic.js",
    "revision": "4bca381005d721755dee39dd043e0497"
  },
  {
    "url": "model/MnemonicLang.js",
    "revision": "95fa0971ba4019846ec610aab9c9056c"
  },
  {
    "url": "model/Nfc.js",
    "revision": "5e79dba2eccb2e4a6be22903911ef4d0"
  },
  {
    "url": "model/Password.js",
    "revision": "d75bcb48374faa5f55d1302886337e4f"
  },
  {
    "url": "model/QRReader.js",
    "revision": "90fe8f1af61aff68798ad7d154273483"
  },
  {
    "url": "model/Storage.js",
    "revision": "cff863fc2b82e57f1618e34bb49a8e49"
  },
  {
    "url": "model/Transaction.js",
    "revision": "274ded974cca7665eaea3f3068a4f069"
  },
  {
    "url": "model/TransactionsExplorer.js",
    "revision": "12048ff20cd182da1446ddd7396e6d58"
  },
  {
    "url": "model/Translations.js",
    "revision": "9b2ad550dfd0bfdf6c19b612c76d3c0e"
  },
  {
    "url": "model/Wallet.js",
    "revision": "612daaaa7cbfae986c4e2bf1c31a305c"
  },
  {
    "url": "model/WalletRepository.js",
    "revision": "2bf05f780163ecc502f478186932dddc"
  },
  {
    "url": "pages/account.html",
    "revision": "85c65dd8ce2d4a17bac95f5c7dc68725"
  },
  {
    "url": "pages/account.js",
    "revision": "c7d29dcf9cf31c21f8794095c70a1868"
  },
  {
    "url": "pages/changeWalletPassword.html",
    "revision": "cf44f48e8c60b3c2e19e22e825a89724"
  },
  {
    "url": "pages/changeWalletPassword.js",
    "revision": "2022bd8d0b2d6fd28e6164f733a295c4"
  },
  {
    "url": "pages/createWallet.html",
    "revision": "761cec1b5e152fd34fd0e7c3d75a1128"
  },
  {
    "url": "pages/createWallet.js",
    "revision": "387393d07682d1338b4cb8d9b05fd1e4"
  },
  {
    "url": "pages/disconnect.html",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "pages/disconnect.js",
    "revision": "bdffa3a5bab2374fc53e4deb2945ec8a"
  },
  {
    "url": "pages/donate.html",
    "revision": "127fb942fa9088d09989fff426938e7c"
  },
  {
    "url": "pages/donate.js",
    "revision": "53f882a1210d8ecfe9179dc0811fac12"
  },
  {
    "url": "pages/export.html",
    "revision": "753a06110802f67a746bec66eec85e8c"
  },
  {
    "url": "pages/export.js",
    "revision": "225c948966fcd3822091f41d5d18ecd8"
  },
  {
    "url": "pages/import.html",
    "revision": "45f5c149574bd7cf2bc91794c4adee55"
  },
  {
    "url": "pages/import.js",
    "revision": "67c6d2b4b5ccde2fab1ebf7351c49c58"
  },
  {
    "url": "pages/importFromFile.html",
    "revision": "b824f9fc68ce358032faecd70b0e099b"
  },
  {
    "url": "pages/importFromFile.js",
    "revision": "53ee799fbf138654b1385e198c7f5ee9"
  },
  {
    "url": "pages/importFromKeys.html",
    "revision": "3ceeb6b6cddc27774fb976f37fe30888"
  },
  {
    "url": "pages/importFromKeys.js",
    "revision": "bc32ff66bb6143bf38f24f60be5549c1"
  },
  {
    "url": "pages/importFromMnemonic.html",
    "revision": "367f09264b3c3008ee0eda752d4a0ea7"
  },
  {
    "url": "pages/importFromMnemonic.js",
    "revision": "f5987487587c18f821f3ee506305eb4a"
  },
  {
    "url": "pages/importFromQr.html",
    "revision": "172fc490fa9a97ed146895e0f35aeedc"
  },
  {
    "url": "pages/importFromQr.js",
    "revision": "e620e33334313ddc24f1ad926bdf2efc"
  },
  {
    "url": "pages/index.html",
    "revision": "1739263b52fcd164e1c533f2aaf65c10"
  },
  {
    "url": "pages/index.js",
    "revision": "a15c5864c1904d61ac37d8cddf65a192"
  },
  {
    "url": "pages/mining.html",
    "revision": "e6254c26cbece51ab373e46a92dc231b"
  },
  {
    "url": "pages/mining.js",
    "revision": "f7a68b01e599fd0cb2e575886b36c80e"
  },
  {
    "url": "pages/network.html",
    "revision": "580a62bfc944395dd63e564e361671dc"
  },
  {
    "url": "pages/network.js",
    "revision": "8d382fc5cda566354933c67aa9eb83eb"
  },
  {
    "url": "pages/privacyPolicy.html",
    "revision": "fe324471535c6b9efd13c2face2873f0"
  },
  {
    "url": "pages/privacyPolicy.js",
    "revision": "a06e415fe7eaf88807bf25d83989dc1c"
  },
  {
    "url": "pages/receive.html",
    "revision": "741e0326dc227a9fdb4402c9d3304a65"
  },
  {
    "url": "pages/receive.js",
    "revision": "e9ad79d32de538fc82fbd24c2f75473e"
  },
  {
    "url": "pages/send.html",
    "revision": "4985be72a306abc050b09a78dff74077"
  },
  {
    "url": "pages/send.js",
    "revision": "5636ce0576972dc979bdfb618837bf70"
  },
  {
    "url": "pages/settings.html",
    "revision": "ea49a1c13599b0e9d43891b297d9d0b1"
  },
  {
    "url": "pages/settings.js",
    "revision": "45c8a91c416dc9b7f8112adb92fbb2f7"
  },
  {
    "url": "pages/support.html",
    "revision": "7a6dbcbf2b14a183bd1b03fb3847225c"
  },
  {
    "url": "pages/support.js",
    "revision": "b9dc72108aa6602ee5e3eb8614c4913d"
  },
  {
    "url": "pages/termsOfUse.html",
    "revision": "1d1e25a7eb688f0cd8b57543aeff645f"
  },
  {
    "url": "pages/termsOfUse.js",
    "revision": "1e0462ca4750db68f111cd17bbd9d740"
  },
  {
    "url": "providers/BlockchainExplorerProvider.js",
    "revision": "2d5f13fd98892d502669691b14ccafa0"
  },
  {
    "url": "service-worker-raw.js",
    "revision": "6c2369101384a758e7dec6310e31c2b3"
  },
  {
    "url": "translations/de.json",
    "revision": "8419088c136950ba8f54bf8406499eac"
  },
  {
    "url": "translations/en.json",
    "revision": "0831e05ef8b0ac56fe426f0523f90fe0"
  },
  {
    "url": "translations/fr.json",
    "revision": "a23ac7435d1ded1d18b12dfec77a952c"
  },
  {
    "url": "translations/gr.json",
    "revision": "1d3e708692e22a99faf7a1ae5ea5b6f9"
  },
  {
    "url": "translations/hu.json",
    "revision": "9c39fc4f4727e6627e802536ee98de08"
  },
  {
    "url": "translations/it.json",
    "revision": "14983de4ce297a78e615b7f6254de543"
  },
  {
    "url": "translations/ru.json",
    "revision": "f5e2d1ae52ce62299482c9930d8de419"
  },
  {
    "url": "translations/sr.json",
    "revision": "69d0552902bce1feaa356f97d77a6ec2"
  },
  {
    "url": "utils/Url.js",
    "revision": "45e36979706bfce2bcb7dbc596feb782"
  },
  {
    "url": "workers/TransferProcessing.js",
    "revision": "ca329b3ed32356d4ddd90fcc9e54fdfd"
  },
  {
    "url": "workers/TransferProcessingEntrypoint.js",
    "revision": "b6265f8fb46e2a2b06bf008aba2568dc"
  }
]);
self.addEventListener('message', function (event) {
    if (!event.data) {
        return;
    }
    switch (event.data) {
        case 'force-activate':
            self.skipWaiting();
            self.clients.claim();
            self.clients.matchAll().then(function (clients) {
                clients.forEach(function (client) { return client.postMessage('reload-window-update'); });
            });
            break;
        default:
            // NOOP
            break;
    }
});
