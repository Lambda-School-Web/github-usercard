/* Step 1: using axios, send a GET request to the following URL 
           (replacing the palceholder with your Github name):
           https://api.github.com/users/<your name>
*/
//const data = axios.get("https://api.github.com/users/jambis");
/* Step 2: Inspect and study the data coming back, this is YOUR 
   github info! You will need to understand the structure of this 
   data in order to use it to build your component function 

   Skip to Step 3.
*/
//console.log(data);

/* Step 4: Pass the data received from Github into your function, 
           create a new component and add it to the DOM as a child of .cards
*/
const cardsDiv = document.querySelector(".cards");
const baseURL = "https://api.github.com/users/tetondan";

axios
  .get(baseURL)
  .then(res => {
    const newCard = createCard(res.data);
    cardsDiv.appendChild(newCard);
  })
  .catch(err => {
    console.log("The data was not returned", err);
  });

/* Step 5: Now that you have your own card getting added to the DOM, either 
          follow this link in your browser https://api.github.com/users/<Your github name>/followers 
          , manually find some other users' github handles, or use the list found 
          at the bottom of the page. Get at least 5 different Github usernames and add them as
          Individual strings to the friendsArray below.
          
          Using that array, iterate over it, requesting data for each user, creating a new card for each
          user, and adding that card to the DOM.
*/

axios
  .get(`${baseURL}/followers`)
  .then(res => {
    const followersArray = [...res.data];
    followersArray.forEach(follower => {
      axios
        .get(follower.url)
        .then(res => {
          const newFollower = createCard(res.data);
          cardsDiv.appendChild(newFollower);
        })
        .catch(err => {
          console.log("The follower data was not returned", err);
        });
    });
    // const newCard = createCard(res.data);
    // cardsDiv.appendChild(newCard);
  })
  .catch(err => {
    console.log("The data was not returned", err);
  });
/* Step 3: Create a function that accepts a single object as its only argument,
          Using DOM methods and properties, create a component that will return the following DOM element:

<div class="card">
  <img src={image url of user} />
  <div class="card-info">
    <h3 class="name">{users name}</h3>
    <p class="username">{users user name}</p>
    <p>Location: {users location}</p>
    <p>Profile:  
      <a href={address to users github page}>{address to users github page}</a>
    </p>
    <p>Followers: {users followers count}</p>
    <p>Following: {users following count}</p>
    <p>Bio: {users bio}</p>
  </div>
</div>

*/

function createCard(data) {
  const cardDiv = document.createElement("div");
  const cardImg = document.createElement("img");
  const cardInfoDiv = document.createElement("div");
  const nameH3 = document.createElement("h3");
  const userNameP = document.createElement("p");
  const locationP = document.createElement("p");
  const profileP = document.createElement("p");
  const profileA = document.createElement("a");
  const followersP = document.createElement("p");
  const followingP = document.createElement("p");
  const bioP = document.createElement("p");

  cardDiv.classList.add("card");
  cardInfoDiv.classList.add("card-info");
  nameH3.classList.add("name");
  userNameP.classList.add("username");

  cardImg.src = data.avatar_url;
  nameH3.textContent = data.name;
  userNameP.textContent = data.login;
  locationP.textContent = `Location: ${data.location}`;
  profileP.textContent = "Profile: ";
  profileA.textContent = data.html_url;
  profileA.href = data.html_url;
  followersP.textContent = `Followers: ${data.followers}`;
  followingP.textContent = `Following: ${data.following}`;
  bioP.textContent = data.bio;

  cardDiv.append(cardImg, cardInfoDiv);
  profileP.appendChild(profileA);
  cardInfoDiv.append(
    nameH3,
    userNameP,
    locationP,
    profileP,

    followersP,
    followingP,
    bioP
  );

  axios
    .get(`https://api.github.com/users/${data.login}/repos`)
    .then(res => {
      let repoArray = [...res.data];
      let sortedRepoArray = repoArray.sort((a, b) => {
        return Date.parse(b.updated_at) - Date.parse(a.updated_at);
      });
      sortedRepoArray.slice(0, 5).forEach(repo => {
        const newRepo = createRepoCard(repo);
        cardDiv.appendChild(newRepo);
      });
    })
    .catch(err => console.log(err));

  return cardDiv;
}

/* List of LS Instructors Github username's: 
  tetondan
  dustinmyers
  justsml
  luishrd
  bigknell
*/

//Calendar stuff
const calendarDiv = document.createElement("div");
const containerDiv = document.querySelector(".container");

calendarDiv.classList.add("calendar");
containerDiv.insertBefore(calendarDiv, cardsDiv);

const calendar = new GitHubCalendar(".calendar", "tetondan", {
  responsive: true
});

//Expanding card stuff
function createRepoCard(data) {
  const repoDiv = document.createElement("div");
  const repoName = document.createElement("p");
  const repoLink = document.createElement("a");
  const repoUpdated = document.createElement("p");

  //cardDiv.classList.add("card");

  repoName.text = "Repository Name: ";
  repoLink.href = data.html_url;
  repoLink.textContent = data.name;
  repoUpdated.textContent = `Last Updated: ${data.updated_at}`;

  repoName.append(repoLink);
  repoDiv.append(repoName, repoUpdated);

  return repoDiv;
}
