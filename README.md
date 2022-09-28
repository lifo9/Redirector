# Redirector
Web extension, which allows you to set custom redirects. It is useful for redirecting popular sites to alternative frontends (e.g. youtube to invidious), or restoring functionality (e.g. automatic redirection to Zoom's web client).

## Firefox installation
1. [Install](https://addons.mozilla.org/en-US/firefox/addon/my-redirector/)
2. Right click on extension icon -> Manage Extension -> Three dots -> Preferences
3. Import [Example rules](https://github.com/lifo9/Redirector/files/9641757/rules_1664131688943.txt) (change extension to `.json`)
4. Profit

## Chrome installation
1. [Download](https://github.com/lifo9/Redirector/releases/download/release/redirector-1.0.0.zip) & unzip
2. Go to [chrome://extensions](chrome://extensions)
3. Developer mode ON
4. Load unpacked
5. Click details -> extension options
6. Import [Example rules](https://github.com/lifo9/Redirector/files/9641757/rules_1664131688943.txt) (change extension to `.json`)
7. Profit

# Build it yourself
```
yarn install
yarn build
```
or
```
npm install
npm run build
```

# iOS Build
```
yarn install
yarn build
xcrun safari-web-extension-converter dist --no-open --no-prompt --project-location safari-web-extension
cd safari-web-extension/Redirector
fastlane init scheme: 'Redirector (iOS)'
fastlane gym scheme: 'Redirector (iOS)' -x "-allowProvisioningUpdates"
fastlane pilot upload app_platform: 'iOS' --skip_submission
```

https://user-images.githubusercontent.com/40486100/192162460-89ff4857-c958-4df0-b8a8-da284c0a05ec.mov
