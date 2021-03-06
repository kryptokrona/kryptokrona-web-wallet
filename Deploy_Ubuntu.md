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

Start your Kryptokrona node. The Kryptokrona daemon must be running with the following cli arguments

	'./kryptokrona --enable-cors="*" --enable-blockexplorer --rpc-bind-ip=0.0.0.0'
    './kryptokrona --enable-cors="*" --enable-blockexplorer --rpc-bind-ip=0.0.0.0 --rpc-bind-port=11898'

ensure your node is fully sync'd with the Kryptokrona network before you proceed to the next step.

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




