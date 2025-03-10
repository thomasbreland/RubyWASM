# README

Example of [wasmify-rails](https://github.com/palkan/wasmify-rails) using the [Getting Started with Rails](https://guides.rubyonrails.org/getting_started.html) example project.

## Versions

Ruby 3.3.6

Rails 8.0.1

wasmify-rails 0.2.3

Node 18

Yarn 1.22.22

Had to install `apt install unzip` and [wasi-vfs](https://github.com/kateinoigakukun/wasi-vfs) for wasmify-rails, the latter of which was made easier with [Homebrew](https://brew.sh/)

## Issues encountered

- Could not get to run in LibreWolf/Firefox, but can run in Edge/Chrome
- Had to exclude gem "image_processing", "~> 1.2" from wasm group
- bigdecimal kept being included even though ignored, so downgraded Ruby versions to 3.3.6 from 3.4.2 and that seems to have resolve it; may revisit this later to ensure it was the actual cause
- Had to set the base URL in the generated vite.config.js
- Had to change scope for service worker in the generated boot.js

Possibly relevant to bigdecimal / Ruby version issue: https://github.com/ruby/bigdecimal/issues/289

## Notes

- Ensure that branch name in ci.yml matches branch name in origin
- Changed Dependabot frequency to monthly

## Known issues

- Does not pass wasmify:pack:core:validate, so expect runtime errors

## todo

- Add a migration to add a demo user
