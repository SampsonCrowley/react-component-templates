'use strict';

const path = require('path');
const fs = require('fs');
const url = require('url');

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const envPublicUrl = process.env.PUBLIC_URL;

function ensureSlash(path, needsSlash) {
  const hasSlash = path.endsWith('/');
  if (hasSlash && !needsSlash) {
    return path.substr(path, path.length - 1);
  } else if (!hasSlash && needsSlash) {
    return `${path}/`;
  } else {
    return path;
  }
}

const getPublicUrl = appPackageJson =>
  envPublicUrl || require(appPackageJson).homepage;

// We use `PUBLIC_URL` environment variable or "homepage" field to infer
// "public path" at which the app is served.
// Webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
function getServedPath(appPackageJson) {
  const publicUrl = getPublicUrl(appPackageJson);
  const servedUrl =
    envPublicUrl || (publicUrl ? url.parse(publicUrl).pathname : '/');
  return ensureSlash(servedUrl, true);
}

// config after eject: we're in ./config/
module.exports = {
  dotenv: resolveApp('.env'),
  appBuild: resolveApp('build'),
  appDemoBuild: resolveApp('demo'),
  appPublic: resolveApp('public'),
  appHtml: resolveApp('public/index.html'),
  appIndexJs: resolveApp('src/demo/index.js'), // CRL: Updated for demo purposes
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
  yarnLockFile: resolveApp('yarn.lock'),
  testsSetup: resolveApp('src/setupTests.js'),
  appNodeModules: resolveApp('node_modules'),
  publicUrl: getPublicUrl(resolveApp('package.json')),
  servedPath: getServedPath(resolveApp('package.json')),

  // CRL: New paths for demo build
  appDemoIndexJs: resolveApp('src/demo/index.js'),
  appDemoSrc: resolveApp('src/demo'),

  // CRL: New paths for library
  appLibIndexJs: resolveApp('src/lib/index.js'),
  appLibSrc: resolveApp('src/lib'),

  // CRL: assets sub path
  assetsBuild: resolveApp('build/assets'),
  assetsIndexJs: resolveApp('src/lib/assets/index.js'),
  assetsSrc: resolveApp('src/lib/assets'),

  // CRL: components sub path
  componentsBuild: resolveApp('build/components'),
  componentsIndexJs: resolveApp('src/lib/components/index.js'),
  componentsSrc: resolveApp('src/lib/components'),

  // CRL: contexts sub path
  contextsBuild: resolveApp('build/contexts'),
  contextsIndexJs: resolveApp('src/lib/contexts/index.js'),
  contextsSrc: resolveApp('src/lib/contexts'),

  // CRL: form-components sub path
  formComponentsBuild: resolveApp('build/form-components'),
  formComponentsIndexJs: resolveApp('src/lib/form-components/index.js'),
  formComponentsSrc: resolveApp('src/lib/form-components'),

  // CRL: helpers sub path
  helpersBuild: resolveApp('build/helpers'),
  helpersIndexJs: resolveApp('src/lib/helpers/index.js'),
  helpersSrc: resolveApp('src/lib/helpers'),

  // CRL: pages sub path
  pagesBuild: resolveApp('build/pages'),
  pagesIndexJs: resolveApp('src/lib/pages/index.js'),
  pagesSrc: resolveApp('src/lib/pages'),

  polyfillsBuild: resolveApp('build/polyfills'),
  polyfillsIndexJs: resolveApp('src/lib/polyfills/index.js'),
  polyfillsSrc: resolveApp('src/lib/polyfills'),
};
