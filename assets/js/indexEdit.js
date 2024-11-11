let sideBar = document.getElementById("sidebar");
let introBg = document.getElementById("intro");
let pagesPanel = document.getElementById("Manual");

let pendingPagesListToDownload = {};

function setSideBar(pages)
{
	let thisPage = window.location.pathname.split('/');
	thisPage = thisPage[thisPage.length -1] //get the last element

	let pagesList = document.getElementsByClassName("inner")[0];
	if(!pagesList) return;

	while (pagesList != null && pagesList.firstElementChild)
	{
		// console.log("remove a child from the section");
		pagesList.removeChild(pagesList.lastElementChild);  //Remove last is quicker than removing first
	}

	let navElement = document.createElement('nav');
	let listContainer = document.createElement('ul');
	navElement.appendChild(listContainer);
	pagesList.appendChild(navElement);

	//Si on a plus d'une page => besoin de mettre l'accueil
	if(Object.keys(pages).length > 0)
	{
		let landPage = document.createElement('li');
		listContainer.appendChild(landPage);
		let link = document.createElement('a');
		link.innerHTML = "Accueil";
		landPage.appendChild(link);
		link.href = "index.html"
		if(link.href.endsWith(thisPage))
		{
			link.className += " scrolly active";
		}
	}

	for (index in pages)
	{
		//Add page to sidebar only if there is a link
		if (pages[index].Page)
		{
			createNavItem(listContainer, pages[index].Name, pages[index].Page, thisPage, pages[index]);
		}
	}
	
	//#region Edit - Add new page 
	let addPageContainer = document.createElement('form');
	$(addPageContainer).attr({'onsubmit':"return false;"});
	
	//Edit - Add a text field to add new page
	let pageNameTextField = document.createElement('input');
	pageNameTextField.type = 'text';
	pageNameTextField.maxLength = 20;
	pageNameTextField.className = 'add-page-field';

	addPageContainer.appendChild(pageNameTextField);
	
	//Edit - Add a button to add a new page
	addPageContainer.className = "add-page-button-container row";
	navElement.appendChild(addPageContainer);
	
	let addPageButtonContainer = document.createElement('div');
	addPageButtonContainer.className = 'col-12 edit-add-page-container';
	addPageContainer.appendChild(addPageButtonContainer);
	let addPageButton = document.createElement('button');
	addPageButton.className = "add-button";
	addPageButton.type = 'submit';
	addPageButton.addEventListener('click', createPage.bind(event, pageNameTextField), false);

	let addPageButtonImg = document.createElement('img');
	addPageButtonImg.className = "add-button-img";
	addPageButtonImg.src = "../images/icons/add.png";
	
	addPageButtonContainer.appendChild(addPageButton);
	
	addPageButton.appendChild(addPageButtonImg);

	//Edit - Add button to download new page list

	let downloadNewPageButtonContainer = document.createElement('div');
	downloadNewPageButtonContainer.className = 'col-12';
	addPageContainer.appendChild(downloadNewPageButtonContainer);
	
	let downloadNewPageListButton = document.createElement('button');
	downloadNewPageListButton.textContent = 'Confirm';
	downloadNewPageButtonContainer.appendChild(downloadNewPageListButton);

	downloadNewPageListButton.addEventListener('click', downloadNewPageList.bind(event), false);
	
	//#endregion
}

function createNavItem(container, name, pageLink, thisPage, pagesPageDatas)
{
	let newTool = document.createElement('li');
	newTool.className = 'row page-item-container';
	container.appendChild(newTool);
	let link = document.createElement('a');
	link.className = 'col-6';
	link.innerHTML = name;
	newTool.appendChild(link);
	link.href = pageLink;
	
	//EDIT - Create input textfield to edit page name
	let textInputEditPageName = document.createElement('input');
	textInputEditPageName.type = 'text';
	textInputEditPageName.className = 'edit-pagename-field';
	textInputEditPageName.value = name,
	$(textInputEditPageName).hide();
	
	newTool.appendChild(textInputEditPageName);

	if (pageLink.endsWith(thisPage))  // case './' is included
	{
		link.className += " scrolly active";
	}
	pendingPagesListToDownload[pagesPageDatas.Name] = pagesPageDatas;
	
	//#region Reorder buttons
	let reorderButtonsContainer = document.createElement('div');
	reorderButtonsContainer.className = 'col-2 edit-page-reorder-container';
	let goesUpButton = document.createElement('button');
	let goesUpButtonImg = document.createElement('img');
	goesUpButton.appendChild(goesUpButtonImg);
	goesUpButtonImg.src = '../images/icons/up-arrow.png';
	goesUpButton.className = 'edit-reorder-up';
	
	let goesDownButton = document.createElement('button');
	let goesDownButtonImg = document.createElement('img');
	goesDownButtonImg.src = '../images/icons/down-arrow.png';
	goesDownButton.className = 'edit-reorder-down';
	goesDownButton.appendChild(goesDownButtonImg);

	reorderButtonsContainer.appendChild(goesUpButton);
	reorderButtonsContainer.appendChild(goesDownButton);
	
	$(reorderButtonsContainer).insertBefore(link);

	goesDownButton.addEventListener('click', swapPagePositionHandler.bind(event, false, newTool), false);
	goesUpButton.addEventListener('click', swapPagePositionHandler.bind(event, true, newTool), false);
	//#endregion
	//#region EDIT - Add edit/Remove Buttons

	let editButtonsContainer = document.createElement('div');
	editButtonsContainer.className = 'col-4 page-edit-buttons-container';

	let editButtonsContainerRow = document.createElement('div');;
	editButtonsContainerRow.className = 'row';
	editButtonsContainer.appendChild(editButtonsContainerRow);

	let removePageButton = document.createElement('button');
	removePageButton.className = 'col-6 remove-page';

	editButtonsContainerRow.appendChild(removePageButton);
	let removePageImg = document.createElement('img');
	removePageImg.src = "../images/icons/remove.png";
	removePageButton.appendChild(removePageImg);
	
	let editPageButton = document.createElement('button');
	editPageButton.className = 'col-6 edit-page';
	editButtonsContainerRow.appendChild(editPageButton);
	
	let editPageImg = document.createElement('img');
	editPageButton.appendChild(editPageImg);
	editPageImg.src = "../images/icons/edit.png";

	newTool.appendChild(editButtonsContainer);
	
	//Events
	removePageButton.addEventListener('click', removePage.bind(event, newTool), false);
	editPageButton.addEventListener('click', renamePage.bind(event, newTool), false);

	//#endregion
}

let swapPagePositionHandler = function(isGoingUp, item, event)
{
	if(isGoingUp & $(item).prev().hasClass('page-item-container'))
	{
		$(item).insertBefore($(item).prev());
	}
	else if(!isGoingUp && $(item).next()[0])
	{
		$(item).insertAfter($(item).next()[0]);
	}
}

let downloadNewPageList = function(event)
{
	console.log("DOWNLOAD")
	//Loop over page in interface
	$('nav ul').children().each(
		function(i)
		{
			let urlSplitted = $($(this)[0]).find('a')[0].href.split('.');
			let pageNameSplitted = urlSplitted[urlSplitted.length - 2].split('/');
			let pageName = pageNameSplitted[pageNameSplitted.length - 1];
		}
	);
	//Read PageListEdit.js and update previousData by comparing with existingPagesNames
	readTextFile('../PagesContent/PagesList.js',
		function(pagesListText)
		{	
			let previousData = getFileContentOnly(pagesListText);
			let previousJSONData = JSON.parse(previousData);
			let newPagesJsonData = {};

			//Loop over pages element
			$('.page-item-container').each(function(key, element)
			{
				let pageName = $(element).find('a')[0].textContent;
				newPagesJsonData[pageName] = pendingPagesListToDownload[pageName];
			});

			let dataStr = JSON.stringify(newPagesJsonData, null, 3);
			saveContentEventHandler('PagesList', '.js', pagesListText.replace(previousData, dataStr));
			// //#region If a page isn't in the old version of PageList, create new HTML & JS related from template
			// let needToDownloadPage = true;
			
			let oldPagesArrayNames = [];
			for(let i in previousJSONData)
			{
				oldPagesArrayNames.push(i);
			}
			
			let pendingPagesArrayNames = [];

			for(let i in pendingPagesListToDownload)
			{
				pendingPagesArrayNames.push(i);
			}
			let pagesToDownload = pendingPagesArrayNames.filter(x => !oldPagesArrayNames.includes(x));
			console.log(pagesToDownload)
			for(index in pagesToDownload)
			{
 				//Read from template
				readTextFile('../Template.html', 
					function(templateHTMLText)
					{
						let newPageText = templateHTMLText.replaceAll('PagesContent/Template', 'PagesContent/' + pagesToDownload[index]);
						saveContentEventHandler(pagesToDownload[index], '.html', newPageText, event);
					}
				);
				//Create HTML EDIT File from template
				readTextFile('Template.html', 
					function(templateHTMLText)
					{
						let newPageText = templateHTMLText.replaceAll('../PagesContent/Template', '../PagesContent/' + pagesToDownload[index]);
						saveContentEventHandler(pagesToDownload[index] + '-editToRemove', '.html', newPageText, event);
					}
				);
				//Create JS File from template
				readTextFile('../PagesContent/Template.js',
					function(templateJSText)
					{
						saveContentEventHandler(pagesToDownload[index], '.js', templateJSText, event);
					}
				)	
			}
			//#endregion
		}
	);
}

let removePage = function(pageElementItem, event)
{
	$(pageElementItem).remove();
}

let renamePage = function(element, event)
{
	//Toggle display of nav element
	$($(element).find('a')).toggle();

	//If hidden, display input to rename
	$($(element).find('input')[0]).toggle();

	let imagePathToShow = $($(element).find('input')[0]).is(':hidden') ? '../../images/icons/edit.png' : '../../images/icons/confirm.png';

	$(event.currentTarget).find('img')[0].src = imagePathToShow;

	//Confirm rename
	if($($(element).find('input')[0]).is(':hidden') && $(element).find('a').text() != $(element).find('input').val())
	{
		let oldName = $(element).find('a').text();
		let newName = $(element).find('input').val();
		$(element).find('a').text(newName);
		for(index in pendingPagesListToDownload)
		{
			if(index == oldName)
			{
				//#region Set pending pages values
				//Set new name of pending pages
				pendingPagesListToDownload[newName] = pendingPagesListToDownload[index];
				delete pendingPagesListToDownload[index];
				
				// //Set new intiials
				// let initials = newName.replace(/[^A-Z]/g, '');
				// initials = initials.length > 0 ? initials.substring(0, Math.min(3, initials.length)) : newName.replace(' ', '')[0].toUpperCase();
				// pendingPagesListToDownload[newName].Initials = initials;
				//#endregion
				break;
			}
		}
		console.log(pendingPagesListToDownload)
	}
}

function checkCanCreatePage(pageName)
{
	if(pageName.length == 0)
	{
		return false;
	}
	
	let canCreatePage = true;

	$('nav ul').children('li').each(function()
	{
		let existingPageLink = $(this).find('a')[0].href;
		let existingPageNameSplited = existingPageLink.split('/');
		let existingPageName = existingPageNameSplited[existingPageNameSplited.length - 1].split('.')[0];

		// console.log( pageName.toLowerCase() + ' - ' + existingPageName.toLowerCase() + ' - ' + (pageName.toLowerCase() == existingPageName.toLowerCase()));
		if(pageName.toLowerCase() == existingPageName.toLowerCase()){
			//Forced to return a variable because we're not exatcly in a classical loop
			canCreatePage =  false;
			return canCreatePage;
		}
	});
	return canCreatePage;
}

let createPage = function(pageNameField, event)
{
	let canCreatePage = checkCanCreatePage(pageNameField.value);
	
	if(!canCreatePage)
		alert('Pour créer une nouvelle page, donnez-lui un nom non existant dans le champ juste au dessus du bouton');
	else
	{

		let thisPage = window.location.pathname.split('/');
		thisPage = thisPage[thisPage.length -1] //get the last element

		// //#region Create page
		let pageData =
			{
				Name:pageNameField.value,
				Initials:'TEMP',//TODO Change to adapt name
				DatasFile:'../PagesContent/' + pageNameField.value + '.js',
				Page:pageNameField.value + '.html', Short: 'Short descriptif',
				InNavbar : true
			}

		//UI
		let newPageElement = $('nav ul li:last-child').clone(true);

		createNavItem(document.querySelector(('nav ul')), pageNameField.value, pageNameField.value + '.html', thisPage, pageData);
	
		//#region Update PageListEdit

		readTextFile('../PagesContent/PagesList.js', 
			function(pagesListText)
			{
				let data = getFileContentOnly(pagesListText);
				//Easier to manipulate
				let jsonData = JSON.parse(data);

				for(let index in jsonData['Pages'])
				{
					let pageData = jsonData['Pages'][index];
					if(pageData.Name == pageNameField.value){
						alert('A page with same name already exists in list ???');
						return;
					}
				}

				pendingPagesListToDownload[pageData.Name] = pageData;
			});

		//#endregion
	}
}

function setIndexPage(pages, indexPage)
{
	if (indexPage.Visual && indexPage.Visual.length >  4)
	{
		let today = new Date();
		// console.log("[index] change visual : " + indexPage.Visual + "for month : " + today.getMonth());

		if (today.getMonth() == 0 || today.getMonth() == 11)  //January->0, December->11
		{
			introBg.style.backgroundImage = "url(../" + indexPage.WinterVisual + ")";
		}
		else
		{
			introBg.style.backgroundImage = "url(../" + indexPage.Visual + ")";
		}
	}
	let thisPage = window.location.pathname.split('/');
	thisPage = thisPage[thisPage.length -1] //get the last element

	let innerPanel = pagesPanel.getElementsByClassName("inner")[0];
	let cardsChest = document.createElement('div');
	cardsChest.className = "cards-drawer";
	innerPanel.appendChild(cardsChest);
	for(pageID in pages)
	{
		let cardDatas = pages[pageID];
		let cardItem = createCard(pageID, cardDatas.Initials, cardDatas.Name, cardDatas.Short, cardDatas.Page);
		cardsChest.appendChild(cardItem);
	}

	let cardsEdit = createCardsEditElement(cardsChest);

	$(cardsEdit).insertAfter(cardsChest);

	let editPagesCardContainer = document.createElement('div');
	let editPagesCardButton = document.createElement('button');
	let editPagesCardImg = document.createElement('img');
	editPagesCardImg.src = "../images/icons/edit.png";
	
	editPagesCardContainer.className = "edit-pagecards-container";
	editPagesCardButton.className = "edit-pagecards-button";

	editPagesCardContainer.appendChild(editPagesCardButton);
	editPagesCardButton.appendChild(editPagesCardImg);

	innerPanel.appendChild(editPagesCardContainer);

	editPagesCardButton.addEventListener('click', editContentEventHandler.bind(event, null, 'Cards', $(cardsChest), $(cardsEdit)), false)
	
}

function createCardsEditElement(elementBase)
{
	let cardsCopy = $(elementBase).clone();
	cardsCopy.insertAfter(elementBase);
	cardsCopy.hide();
	//Create edit content for
	//Each initials
	cardsCopy.find('.card-initials').each(function(key, initialsElement)
	{
		let initialInput = document.createElement('input');
		initialInput.type = 'text';
		initialInput.className = 'edit-card-initials';
		initialInput.value = initialsElement.textContent;
		$(initialInput).insertAfter(initialsElement);
		$(initialsElement).remove();
	});

	//Each card name
	cardsCopy.find('.card-name').each(function(key, nameElement)
	{
		let nameInput = document.createElement('input');
		nameInput.type = 'text';
		nameInput.className = 'edit-card-name';
		nameInput.value = nameElement.textContent;
		$(nameInput).insertAfter(nameElement);
		$(nameElement).remove();
	});

	//Each short
	cardsCopy.find('.card-short').each(function(key, shortElement)
	{
		let shortInput = document.createElement('input');
		shortInput.type = 'text';
		shortInput.value = shortElement.textContent;
		shortInput.className = 'edit-card-short';
		$(shortInput).insertAfter(shortElement);
		$(shortElement).remove();
	});
	//Desactivate page link
	cardsCopy.find('a').each(function(key, pageLink){
		pageLink.className += ' disabled-link';
		pageLink.href = 'javascript:void(0)';
	});

	return cardsCopy;
}

function createCard(pageID, icon, name, text, link)
{
		let card = document.createElement('div');
		card.className = "tool-card";
		card.id = pageID;
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
		bookmarkText.className = 'card-initials';
		bookmark.appendChild(bookmarkText);
		innerCard.appendChild(bookmark);

		let header = document.createElement('h3');
		header.textContent = name;
		header.className = 'card-name';
		innerCard.appendChild(header);

		let description = document.createElement('p');
		description.textContent = text;
		description.className = 'card-short';
		innerCard.appendChild(description);

		return card;
}

function downloadEditNewPageList(pagesListContent)
{
	readTextFile('../PagesContent/PagesList.js',
	function(pagesListText)
	{
		let previousData = getFileContentOnly(pagesListText);
		let jsonData = JSON.parse(previousData);
		let oldJsonData = JSON.parse(previousData);;
		$(pagesListContent).find('.tool-card').each(function(key, element)
		{
			jsonData[element.id].Name = $(element).find('.card-name')[0].textContent;
			jsonData[element.id].Initials = $(element).find('.card-initials')[0].textContent;
			jsonData[element.id].Short = $(element).find('.card-short')[0].textContent;
		});

		//Download new pages list if it's different of the current one
		if(JSON.stringify(jsonData) != JSON.stringify(oldJsonData))
		{
			jsonData = JSON.stringify(jsonData, null, 4);
			let newPagesListData = pagesListText.replace(previousData, jsonData);
			saveContentEventHandler('PagesList', '.js', newPagesListData);

		}
	});
}

$(document).ready(function()
{
	//Create Content board
	function createEditContentBoard(availableContentTypes)
	{
		let container = document.createElement('div')
		container.className = 'content-toolbox-container row';

		console.log($("#sidebar .inner"));
		$("#sidebar .inner").append(container);

		let toolboxTitleContainer = document.createElement('div');
		toolboxTitleContainer.className = 'col-12 toolbox-title-container';
		container.appendChild(toolboxTitleContainer);

		let toolboxTitle = document.createElement('h3');
		toolboxTitle.className = 'toolbox-main-title';
		toolboxTitleContainer.appendChild(toolboxTitle);
		toolboxTitle.textContent = "Toolbox"

		availableContentTypes.forEach(element => {
			let typeButtonContainer = document.createElement('div');
			let typeButton = document.createElement('button');
			let typeText = document.createElement('p');

			typeButtonContainer.className = 'col-4 button-toolbox-container';
			container.appendChild(typeButtonContainer);

			typeButtonContainer.appendChild(typeButton);
			
			typeButton.appendChild(typeText);
			typeButton.id = element + '-dragable-item'
			typeText.textContent = element;

			$(typeButton).on('mousedown', startDragToolboxItem);

		});
	}

	createEditContentBoard(['Text', 'Header','List', 'Table', 'Image', 'Video']);

	function startDragToolboxItem(event)
	{
		isDragingContent = true;
		//Create a copy of this item button and parent it to body
		let copy = $(event.currentTarget).clone(false);

		$('body').append(copy);

		$(copy).css({'position': 'absolute', 'top': event.clientY, 'left': event.clientX, 'zIndex':10000});
		$(copy).attr({'class': 'dragged-toolbox-item'});
		
		//Bind event to follow mouse & scroll position
		let dragToolButtonEvent = dragToolBoxItemEventHandler.bind(event, copy);
		window.addEventListener('mousemove', dragToolButtonEvent, false);
		window.addEventListener('mousedown', dragToolButtonEvent, false);
		window.addEventListener('scroll', dragToolButtonEvent, true);
		
		window.addEventListener('mouseup', stopDragToolboxItemEventHandler.bind(event, copy, dragToolButtonEvent), {once: true});
	}

	let stopDragToolboxItemEventHandler = function(element, dragToolButtonEvent, event)
	{
		isDragingContent = false;
		//Remove UI element being drag
		element.remove();
		$('body').removeAttr('style');
		window.removeEventListener('mousemove', dragToolButtonEvent);

		//Check if we are on a drag content box

		document.querySelectorAll( ":hover" ).forEach(function (hoverElement)
		{
			if($(hoverElement).hasClass('receive-drop'))
			{
				$(hoverElement).css({cursor : 'initial '});

				//Add new content

				let typeFromID = $(element).attr('id').replace('-dragable-item',''); 
				let contentData = initializeItemContent(typeFromID);
				
				let indexToInsert = $(hoverElement.parentNode.parentNode.getElementsByClassName('receive-drop-container')).index(hoverElement.parentNode);

				let currentContentMainContainer = addContent(
					contentData.Value,																//Content map data of this item
					typeFromID,																		//Type {Table, Text, Header, Image ...}
					hoverElement.closest('.inner'),													//Section parent
					hoverElement.closest('.inner').parentNode,
					getKeyByValue(sectionNameRelation, hoverElement.closest('.inner').parentNode),	//Section name
					indexToInsert																	//Index to insert contents in
				);

				$(currentContentMainContainer['Content']).insertAfter(hoverElement.parentNode);
				$(currentContentMainContainer['EditBox']).insertAfter(currentContentMainContainer['Content']);

			}
		});
	}
});
