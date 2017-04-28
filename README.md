# Webapp Manifest Plugin

> Create a web application manifest for your PWA based on your webpack build.

## What do?

- During your webpack build, outputs a manifest.json
- Works with [Favicons Webpack Plugin](https://github.com/jantimon/favicons-webpack-plugin) to use the icons inside your manifest
  - You must have `android` icons enabled (it's a default)
- Works with [HTML Webpack Plugin](https://github.com/jantimon/html-webpack-plugin) to insert the manifest URL into your `index.html`
- Comes with some sensible defaults to help you out with [Lighthouse](https://developers.google.com/web/tools/lighthouse/)
  - You'll need to put in *some* effort to get a good score, though.

## How?

In your `webpack.config.js`,

```js
/* ES2015 */
import WebappManifestPlugin from 'webapp-manifest-plugin';

/* ES5 */
var WebappManifestPlugin = require('webapp-manifest-plugin').default;

/* -- futher down -- */
"plugins": [
  /* ... */,
  new WebappManifestPlugin(),
]
```

The constructor takes a single argument, which is an object containing the properties of the manifest.
You can use either the actual (snake_case) property names, or camelCase alternatives.

The defaults are:

```js
const config = {
  name: "",
  shortName: "",
  description: null,
  dir: 'auto',
  lang: 'en-US',
  display: 'standalone',
  orientation: 'any',
  startUrl: '/',
  backgroundColor: '#fff',
  themeColor: '#fff',
  icons: [],
  preferRelatedApplications: false,
  relatedApplications: [],
  scope: '/'
}
```

If you'd like to use the [Favicon Plugin](https://github.com/jantimon/favicons-webpack-plugin) to generate your icons for you,
there is one extra thing.

In your `webpack.config.js`,

```js
/* ES2015 */
import FaviconsPlugin from 'favicons-webpack-plugin';
import WebappManifestPlugin, { FAVICON_PLUGIN } from 'webapp-manifest-plugin';

/* ES5 */
var FaviconsWebpackPlugin = require('favicons-webpack-plugin')
var WebappManifest = require('webapp-manifest-plugin');
var WebappManifestPlugin = WebappManifest.default;
var FAVICON_PLUGIN = WebappManifest.FAVICON_PLUGIN;

/* -- futher down -- */
"plugins": [
  /* ... */,
  new FaviconsWebpackPlugin('my-logo.png'),
  new WebappManifestPlugin({ icons: FAVICON_PLUGIN }),
]
```

You can see more how to set that up [here](https://github.com/jantimon/favicons-webpack-plugin).
That constant is just a flag to let the plugin know to use the icons generated with the plugin.

That's it.  Throw your config in there.
