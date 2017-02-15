# Support Bot

## Installation
Requirements
* Brew ( [Video: How to Install](https://youtu.be/lI_2DWnYo8o) )
* NodeJS ( [Video: How to Install](https://youtu.be/sD4IQjyv9f8) )


#### MySQL Installation

With _Brew_ already installed you can run the following command to install Mysql / MariaDB (same but better).

> Note: MySQL or MariaDB Installation is required but you can skip if you already have it installed.

```
brew install mariadb
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

Foreman is a required global install. This will let you run the bot and reporting services simultaneously.

```
npm i -g foreman
```

#### Obtain/Generate your Bot's Token

Obtain the Bot Token from the an Admin for your Slack. The link will be yourSubDomain.slack.com/apps/A0F7YS25R-bots

Create an ```.env``` file on the root of your project with the token.

```
echo "REALTIME_SLACK_TOKEN=xoxb-Your_Token_Here" > .env
```


Add your local connection string to the env file using the format provided here. If this is misconfigured when starting your bot you will see _ECONNECTION_ issues.
```
echo "DB_URI=mysql://DBUser:DBPassword@Host:Port/DBName" >> .env
```

#### Start Your Servers

Start your MySQL server before turning on the Bot.
```
mysql.server start
```

Start the bot and reporting tool with _Foreman_.

```
nf start
```

## Interacting / Testing the Bot

No unit tests currently.

## Interesting things the Bot Does

* Send message to new user account that is created. (app/slack/onboard.js)
* When the bot Starts, broadcast message (currently to #bot_test). (app/slack/default_connection.js)
* Respond to reaction emoji added (app/slack/personality.js)
* constantly ping heroku to prevent a sleep (app/app.js)

### How to Release

Automated pipeline not currently in place.

### Resources

* [Video Walkthrough on Setting up your Environment](https://youtu.be/7KRkOCCpBCo)
* [Botkit](https://howdy.ai/botkit/)
* [Slack Real Time Messaging API (RTM)](https://api.slack.com/rtm)
