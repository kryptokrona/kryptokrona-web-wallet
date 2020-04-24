# How to compile & Deploy (Ubuntu)

# Step 1: Install the Dot Net Core SDK

Follow these instructions to instal dotnetcore sdk with package manager:
https://www.microsoft.com/net/download/linux-package-manager/ubuntu16-04/sdk-2.1.402

# Step 2: git clone your repo

open Program.cs in the root of the cloned repo and remove or comment out the below lines:

        #region Windows Hosting Under IIS
            //comment this region out if using anything other than IIS
                .UseKestrel()
                .UseIISIntegration()
                .UseContentRoot(Directory.GetCurrentDirectory())
        #endregion

then, open Startup.cs, find the line: app.UseHttpsRedirection(); and delete it

Save the file.... 

# Step 3: Build.... 

First build the typescript and service workers by running the following three commands:

	npm install
	node ./node_modules/typescript/bin/tsc --project tsconfig.prod.json
	node build.js

** Note, if you run these AFTER building the app (ie: you change some source, you need to delete the below two folders otherwise you'll get TS build errors:

	bin/Release
	obj/Release

now, run the following to build the source: 

	dotnet publish --configuration Release

The runtime files are found in : [source root folder]/bin/Release/netcoreapp2.1/publish

At this point your app is ready to run, but it will only work on http://localhost:port, which is why we need Nginx

# Step 4: Install Nginx
Below is a summary of the steps required, more details documentation can be found here:
https://docs.microsoft.com/en-us/aspnet/core/host-and-deploy/linux-nginx?view=aspnetcore-2.1&tabs=aspnetcore2x

Run the following commands:

	sudo nginx=stable # use nginx=development for latest development version
	sudo add-apt-repository ppa:nginx/$nginx
	sudo apt-get update
	sudo apt-get install nginx

# Step 5: Start Nginx 

run: 
	sudo service nginx restart

Now, verify that Nginx is working by going to http://<your servers ip> in a browser on your desktop. You should see a stark page with something like:

Welcome to nginx!
If you see this page, blah blah blah... 

# Step 6: Configure Nginx

	sudo nano /etc/nginx/sites-available/default

then paste the following into the file:

server {
    listen        80;
    server_name   *;
    location / {
        proxy_pass         http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection keep-alive;
        proxy_set_header   Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
    }
}


** note that you can replace the domain names with anything you like above - I configured mine as :
    server_name   *;

effectively telling it to respond to any request, regardless of domain... 
more details on this here, with best practice examples, the above is just a basic implementation that will work, but suggest for your production environment it should definately have a default server and respond on host headers for the wallet... 


Save the file

# Step 7: 

Start your Plenteumd node. The Plenteum daemon must be running with the following cli arguments

	'./kryptokronad --enable-cors="*" --enable-blockexplorer --rpc-bind-ip=0.0.0.0'

ensure your node is fully sync'd with the Plenteum network before you proceed to the next step.

# Step 8:

run: 

	sudo nginx -t

you should see:

nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful

Then run: 

	sudo nginx -s reload

Now, if you try browse to the site, you should see "Bad Gateway"... this is all correct.

Then, from the "publish" diretory above, run:

	dotnet WebWallet.dll

Now, browse to your spiffy new webwallet :-)

./kryptokronad --enable-cors="*" --enable-blockexplorer --rpc-bind-ip=0.0.0.0 --rpc-bind-port=11898


server {
    listen        80;
    server_name   wallet.kryptokrona.se;
    location / {
        proxy_pass         http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection keep-alive;
        proxy_set_header   Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
    }
    location /api {
        proxy_pass         http://localhost:11898;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection keep-alive;
        proxy_set_header   Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
    }
    access_log /spool/vhost/logs/$host 
    log_format combined '$proxy_host - $upstream_addr - $remote_addr - $remote_user [$time_local] '
                    '"$request" $status $body_bytes_sent '
                    '"$http_referer" "$http_user_agent"';
}

<VirtualHost *:80>
        # The ServerName directive sets the request scheme, hostname and port that
        # the server uses to identify itself. This is used when creating
        # redirection URLs. In the context of virtual hosts, the ServerName
        # specifies what hostname must appear in the request's Host: header to
        # match this virtual host. For the default virtual host (this file) this
        # value is not decisive as it is used as a last resort host regardless.
        # However, you must set it for any further virtual host explicitly.
        ServerName wallet.kryptokrona.se
        ServerAdmin webmaster@localhost
        DocumentRoot /var/www/html
        # Available loglevels: trace8, ..., trace1, debug, info, notice, warn,
        # error, crit, alert, emerg.
        # It is also possible to configure the loglevel for particular
        # modules, e.g.
        #LogLevel info ssl:warn
        ErrorLog ${APACHE_LOG_DIR}/error.log
        CustomLog ${APACHE_LOG_DIR}/access.log combined
        # For most configuration files from conf-available/, which are
        # enabled or disabled at a global level, it is possible to
        # include a line for only one particular virtual host. For example the
        # following line enables the CGI configuration for this host only
        # after it has been globally disabled with "a2disconf".
        #Include conf-available/serve-cgi-bin.conf
        ProxyPass / http://127.0.0.1:5000
        ProxyPassReverse / http://127.0.0.1:5000
        ProxyPass /api http://127.0.0.1:11898
        ProxyPassReverse /api http://127.0.0.1:11898
</VirtualHost>
# vim: syntax=apache ts=4 sw=4 sts=4 sr noet



getTransactionsForBlocks(startBlock: number, localNode: string = ''): Promise<RawDaemonTransaction[]> {
        let self = this;
        return new Promise<RawDaemonTransaction[]>(function (resolve, reject) {
            //old way, hitting cache
            if (localNode === '') {
                $.ajax({
                    url: config.apiUrl + "getwalletsyncdata",
                    method: 'POST',
                    dataType: "json",
                    contentType: 'application/json',
                    data: JSON.stringify({ 'blockCount': 100, 'scanHeight': startBlock })
                }).done(function (response: any) {
                    let blocks = response;
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
                }).fail(function (data: any) {
                    reject(data);
                });
            } else {
                console.log('fetching from node ' + localNode);
                var blocks = [];
                for (var i = startBlock; i < startBlock + 100; i++) {
                    blocks.push(i);
                }
                $.ajax({
                    url: "http://" + localNode + "/get_blocks_details_by_heights", //self.serverAddress replace with setting to node
                    method: 'POST',
                    dataType: "json",
                    processData: false,
                    data: JSON.stringify({ blockHeights: blocks })
                }).done(function (data: any) {
                    let blocks: any = data.blocks;
                    let txs: RawDaemonTransaction[] = [];
                    for (var i = 0; i < blocks.length; i++) {
                        for (var j = 0; j < blocks[i].transactions.length; j++) {

                            // transform Transactions
                            let rawTx = blocks[i].transactions[j];
                            let tx: any = {};
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
                                let vin: any = {};
                                let input = rawTx.inputs[x];
                                vin.amount = input.data.input.amount;
                                vin.k_image = input.data.input.k_image;
                                input = null;
                                tx.vin.push(vin);
                            }
                            for (var x = 0; x < rawTx.outputs.length; x++) {
                                let vout: any = {};
                                let output = rawTx.outputs[x];
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
                }).fail(function (data: any) {
                    console.log(data);
                    reject(data);
                });
            }
        });
    }