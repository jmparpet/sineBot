/*!
 * Bot.js : A Twitter bot that can retweet in response to the tweets matching particluar keyword
 * Version 1.0.0
 * Created by Debashis Barman (http://www.debashisbarman.in)
 * License : http://creativecommons.org/licenses/by-sa/3.0
 */

/* Configure the Twitter API */
var config = require('./config')

/* Get the util intro-inspect capability */
const util = require('util')

var Twit = require('twit')

var Bot = new Twit(config)

// Define user to follow

var user = { name: 'sine_injuria' }

console.log('Bot running for user ' + user.name)

/* BotInit() : To initiate the bot */
function BotInit (user) {
  Bot.get('users/show', { screen_name: user.name }, function (err, reply) {
    if (err) { console.log('Error :' + err); return }
    user.id = reply.id_str
    console.log('User ID for ' + user.name + ': ' + user.id)
    BotInitiated()
  })

  function BotInitiated () {
    var stream = Bot.stream('statuses/filter', { follow: user.id })

    stream.on('tweet', tweetReceived)
  }
}

function tweetReceived (msg) {
  console.log('Received message:\n' + util.inspect(msg, false, null))

  // Get the tweet ID (if it is a tweet)

  var tweetId = msg.id_str

  // Retweet

  if (tweetId != null) {
    Bot.post('statuses/retweet/:id', { id: tweetId },
      function (err, data, response) {
        if (err) {
          console.log('Bot could not retweet, : ' + err)
        } else {
          console.log('Bot retweeted : ' + tweetId)
        }
      }
    )
  }
}

/* Initiate the Bot */
BotInit(user)
