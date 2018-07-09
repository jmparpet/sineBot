/*!
 * Bot.js : A Twitter bot that can retweet in response to the tweets matching particluar keyword
 * Version 1.0.0
 * Created by Debashis Barman (http://www.debashisbarman.in)
 * License : http://creativecommons.org/licenses/by-sa/3.0
 */

/* Configure the Twitter API */
// var config = require('./config')

/* Get the util intro-inspect capability */
const util = require('util')

var Twit = require('twit')

/* Get the config name */
var argv = require('minimist')(process.argv.slice(2))
var cfgFile
if (argv._.length > 0) {
  cfgFile = argv._[0]
} else {
  cfgFile = 'config'
}

var config = require('./' + cfgFile)

// Define retweets bots
var botKey = []
var botKeys = config.twitter_keys
for (var i = 0; i < botKeys.length; i++) {
  botKey.push({
    bot: new Twit(botKeys[i].keys),
    name: botKeys[i].name
  })
}

// Define user to follow

var user = config.retweet[0]

/* BotInit() : To initiate the bot */
function BotInit (user) {
  botKey[0].bot.get('users/show', { screen_name: user.name }, function (err, reply) {
    if (err) { console.log('Error :' + err); return }
    user.id = reply.id_str
    var tweetNames = botKey[0].name
    for (var i = 1, len = botKey.length; i < len; i++) {
      tweetNames += '\n' + botKey[i].name
    }
    console.log('The following users will retweet tweets from ' + user.name + ':\n' +
      tweetNames)
    console.log('--------------------')
    BotInitiated()
  })

  function BotInitiated () {
    var stream = botKey[0].bot.stream('statuses/filter', { follow: user.id })

    stream.on('tweet', tweetReceived)
  }
}

function retweetMsg (bot, name, tweetId) {
  bot.post('statuses/retweet/:id', { id: tweetId },
    function (err, data, response) {
      if (!err) {
        console.log(new Date().toISOString() + ' | ' + name + ' retweeted tweet: ' + tweetId)
      }
    }
  )
}

function tweetReceived (msg) {
  // console.log('\nReceived message:\n' + util.inspect(msg, false, null))

  // Get the tweet ID (if it is a tweet)

  var tweetId = msg.id_str
  var tweetingUserId = msg.user.id_str

  // Retweet

  if (tweetId != null) {
    if (tweetingUserId === user.id) {
      for (var i = 0, len = botKey.length; i < len; i++) {
        retweetMsg(botKey[i].bot, botKey[i].name, tweetId)
      }
    }
  }
}

/* Initiate the Bot */
BotInit(user)
