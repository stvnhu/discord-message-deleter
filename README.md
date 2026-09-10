
# Discord Message Deleter

## Dependencies

- Linux based operating system
- Google Chrome
- node
- npm

## Installation

- Clone repo
```sh
git clone git@github.com:stvnhu/discord-message-deleter.git
```
- Move into cloned repo
```sh
cd discord-message-deleter
```
- Install npm packages
```sh
npm install
```

## Usage

- move into cloned repo
```sh
cd discord-message-deleter
```
- Clone Google Chrome profile
```sh
cp -r "$HOME/.config/google-chrome ./chrome_profile"
```
- Open google chrome with remote debugging port 9222.
```sh
google-chrome-stable --remote-debugging-port=9222 --user-data-dir="./chrome_profile"
```
- Open a discord tab.
- Using the search bar search for messages you want to delete.
- Run the deleter.
```sh
node index.js
```
