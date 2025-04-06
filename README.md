# README

Example of [wasmify-rails](https://github.com/palkan/wasmify-rails) using the [Getting Started with Rails](https://guides.rubyonrails.org/getting_started.html) example project.

## Versions

Ruby 3.3.6

Rails 8.0.1

wasmify-rails 0.2.3

Node 18

Yarn 1.22.22

Had to install `apt install unzip` and [wasi-vfs](https://github.com/kateinoigakukun/wasi-vfs) for wasmify-rails, the latter of which was made easier with [Homebrew](https://brew.sh/)

## Issues encountered and resolved

- Had to exclude gem "image_processing", "~> 1.2" from wasm group
- bigdecimal kept being included even though ignored, so downgraded Ruby versions to 3.3.6 from 3.4.2 and that seems to have resolve it; may revisit this later to ensure it was the actual cause (see link below)
- Had to add COOP and COEP headers in service worker because GitHub Pages does not have them
- Had to remove ActionText rich text due to nokogiri error in WASM

Possibly relevant to bigdecimal / Ruby version issue: https://github.com/ruby/bigdecimal/issues/289

## Notes

- Ensure that branch name in ci.yml matches branch name in origin
- Changed Dependabot frequency to monthly

## Build and run instructions

### Normal flow

1. Skip [rails wasmify:install](https://github.com/palkan/wasmify-rails?tab=readme-ov-file#step-1-binrails-wasmifyinstall) because the relevant environment and configuration files are in source control
1. `rails wasmify:build:core` produce build used for build validation step
1. `rails wasmify:build:core:verify` check it
1. `rails wasmify:pack:core` pack into a Wasm module
1. `rails wasmify:pack:core:verify` check it
1. `rails wasmify:pwa`
1. `yarn --cwd ./pwa/ install`
1. `yarn --cwd ./pwa/ run build` or `yarn --cwd ./pwa/ run dev`

### What is actually working

1. `bundle exec rails wasmify:build`
1. `bundle exec rails wasmify:pack`
1. Skip [rails wasmify:pwa](https://github.com/palkan/wasmify-rails?tab=readme-ov-file#step-4-binrails-wasmifypwa) because the web application files had to be modified so they are committed to the repo
1. `yarn --cwd ./pwa/ install`
1. `yarn --cwd ./pwa/ run build` or `yarn --cwd ./pwa/ run dev`

## Known issues

- Could not get to run in LibreWolf/Firefox, but can run in Edge/Chrome (may just be a setting I need to change on my own systems)
- It may be necessary to manually unregister the service worker after some updates; the fix for this is easy, but just be aware that the service worker produced automatically may not have the best update handling
- Does not pass wasmify:pack:core:validate, so expect runtime errors
- Running in an iframe seems to require disabling CSRF protection: https://github.com/palkan/rails-15min-blog-on-wasm/blob/aa74f98b06b9df1c43b3649208776e8e593f65e8/app/controllers/application_controller.rb
- Email does not work, but that is a known limitation of wamify-rails and is arguably by design
- Only works at root level of site, so I will host it in my root level GitHub Pages and display it in an iframe for this repository until I can fix this. I tried changing the scope for the service worker in the generated boot.js and setting the base URL to "./", and then again through environment variables in the generated vite.config.js, index.html (variable injected through vite.config.js), and boot.js - this required removing index.html from the rollup options - and added self.registration.scope to paths in rails.sw.js (could probably just use a relative path) but continued to run into issues when using a BASE_PATH outside of the root level. I suspect I may need to change something with the routing in Rails, but this is my first time using Rails actually so I will need to study routing.
