/* eslint no-param-reassign: 0 */

import { lookup } from 'mime-types';

const WEBPACK_COMPILATION_HOOK = 'compilation';
const HTML_PLUGIN_BEFORE_PROCESS = 'html-webpack-plugin-before-html-processing';
const HTML_PLUGIN_ALTER_ASSETS = 'html-webpack-plugin-alter-asset-tags';
export const FAVICON_PLUGIN = 'FaviconPlugin';

function normaliseConfig(config) {
  return {
    name: config.name || '',
    short_name: config.short_name || config.shortName || '',
    description: config.description || null,
    dir: config.dir || 'auto',
    lang: config.lang || 'en-US',
    display: config.display || 'standalone',
    orientation: config.orientation || 'any',
    start_url: config.start_url || config.startUrl || '/',
    background_color: config.background_color || config.background_colour || config.backgroundColor || config.backgroundColour || '#fff',
    theme_color: config.theme_color || config.theme_colour || config.themeColor || config.themeColour || '#fff',
    icons: config.icons || [],
    prefer_related_applications: config.prefer_related_applications ||
      config.preferRelatedApplications ||
      false,
    related_applications: config.related_applications || config.relatedApplications || [],
    scope: config.scope || '/',
  };
}

export default class WebappManifestPlugin {
  constructor(config) {
    this.config = { ...config };
  }

  compilationHook() {
    const config = this.config;
    return function hook(compilation) {
      compilation.plugin(HTML_PLUGIN_BEFORE_PROCESS, (htmlData, callback) => {
        let publicPath = this.options.output.publicPath;
        if (publicPath.length > 0 && publicPath[publicPath.length - 1] !== '/') {
          publicPath += '/';
        }
        htmlData.html = htmlData.html.replace('</head>', `  <link rel="manifest" href="${publicPath}manifest.json">\n</head>`);
        // we want to inject our manifest into the head
        callback(null, htmlData);
      });

      compilation.plugin(HTML_PLUGIN_ALTER_ASSETS, (htmlData, callback) => {
        const assets = Object.keys(compilation.assets);
        if (config.icons === FAVICON_PLUGIN) {
          // use the favicon
          const images = assets.filter(a => a.includes('android-chrome-'));
          config.icons = images.map(image => ({ src: image, type: lookup(image), sizes: image.match(/(\d{2,3}x\d{2,3})/g)[0] }));
        }
        const source = JSON.stringify(normaliseConfig(config), null, 2);
        compilation.assets['manifest.json'] = {
          source: () => source,
          size: () => source.length,
        };
        callback(null, htmlData);
      });
    };
  }

  apply(compiler) {
    compiler.plugin(WEBPACK_COMPILATION_HOOK, this.compilationHook());
  }
}
