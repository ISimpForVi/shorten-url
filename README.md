# shorten-url
A Powercord plugin that allows you to shorten image URLs

# Set Up
This plugin will POST to a saved URL that is defined in the settings menu.
The plugin needs to have a destination URL that it can POST to otherwise it will not work 
(there isn't any error handling yet, so if an error occurs, it will be thrown into the console)

The content POSTed will always be application/json with the body of
```
{
 url: the URL of the target image
}
```
This may be subject to change in the future and new parameters may be added.

# Limitations
The limitations of this plugin are:

 - The destination URL needs to have the correct CORS preflight headers
 - The destination URL needs to use the HTTPS protocol (CORS requires HTTPS)

These limitations mean that this plugin won't work for everyone.

### Solution to the Limitations
There are some solutions to these limitations:

CORS Solutions
 - Use a CORS stripping proxy service (I intend to host one in the near future)
 - Set up CORS headers on your web server for `canary.discordapp.com`
 
HTTPS Solutions
 - Use CloudFlare and enforce set an enforce HTTPS page rule
 - Use Let's Encrypt free SSL certificates to generate a SSL certificate

### Future Solutions
I intend to host a CORS headers stripping service in the near future to bypass these issues entirely.
Keep an eye out on this repo so that when I do roll it out, you can use it.
