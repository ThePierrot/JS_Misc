// "users" store the infomation of all users.
var users;

window.addEventListener("load", function(event) {
  if (localStorage.users === undefined) {
    localStorage.users = JSON.stringify([]);;
  }
  users = JSON.parse(localStorage.users);
})

// basic twitter user class
class twitterUser {
  constructor(name) {
    this.name = name;
    this.tweets = [];
    this.timeline = [];
    this.followers = [];
    this.following = [];
  }
}

function getUser(name) {
  for (i = 0; i < users.length; i ++) {
    if (users[i].name === name) {
      return users[i];
    }
  }
}

/*
* @function
* @name signup
* The signup function adds a new user to twitter. Users must be signed up
* before being used in any of the other functions.
*
* @param   {string} user   The user to signup.
*/
function signup(user) {
  if(typeof(user) === 'string' && user) {
    if (users.filter((x) => {return x.name == user}).length === 0) {
      users.push(new twitterUser(user));
      return true;
    }
    return false;
  }
  return false;
}

/*
 * @function
 * @name timeline
 * The timeline function will return an array of tweets representing the
 * timeline for a given user.
 *
 * @param   {string} user   The user whose timeline to return.
 * @returns {[]|false}     Array of tweet objects representing the timeline
 * of the user. Alternatively, false will be returned if the user is not a
 * valid string.
 */
function timeline(user) {
  if (typeof user !== 'string' || user.length === 0 || users.filter((x) => {return x.name == user}).length === 0){
    return false;
  }
  var buffer = users.filter((x) => {return x.name === user});
  return buffer[0].timeline;
}

/*
 * @function
 * @name follow
 * The follow function allows the follower to receive future tweets from the
 * user.
 *
 * @param   {string} follower The user requesting to follow the user.
 * @param   {string} user     The user being followed.
 * @returns {boolean}         Returns true if successfully followed and false
 * if not.
 */
function follow(follower, user) {
  if ((typeof follower) != 'string' || (typeof user) != 'string' || follower === user || !follower || !user || users.filter((x) => {return x.name == user}).length === 0 || users.filter((x) => {return x.name == follower}).length === 0) {
    return false;
  }
  var userObj = users.filter((x) => {return x.name === user})[0];
  var userIndex = users.indexOf(userObj);
  var followerObj = users.filter((x) => {return x.name === follower})[0];
  var followerIndex = users.indexOf(followerObj);
  if (userIndex !== -1) {
    if (users[userIndex].followers.indexOf(follower) === -1) {
      users[userIndex].followers.push(follower);
      users[followerIndex].following.push(user);
      return true;
    }
    return false;
  }
  return false;
}

/* @function
 * @name unfollow
 * The unfollow function is the inverse of {@link follow}. After unfollowing,
 * future tweets from user will not show up in follower's timeline.
 *
 * @param   {string} follower The user requesting to follow the user.
 * @param   {string} user     The user being followed.
 * @returns {boolean}         Returns true if successfully unfollowed and false
 * if not.
 */
function unfollow(follower, user) {
  if (typeof follower !== 'string' || typeof user !== 'string' || !follower || !user || users.filter((x) => {return x.name == user}).length === 0 || users.filter((x) => {return x.name == follower}).length === 0) {
    return false;
  }
  var userObj = users.filter((x) => {return x.name === user})[0];
  var userIndex = users.indexOf(userObj);
  var followerIndex = users[userIndex].followers.indexOf(follower);
  if (userIndex !== -1 && followerIndex !== -1) {
    if (users[userIndex].followers.indexOf(follower) !== -1) {
      users[userIndex].followers.splice(followerIndex, 1);
      return true;
    }
    return false;
  }
  return false;
}

/*
 * @function
 * @name tweet
 * This function will add a tweet for a given user. Tweeting will add a tweet
 * to each followers timeline, including the user doing the tweeting.
 *
 * @param   {string} user     The user tweeting.
 * @param   {string} content  The tweet content.
 * @returns {{}}|false}     Returns a tweet object or false in the case of a
 * failure.
 */
function tweet(user, content) {
  if ((typeof user) === 'string' && (typeof content) === 'string')
  {
    if (user && content && content.length <= 140)
    {
      var buffer = users.filter((x) => {return x.name === user});
      var userIndex = users.indexOf(buffer[0]);
      if (userIndex !== -1) {
        var date = new Date;
        var newTweet = {
          id:parseInt(Math.random()*100000) + 100000,
          content: content,
          username: user,
          date: date.toISOString(),
          retweet: false,
          favorites: 0,
        };
        users[userIndex].tweets.unshift(newTweet);
        users[userIndex].timeline.unshift(newTweet);
        for (var i = 0; i < users[userIndex].followers.length; i++) {
          var follower = users[userIndex].followers[i]
          var followerObj = users.filter((x) => {return x.name === follower});
          var followerIndex = users.indexOf(followerObj[0]);
          users[followerIndex].timeline.unshift(newTweet);
        }
        return newTweet;
      }
      return false;
    }
    return false;
  }
  return false;
}
