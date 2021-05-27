# Svelte Weather App
> Demo project, showing the use of Svelte, TypeScript, and Express to build a weather forecast web app

![Screenshot of this app, in the default display mode, showing today's weather and a short forecast for the next few](https://user-images.githubusercontent.com/17817563/119875840-13d8f400-bedc-11eb-80c8-ab914878e137.png)

## What Is This?
This is a demo full-stack web application, which uses [the AccuWeather API](https://developer.accuweather.com/) to power a multi-day forecast, with selectable location.

It uses Svelte, TypeScript, HTML, CSS, and other web technologies.

## Running
Although you can `cd` to either `/backend` or `/frontend` and run each part of the app individually from its directory, all commands are exposed through the root  `package.json` of this project for convenience.

From the root directory, here is a sample workflow for if you just cloned this repository:

1. `npm install`:
	- Installs all shared dependencies, and then for each part of  the app separately (through `postinstall` hook)
2. Now that dependencies are installed, you can pick how to run or work on the app:
	- `npm run dev`
		- This runs both parts in dev mode, and watches for changes across the entire codebase and reloads if it sees any
	- `npm run build`
		- Builds both the frontend and backend. For Svelte, this means producing an optimized static HTML / JS / CSS output for hosting. For the backend, this means transpiling TypeScript to JS.
	- `npm run serve`
		- This serves both the server and frontend.
		- **Important**: Having run `npm run build` is a pre-requisite to this command - `serve` is expecting that there is already build output ready to serve or execute.
		- Alternatively, you can run `npm run start`, which runs `build` and then `serve`

> Many commands also have optional suffixes if you don't want to work on both parts of the app at the same time. For example, you can use `npm run dev:backend` instead of `npm run dev`, if you just want to work on the API without touching the frontend.

## Design Decisions
This is a mono-repo, which contains both [the frontend](./frontend/), [backend](./backend/), and [commands to run both](./package.json).

- Front-end is built with [Svelte](https://svelte.dev/), [TypeScript](https://www.typescriptlang.org/), and lots of HTML and CSS.
	- [Vite](https://vitejs.dev/) is used for tooling; bundling, local HMR, production builds, etc.
	- The [Halfmoon CSS Framework](https://www.gethalfmoon.com/docs/introduction/) is used, but mostly for some utility classes and default styling
	- CSS variables are used liberally to make theming and tweaking easier
- Back-end is using NodeJS, Express, and TypeScript
	- Since I don't need much in the way of a backend for this (mostly just proxying AccuWeather requests and static file serving), I kept things simple. For a more robust application, I would probably pick and use a full-fledged NodeJS framework, like [NestJS](https://docs.nestjs.com/) or [Hapi](https://hapi.dev/).
	- If I knew that this app was never going to be scaled beyond what it currently is, I would strongly consider serverless as a route - the entire back-end could realistically be built out as one or two *functions*  (and deployed on something like Netlify Functions, AWS Lambda, or GCP Cloud Functions).
	- There is some basic CSRF protection built-in, backed by cookies
- There are some TypeScript types that are shared between the two parts

### Static Serving
By default, this project will serve both the API and the frontend from the same Express server. However, I also made it configurable so that you can decouple them easily.

To decouple, before running `build:frontend`, set an environmental variable for `BACKEND_BASE` to point to the hosted Express endpoint. Then run `build:frontend`, and you can now take the optimized `/dist` and serve anywhere that lets you serve static files; Netlify, various CDNs, shared hosting, etc.

### Known Limitations
The "automatic location" feature, based on IP address, uses [AccuWeather's IP-to-geolocation service](https://developer.accuweather.com/accuweather-locations-api/apis/get/locations/v1/cities/ipaddress), which doesn't always return the most accurate results. Users are asked whether or not the "guessed" location is good enough for them, or if they would like to manually select a location, before forecasting data is fetched.

## Demos:
***Responsive***

![Demo GIF showing the responsiveness of the app when resized](https://user-images.githubusercontent.com/17817563/119874698-bf814480-beda-11eb-8839-88d0e8de117c.gif)

***Multiple Display Modes***
![Demo GIF showing multiple display modes - single card, or carousel](https://user-images.githubusercontent.com/17817563/119875536-b6dd3e00-bedb-11eb-927b-24a6c358a990.gif)

## If I had more time...
If I had more time to work on this, here are the things I would focus on as top priority:

- Localization
- Tests!
- Client-side caching of certain values (such as last location used)
- Server-side caching, to the extent that makes sense
	- For example, per location forecasts could be cached for a short duration. Although a small tweak, if this was scaled up to serve millions of users, a tweak like that could avoid thousands of duplicate requests for popular zip codes.
- Get better graphical assets (such as the weather icons)
