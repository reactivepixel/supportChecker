# Slack Hack Night

## Installation
Requirements
* Brew ( [Video: How to Install](https://youtu.be/lI_2DWnYo8o) )
* NodeJS ( [Video: How to Install](https://youtu.be/sD4IQjyv9f8) )


#### MongoDB Installation

With _Brew_ already installed you can run the following commands to install MongoDB, setup your database folder, and assign the correct permissions to it.

> Note: MongoDB Installation is required but you can skip if you already have it installed.

```
brew install mongodb
sudo mkdir -p /data/db
sudo chown -R $(whoami): /data
```

#### Get the Code

Fork this repo onto your own github account.

>In the top-right corner of this page, click Fork

Clone your forked repo to your laptop.
> This will download the files into your current folder in terminal. Make certain to navigate to a folder where you want this project to live.

```
git clone your_forked_repo_url
```

Install the dependencies. Navigate to your code via terminal and command:

```
npm install
```

Additional Global Installs to make your life easier.

```
npm i -g nodemon
```
#### Get the Bot's Token

Obtain the Bot Token from the an Admin for your Slack. The link will be subdomain.slack.com/apps/A0F7YS25R-bots

Create an ```.env``` file on the root of your project with the token.

```
echo "REALTIME_SLACK_TOKEN=xoxb-............." > .env
```

#### Start Your Servers

Start your MongoDB server in a separate terminal window.
```
mongod
```

Start the bot.

```
nodemon src/server.js
```

## Interacting / Testing the Bot


## Interesting things the Bot Does

* Send message to new user account that is created. (app/slack/onboard.js)
* When the bot Starts, broadcast message (currently to #bot_test). (app/slack/default_connection.js)
* Respond to reaction emoji added (app/slack/personality.js)
* constantly ping heroku to prevent a sleep (app/app.js)

### How to Release

### Resources

* [Video Walkthrough on Setting up your Environment](https://youtu.be/7KRkOCCpBCo)
* [Botkit](https://howdy.ai/botkit/)
* [WDD Slack](https://wdd.slack.com)
* [Slack Real Time Messaging API (RTM)](https://api.slack.com/rtm)
