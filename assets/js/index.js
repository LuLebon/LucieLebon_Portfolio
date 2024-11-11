let sideBar = document.getElementById("sidebar");
let introBg = document.getElementById("intro");
let pagesPanel = document.getElementById("Manual");

function setSideBar(pages)
{
	let thisPage = window.location.pathname.split('/');
	thisPage = thisPage[thisPage.length -1] //get the last element	console.log();

	let pagesList = document.getElementsByClassName("inner")[0];
	if(!pagesList) return;
	while (pagesList != null && pagesList.firstElementChild)
	{
		// console.log("remove a child from the section");
		pagesList.removeChild(pagesList.lastElementChild);  //Remove last is quicker than removing first
	}
	let navBalise = document.createElement('nav');
	let listContainer = document.createElement('ul');
	navBalise.appendChild(listContainer);
	pagesList.appendChild(navBalise);

	//Si on a plus d'une page => besoin de mettre l'accueil
	if(Object.keys(pages).length > 0)
	{
		let landPage = document.createElement('li');
		listContainer.appendChild(landPage);
		let link = document.createElement('a');
		link.innerHTML = "Accueil";
		landPage.appendChild(link);
		link.href = "index.html";
		if(link.href.endsWith(thisPage))
		{
			link.className = "scrolly active";
		}
	}

	for (index in pages)
	{
		//Add page to sidebar only if there is a link
		if (pages[index].Page)
		{
			let newTool = document.createElement('li');
			listContainer.appendChild(newTool);
			let link = document.createElement('a');
			link.innerHTML = pages[index].Name;
			newTool.appendChild(link);
			link.href = pages[index].Page;

			if (pages[index].Page.endsWith(thisPage))  // case './' is included
			{
				link.className = "scrolly active";
			}
		}
	}
}


//
function setIndexPage(pages, indexPage)
{
	if (indexPage.Visual && indexPage.Visual.length >  4)
	{
		let today = new Date();
		console.log("[index] change visual : " + indexPage.Visual + "for month : " + today.getMonth());

		if (today.getMonth() == 0 || today.getMonth() == 11)  //January->0, December->11
		{
			introBg.style.backgroundImage = "url(" + indexPage.WinterVisual + ")";
		}
		else
		{
			introBg.style.backgroundImage = "url(" + indexPage.Visual + ")";
		}
	}
	let thisPage = window.location.pathname.split('/');
	thisPage = thisPage[thisPage.length -1] //get the last element	console.log();
	let innerPanel = pagesPanel.getElementsByClassName("inner")[0];
	let cardsChest = document.createElement('div');
	cardsChest.className = "cards-drawer";
	innerPanel.appendChild(cardsChest);
	for(index in pages)
	{
		let cardDatas = pages[index];
		let cardItem = createCard(cardDatas.Initials, cardDatas.Name, cardDatas.Short, cardDatas.Page);
		cardsChest.appendChild(cardItem);
	}
}

function createCard(icon, name, text, link)
{
		let card = document.createElement('div');
		card.className = "tool-card";
		let innerCard = card;

		if(link)
		{
			let linkArea = document.createElement('a');
			linkArea.href = link;
			card.appendChild(linkArea);
			innerCard = linkArea;
		}

		let bookmark = document.createElement('div');
		bookmark.className = "text-icon";
		let bookmarkText  = document.createElement('h1');
		bookmarkText.textContent = icon;
		bookmark.appendChild(bookmarkText);
		innerCard.appendChild(bookmark);

		let header = document.createElement('h3');
		header.textContent = name;
		innerCard.appendChild(header);

		let description = document.createElement('p');
		description.textContent = text;
		innerCard.appendChild(description);

		return card;
}