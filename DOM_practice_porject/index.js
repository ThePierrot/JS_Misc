var currentUser;
var switchUserButton;
var followButton;
var userHeader;
var clearBotton;
var tweetBotton;
var logoutButton;

window.addEventListener("load", function(event) {
  // bottons
  switchUserButton = document.querySelector("button#switch-user-button");
  followButton = document.querySelector("button#follow-button");
  tweetBotton = document.querySelector("button#tweet-button");
  clearBotton = document.querySelector("button#clear-localdata-button")
  logoutButton = document.querySelector("button#logout-button")

  // EventListeners
  switchUserButton.addEventListener("click", function(event) {
    switchUser(document.querySelector("input[type=text]#switch-user-input").value);
  })

  followButton.addEventListener("click", function(event) {
    if (currentUser === undefined) {
      alert("Please Login");
      return;
    }
    var nameYouWantToFollow = document.querySelector("input[type=text]#follow-input").value;
    signup(nameYouWantToFollow);
    follow(currentUser.name, nameYouWantToFollow);
    reRender(currentUser);
  });

  tweetBotton.addEventListener("click", function(event) {
    if (currentUser === undefined) {
      alert("Please Login");
      return;
    }
    var content = document.querySelector("textarea#tweet-input").value;
    var flag = tweet(currentUser.name, content);
    if (!flag) {
      alert("Error! Illegal tweet, please enter again.");
      reRender(currentUser);
      return;
    }
    reRender(currentUser);
  });

  clearBotton.addEventListener("click", function(event) {
    localStorage.clear();
    users = [];
    location.reload();
  });

  logoutButton.addEventListener("click", function(event) {
    document.querySelector("#current-user-header").textContent = "";
    document.querySelector("textarea#tweet-input").value = "";
    document.querySelector("input[type=text]#follow-input").value = "";
    document.querySelector("input[type=text]#switch-user-input").value = "";
    var followerList = document.querySelector("#follower-list");
    while (followerList.hasChildNodes()) {
      followerList.removeChild(followerList.lastChild);
    }
    var followingList = document.querySelector("#following-list");
    while (followingList.hasChildNodes()) {
      followingList.removeChild(followingList.lastChild);
    }
    var timelineList = document.querySelector("#tweet-list");
    while (timelineList.hasChildNodes()) {
      timelineList.removeChild(timelineList.lastChild);
    }
  });
});

// store users in localStorage when exit
window.addEventListener("unload", function(event){
  parsed = JSON.stringify(users);
  localStorage.users = parsed;
});

function switchUser(user) {
  document.querySelector("#current-user-header").textContent = user;
  signup(user);
  currentUser = getUser(user);
  reRender(currentUser);
}

function followerElementCreator(name) {
  var eleFrame = document.createElement("li");
  var eleLink = document.createElement("a");
  eleLink.textContent = name;
  eleLink.herf = "#";
  eleFrame.appendChild(eleLink);
  eleFrame.addEventListener("click", function(event) {
    switchUser(eleLink.textContent);
  });
  return eleFrame;
}

function tweetElementCreator(tweet) {
  var eleFrame = document.createElement("li");
  eleFrame.className = "list-group-item tweet";
  var userName = document.createElement("p");
  userName.className = "tweet-username";
  userName.textContent = tweet.username;
  eleFrame.appendChild(userName);
  var content = document.createElement("p");
  content.className = "tweet-content";
  content.textContent = tweet.content;
  eleFrame.appendChild(content);
  return eleFrame;
}

// renders
function reRender(currentUser) {
  document.querySelector("textarea#tweet-input").value = "";
  document.querySelector("input[type=text]#follow-input").value = "";
  document.querySelector("input[type=text]#switch-user-input").value = "";
  renderFollower(currentUser);
  renderFollowing(currentUser);
  renderTimeline(currentUser);
}

function renderFollower(currentUser) {
  var list = document.querySelector("#follower-list");
  while (list.hasChildNodes()) {
    list.removeChild(list.lastChild);
  }
  for (i = 0; i < currentUser.followers.length; i++) {
    var child = followerElementCreator(currentUser.followers[i]);
    list.appendChild(child);
  }
}

function renderFollowing(currentUser) {
  var list = document.querySelector("#following-list");
  while (list.hasChildNodes()) {
    list.removeChild(list.lastChild);
  }
  for (i = 0; i < currentUser.following.length; i++) {
    var child = followerElementCreator(currentUser.following[i]);
    list.appendChild(child);
  }
}

function renderTimeline(currentUser) {
  var list = document.querySelector("#tweet-list");
  while (list.hasChildNodes()) {
    list.removeChild(list.lastChild);
  }
  for (i = 0; i < currentUser.timeline.length; i++) {
    var tweet = tweetElementCreator(currentUser.timeline[i]);
    list.appendChild(tweet);
  }
}
