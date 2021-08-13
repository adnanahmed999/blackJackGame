
//varaibles will be explained as they come across
var addedValue
var booleanBust = false
var winCounter = 0
var loseCounter = 0
var drawCounter = 0
var hit_counter = 0
var stand_counter = 0
var permission_to_hit = true
var permission_to_deal = true

let blackjackGame = 
	{
		"you" : 
			{
				"scorespan" : "#your-blackjack-result",
				"div" : "#your-box",
				"score" : 0,
				"realValue" : 0
			},

		"dealer" :
			{
				"scorespan"	: "#dealer-blackjack-result",
				"div" : "#dealer-box",
				"score" : 0,
				"realValue" : 0
			},

		"cards" :
			[
				"2", "3", "4", "5", "6", "7", "8", "9", "10", "K", "J", "Q", "A" 
			],

		"cardsMap" :
			{
			
				"2":2, "3":3, "4":4, "5":5, "6":6 ,"7":7, "8":8, "9":9, "10":10, "K":10, "Q":10, "J":10, "A":[1,11]
			}

	}

const YOU = blackjackGame["you"]
const DEALER = blackjackGame["dealer"]

document.querySelector("#blackjack-hit-button").addEventListener("click",blackjackhit)

document.querySelector("#blackjack-deal-button").addEventListener("click",blackjackdeal)

document.querySelector("#blackjack-stand-button").addEventListener("click",blackjackstand)

// if someone "clicks" on element of id "black-hit-button" then allow function blackjackhit(), here it was id so #, for class arguments begin with .

const hitSound = new Audio("./sounds/swish.m4a")

function randomCard()
	{
		let randomIndex = Math.floor((Math.random())*13)
		return blackjackGame["cards"][randomIndex]
	}

function updateScore(activePlayer, card)
	{	
		
		// A can have t
		if 	(card === "A")
			{
				if ( (activePlayer["score"]+11)>21 )
					{
						activePlayer["score"] += blackjackGame["cardsMap"][card][0]
						addedValue = 1
					}

					else if ( (activePlayer["score"]+11)<=21 )
					{
						activePlayer["score"] += blackjackGame["cardsMap"][card][1]
						addedValue = 11
					}

			}

		else 
			{
				activePlayer["score"] += blackjackGame["cardsMap"][card]
				addedValue = blackjackGame["cardsMap"][card]
			}
	}


function showcard(activePlayer,card)
	{	
		if (activePlayer["score"]<=21)
			{
				let cardImage = document.createElement("img")
				cardImage.src = `./images/${card}.png`
				//the only difference in location of images is where ${} is kept in source string
				// here we used dollar sign and with dollar sign backticks are used, basically we are adding something as string
				cardImage.className ="resizer"
				document.querySelector(activePlayer["div"]).appendChild(cardImage)
				hitSound.play()
			}

	}


function showScore(activePlayer)
	{
		if (activePlayer["score"]<=21)
			{
				document.querySelector(activePlayer["scorespan"]).textContent = activePlayer["score"];
				activePlayer["realValue"] = activePlayer["score"]
				booleanBust = false
			}

		else if (YOU["score"]>21)
			//cuz ewe are busting only YOU and not dealer
			{
				document.querySelector(YOU["scorespan"]).textContent = "BUST"
				document.querySelector(YOU["scorespan"]).style.color = "red"
				YOU["realValue"] = YOU["score"]-addedValue
				//because at last an extra value is added in score and its card is not added and it causes problem while comparing for winner
				booleanBust = true
				//then boolean will get true if YOU is busted so we can check later in computewinner
			}

	}


function computeWinner()
	
	{	
		if (Boolean(booleanBust) == true)
			{
				document.querySelector("#blackjack-result").textContent = "You lost :( "
				document.querySelector("#blackjack-result").style.color = "red"
				loseCounter++
			}


		else if (YOU["realValue"] > DEALER["realValue"])
			{
				document.querySelector("#blackjack-result").textContent = "You Won :) "
				document.querySelector("#blackjack-result").style.color = "pink"
				winCounter++
			}

		else if (YOU["realValue"] < DEALER["realValue"])
			{
				document.querySelector("#blackjack-result").textContent = "You lost :( "
				document.querySelector("#blackjack-result").style.color = "red"
				loseCounter++
			}

		else if (YOU["realValue"] == DEALER["realValue"])
			{
				document.querySelector("#blackjack-result").textContent = "Match Draw :\\ "
				document.querySelector("#blackjack-result").style.color = "yellow"
				drawCounter++
			}
	}


function tableEditor()
	{
		document.querySelector("#wins").textContent = `${winCounter}`
		document.querySelector("#loses").textContent = `${loseCounter}`
		document.querySelector("#draws").textContent = `${drawCounter}`
	}


function sleep(ms)
	{
		return new Promise(resolve => setTimeout(resolve,ms))
	}


function blackjackhit()
	{	
		hit_counter++

		if ( Boolean(permission_to_hit) == true )
			{
				var card = randomCard();
				showcard(YOU,card)
				updateScore(YOU, card)
				// keeping showcard first to show the exceeded card too
				showScore(YOU)
			}
	}


async function blackjackstand()
	{	
		stand_counter++
		permission_to_hit = false
		permission_to_deal = false
		//becaues of this , user cant hit hit or deal while the game is on

		if (stand_counter === 1)
			{
				while (DEALER["score"] < 14)
					{
						var card = randomCard();
						updateScore(DEALER, card)
						showcard(DEALER,card)
						showScore(DEALER)
						await sleep(1000)
					}

				computeWinner()
				tableEditor()

			}

		permission_to_deal = true
	}


function blackjackdeal()
	{

		if  ( Boolean(permission_to_deal) == true )
		{
			if (stand_counter == 0)
				{	
					if (hit_counter != 0)
						{
							loseCounter++
							document.querySelector("#loses").textContent = `${loseCounter}`
						}
				}

			hit_counter = 0
			stand_counter = 0
			permission_to_hit = true

			let yourimages = document.querySelector("#your-box").querySelectorAll("img")
			let dealerimages = document.querySelector("#dealer-box").querySelectorAll("img")
			
			for (i=0; i<yourimages.length;i++)
				{
					yourimages[i].remove()
				}
			
			for (i=0; i<dealerimages.length;i++)
				{
					dealerimages[i].remove()
				}

			YOU["score"] = 0
			DEALER["score"] = 0
			YOU["realValue"] = 0
			DEALER["realValue"] = 0
			
			document.querySelector(YOU["scorespan"]).textContent = YOU["score"];
			document.querySelector(YOU["scorespan"]).style.color = "white";

			document.querySelector(DEALER["scorespan"]).textContent = DEALER["score"];
			document.querySelector(DEALER["scorespan"]).style.color = "white";

			document.querySelector("#blackjack-result").textContent = "Let's Play"
			document.querySelector("#blackjack-result").style.color = "white"
		}
	
	}

