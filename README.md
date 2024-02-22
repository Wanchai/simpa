# Simpa

Your Open-Source Analytical App for Websites

> "It simple, lightweight and portable!" - 5/5
> <sub>The creator. </sub>

The 2 main features are:

- a line chart showing unique visitors
- a table with the top referers

**If you are tired of google analytics complexity, want your data back, want to get rid of third party providers (and get rid of the cookie warning at the same time), this is for you!**

#### Tech Stack

- Handlebars
- Bootstrap
- NestJs
- TypeORM
- SQLite

#### Screen capture

![alt text](public/screenshot.png 'screenshot')

## Install

### Server Side

Set env variables. You can change them in the docker-compose.yml or set them your favorite CI tool.

```
- SESSION_SECRET << Random key
- PASSWORD << To access the Admin Panel
- FILTER_ORIGIN << true or false (default) See below
- SIMPA_ADDRESS << http://20.20.20.20 or https://myapp.ext (no slash at the end)
```

Parameter `FILTER_ORIGIN` is important as it filters requests coming from the places not related to the URL you entered while adding an new site (see Admin). If you add a new site with **mydomaine.com** and set `FILTER_ORIGIN` to true, requests not coming from mydomaine.com pages' won't be counted.

SIMPA_ADDRESS needs to be set **before** building the app.

#### Docker Compose

```
docker compose up
```

#### Admin

Once it's installed you can log to the admin using the password set in the env variables.

Then, you can add new sites to track. If you set `FILTER_ORIGIN` to true, make **SURE** you enter the right URL for your site as it will use that string to filter incoming requests.

Once it's done, the site will be displayed with its ID. Use it in `SITE_ID` below.

### Client Side

Full example in _examples/index.html_

1. Add this inside `<head></head>` and replace --YOURHOST-- by your Simpa address.

```
  <script src="https://--YOURHOST--/tracker/js"></script>
```

2. Add this just before `</body>` and replace --SITE_ID--

```
  <script> march("--SITE_ID--"); </script>
```

A key is placed on the localStorage to count visits only once a day per device.

## Dev & Debug

```
git clone
npm run start:debug
```

### How it works

- the client grabs some js code from your server
- the _march_ function calls the server with the site's ID
- the server checks everything is right and update the DB

### DB

```bash
  npm run migration:generate src/migrations/NAME
  npm run migration:run
```
