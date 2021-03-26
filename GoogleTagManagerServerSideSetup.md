# Server Side Tagging for Google Tag Manager | Basic Setup Guide

The goal of this guide is to walk through the steps needed to get Google Tag Manager set up through Server Side Tagging.

## Table of Contents
1. [Required Sites and Resources](#required-sites-and-resources)
2. [Useful Links](#useful-links)
3. [Walkthrough](#walkthrough)

## Required Sites and Resources
These are the sites you'll need access to with a login set up already:

- Google Analytics  
https://analytics.google.com/
It will be necessary to have two properties, one with UA and one with GA4

- Google Tag Manager  
https://tagmanager.google.com/
Two containers are required, one will actually manage the tags and events (web container) and one will provide the analytics/tracking sripts (server container)

- Google Cloud Platform (AppEngine)  
https://console.cloud.google.com/appengine
This will be hosting the GTM server container, and configuration will be required to have the container point to the correct domain

- Google Search Console  
https://search.google.com/search-console
You will need to have set up your website so you are registered as a verified owner

- Some server hosting platform

- Some DNS hosting platform, with ability to edit DNS records

## Useful Links
- Overview on the concepts  
https://www.getelevar.com/guides/server-side-tagging/overview/
- Full walkthrough on it by Simo Ahava  
https://www.simoahava.com/analytics/server-side-tagging-google-tag-manager/
- Facebook Conversion API  
https://developers.facebook.com/docs/marketing-api/conversions-api

## Walkthrough

Throughout the guide, various bits of data will be referenced that change based on your setup (id's and whatnot). For consistency, these values will be defined here, but substitute based on your setup.

Assumptions are:
- that you already have a server/website up
- the ability to update your DNS records
- that your website is set up on Google Search Console
- that you already have yourself registered on all of the google platforms listed above

#### Values
- <WEBSITE_URL>: mywebsite.com
- <TRACKING_SUBDOMAIN>: metrics
- <GOOGLE_ANALYTICS_UA_PROPERTY_ID>: UA-xxxxxxxxx-x
- <GOOGLE_ANALYTICS_GA4_PROPERTY_ID>: G-xxxxxxxxxx
- <GOOGLE_TAG_MANAGER_WEB_CONTAINER_ID>: GTM-xxxxxxx
- <GOOGLE_CLOUD_PLATFORM_PROJECT_ID>: gtm-xxxxxxx-xxxxx
- <DNS_RECORDS>

1. Set up two properties in Google Analytics
  - property one will be UA, remember its ID as <GOOGLE_ANALYTICS_UA_PROPERTY_ID>
  - property two will be G4A, remember its ID as <GOOGLE_ANALYTICS_GA4_PROPERTY_ID>
2. Set up two containers in Google Tag Manager
  - property one will have `target platform` set to `Web`. Remember its ID as <GOOGLE_TAG_MANAGER_WEB_CONTAINER_ID>
  - property two will have `target platform` set to `Server`.
3. Get info from the server container and save the tagging URL
  - Open up the GTM server container and go to "Admin -> Container Settings"
  - Find `Google Cloud Platform Project ID`. This will be <GOOGLE_CLOUD_PLATFORM_PROJECT_ID>
  - Set `Tagging Server URL` to `https://<TRACKING_SUBDOMAIN>.<WEBSITE_URL>`
4. Set the custom domain in the Google Cloud Platform
  - Browse to the AppEngine website and open the project that has the ID of <GOOGLE_CLOUD_PLATFORM_PROJECT_ID>
  - Go to "Settings -> Custom Domains", select `Add a custom domain`
  - Select your domain <WEBSITE_URL> and hit continue. If you have not been registered via the Google Search Console it will not show up here
  - Enter your full URL with subdomain as <TRACKING_SUBDOMAIN>.<WEBSITE_URL>
  - Save mappings and note what DNS records are displayed as <DNS_RECORDS>, you will use these later when updating DNS
  - Finish up the process. SSL security will take a little while to set up, things will not be available until then.
5. Set up your DNS records
  - go to wherever you edit DNS records for your web host
  - Apply whatever <DNS_RECORDS> you need
6. Set up the necessary variables/triggers/tags on the GTM web container
  - Open the GTM web container
    1. Set up the google analytics variable
       - Browse to `Variables` and create a new User-Defined Variable
       - Set the variable type as `Google Analytics Settings`
       - set `Tracking ID` to <GOOGLE_ANALYTICS_UA_PROPERTY_ID>
       - set `Cookie Domain` to auto
       - set `Transport URL` (under advanced configuration) to `https://<TRACKING_SUBDOMAIN>.<WEBSITE_URL>`
       - save the variable
    2. Set up the GA4 tag
      - Browse to `Tags` and create a new tag
      - Set the type as `Google Analytics: GA4 Configuration`
      - set `Measurement ID` to <GOOGLE_ANALYTICS_GA4_PROPERTY_ID>
      - check `Send a page view event when this configuration loads`
      - In `Fields to Set` add a new row with:
        - Field Name: `transport_url`
        - Value: `https://<TRACKING_SUBDOMAIN>.<WEBSITE_URL>`
      - Add a new trigger and use the default `All Pages` trigger
      - save it
    3. Set up the google UA tag
      - Browse to `Tags` and create a new tag
      - Set the type as `Google Analytics: Universal Analytics`
      - set `Track Type` to `Page View`
      - Set `Google Analytics Settings` to the variable created earlier (Set up the google analytics variable)
      - Add a new trigger and use the default `All Pages` trigger
      - save it
7. Set up the necessary variables/triggers/tags/clients on the GTM server container
  - Open the GTM web container
    1. Set up the UA trigger
       - Browse to `Triggers` and create a new trigger
       - Set the type as `Custom`
       - Set it to trigger on `Some Events`
       - Configure rule as: `Client Name` `equals` `Universal Analytics`
       - save it
    2. Set up the GA4 tag
      - Browse to `Tags` and create a new tag
      - Set the type as `Google Analytics: GA4`
      - Set `Measurement ID` to <GOOGLE_ANALYTICS_GA4_PROPERTY_ID>
      - Set the `Event Name` to `page_view` (or whatever event you want to watch)
      - Add the trigger, as the UA trigger created in the previous step
      - save it
    3. Set up the Google UA Tag
      - Browse to `Tags` and create a new tag
      - Set the type as `Google Analytics: Universal Analytics`
      - Add the trigger, as the UA trigger created in the previous step
      - save it
    4. Set up the GA4 Client
      - Browse to `Clients` and create a new client
      - Set the type as `Google Analytics: GA4`
      - check `Default GA4 paths`
      - check `Default gtag.js paths for specific IDs`
      - Add Measurement ID with a value of <GOOGLE_ANALYTICS_GA4_PROPERTY_ID>
      - save it
    5. Set up the Google UA Client
      - Browse to `Clients` and create a new client
      - Set the type as `Google Analytics: Universal Analytics`
      - check `Default Universal Analytics paths`
      - check `Default gtag.js paths for specific IDs`
      - Add Measurement ID with a value of <GOOGLE_ANALYTICS_UA_PROPERTY_ID>
      - save it
    6. Set up the web container client (needed for proxy of analytics.js script)
      - Browse to `Clients` and create a new client
      - Set the type as `Google Tag Manager: Web Container`
      - Add Container ID with a value of <GOOGLE_TAG_MANAGER_WEB_CONTAINER_ID>
8. Add script to your website to load the GTM Web Container, replacing the variables
  - Remove any existing gtag scripts from your site
  - Add the following code to the site, before the end of the `<head>` tag. Note, this is based on the code that you would find under the installation instructions in the Google Analytics page. However, some tweaks are made to use the GTM server container instead.
  - variables replaced are: `<GOOGLE_TAG_MANAGER_WEB_CONTAINER_ID>`, `<TRACKING_SUBDOMAIN>`, `<TRACKING_SUBDOMAIN>`

```js
<!-- Global site tag (gtag.js) - Google Analytics -->
<!-- Google Tag Manager -->
<script>
(function(w,d,s,l,i, k) {
  w[l]= w[l] || [];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0], j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=k+'/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','<GOOGLE_TAG_MANAGER_WEB_CONTAINER_ID>', 'https://<TRACKING_SUBDOMAIN>.<TRACKING_SUBDOMAIN>');
</script>
<!-- End Google Tag Manager -->
```