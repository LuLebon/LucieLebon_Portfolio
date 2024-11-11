let title = document.getElementById("Title");
let sumary = document.getElementById("Sumary");
let headerBg = document.getElementById("intro");
let faq = document.getElementById("FAQ");
let manual = document.getElementById("Manual");
let dev = document.getElementById("Dev");
let other = document.getElementById("Other");
let lastType = null;  //Use this for type needing a parent div (list, fiche, table...)
let currentContentSubContainer = null;

let sectionNameRelation = {'Faq' : faq, 'Manual' : manual, 'Dev' :  dev, 'Other': other};
const SECTIONS_ORDER = ['Manual', 'Faq', 'Dev', 'Other'];

const AVAILABLE_HYPERLINK_EXTENSIONS = ['html', 'php'];

var contents = [];

var xMousePos = 0;
var yMousePos = 0;
var lastScrolledLeft = 0;
var lastScrolledTop = 0;

var isDragingContent = false;

function fillPage(contentDict)
{
	// ---- Intro ----
	title.textContent = contentDict.Title;
	if (contentDict.Visual && contentDict.Visual.length > 4)
	{
		headerBg.style.backgroundImage = "url(../" + contentDict.Visual + ")";
	}
	sumary.textContent = contentDict.Sumary;
	// ---- User Manual ----
	setSectionName(manual, "Utilisation");
	fillSection(contentDict.Manual, manual, 'Manual');
	
	// ---- FAQ ----
	setSectionName(faq, "F.A.Q");
	fillSection(contentDict.Faq, faq, 'Faq');
	
	// ---- Dev ----
	setSectionName(dev, "Dev");
	fillSection(contentDict.Dev, dev, 'Dev');
	
	// ---- Other (optional) ----
	//console.log(other.parentNode);
	if(other && contentDict.Other)
	{
		setSectionName(other, contentDict.Other.Title);
		fillSection(contentDict.Other.Content, other, 'Other');
	}
	else if (other) //remove the useless section
	{
		other.parentNode.removeChild(other);
	}
	//Create box to download/save content page
	createDownloadPageContentElements()
	createIntroEdit();
}

function setSectionName(section, header)
{
	let sectionHeader = section.getElementsByClassName("title")[0];
	if(!sectionHeader) return;
	sectionHeader.textContent = header;
}

function fillSection(sectionContent, sectionRootDiv, sectionRootName)
{
	let sectionTextContainer = sectionRootDiv.getElementsByClassName("inner")[0];

	contents[sectionRootName] = [];
	//Remove old content
	if(!sectionTextContainer)
	{
		console.log("Couldn't find inner");
	}
	while (sectionTextContainer != null && sectionTextContainer.firstElementChild)
	{
		// console.log("remove a child from the section");
		sectionTextContainer.removeChild(sectionTextContainer.lastElementChild);  //Remove last is quicker than removing first
	}

	//If there is nothing to show, remove the section
	if (!sectionContent || sectionContent.length == 0){
		sectionRootDiv.parentNode.removeChild(sectionRootDiv); //Hide section if there is no content 
	}

	else
	{
		createEditDragContentBox(sectionTextContainer, sectionRootDiv);
		//TODO : if missing section, add it
		for (index in sectionContent)
		{
			//Add the content
			addContent(sectionContent[index].Value, sectionContent[index].Type, sectionTextContainer, sectionRootDiv, sectionRootName, -1);
		}
	}
}

function addContent(sectionContent, sectionType, sectionTextContainer, sectionRootDiv, sectionRootName, contentsIndexToInsert)
{
	//Open new parent Div
	switch (sectionType)
	{					
		case 'Fiche':
			let fichesContainer = document.createElement('div');
			fichesContainer.className = "cards-drawer";
			sectionTextContainer.appendChild(fichesContainer);
			currentContentSubContainer = fichesContainer;
			break;
		case 'Table':
			let table =document.createElement('div');
			table.className = "features";
			sectionTextContainer.appendChild(table);
			currentContentSubContainer = table;
			break;
		default :
			currentContentSubContainer = null;
			break;
	}
	let currentContentMainEditContainer = document.createElement('div');
	currentContentMainEditContainer.className = 'row main-content-edit-row';
	sectionTextContainer.appendChild(currentContentMainEditContainer);

	let currentContentMainContainer = document.createElement('div');
	currentContentMainContainer.className = 'row main-content-row col-10';
	currentContentMainEditContainer.appendChild(currentContentMainContainer);
	
	if(currentContentSubContainer != null)
		currentContentMainContainer.appendChild(currentContentSubContainer);

	switch (sectionType)
	{
		case 'Header':
			$(currentContentMainContainer).addClass('content-header');
			let header = document.createElement('h3');
			header.className = 'col-12';
			header.textContent = sectionContent;
			currentContentMainContainer.appendChild(header);
			break;
			case 'Text':
			$(currentContentMainContainer).addClass('content-text');
			let paragraph = document.createElement('p');
			paragraph.className = 'col-12';
			paragraph.textContent = sectionContent;
			currentContentMainContainer.appendChild(paragraph);
			break;
			case 'List':
			$(currentContentMainContainer).addClass('content-list');
			let listContainer = document.createElement('ul');
			currentContentMainContainer.appendChild(listContainer);
			for (lineindex in sectionContent)
			{
				createSimpleListItem(listContainer, sectionContent[lineindex]);
			}
			break;
			case 'Fiche': //[Encars, header, text, link]
			$(currentContentMainContainer).addClass('content-fiche');
			let fiche = document.createElement('div');
			fiche.className = "tool-card";
			currentContentSubContainer.appendChild(fiche);
			if (sectionContent.length >= 4) //Meaning we have a link
			{
				let link = document.createElement('a');
				link.href = sectionContent[3]; //Start counting at 0 -> fourth element
				fiche.appendChild(link);
				fiche = link; //Allow to continue without needing if/else
			}

			let icon = document.createElement('div');
			icon.className = "text-icon";
			iconTitle = document.createElement('h1');
			iconTitle.textContent = sectionContent[0];
			icon.appendChild(iconTitle);
			fiche.appendChild(icon);

			let nameFiche = document.createElement('h3');
			nameFiche.textContent = sectionContent[1];
			fiche.appendChild(nameFiche);
			
			let descriptionFiche = document.createElement('p');
			descriptionFiche.textContent = sectionContent[2];
			fiche.appendChild(descriptionFiche);
			break;
		case 'Table':
			$(currentContentMainContainer).addClass('content-table');
			let featuresList = document.createElement('div');
			featuresList.className = "feature-list";
			currentContentMainContainer.appendChild(currentContentSubContainer);
			currentContentSubContainer.appendChild(featuresList);

			let mainRow = document.createElement('div');
			mainRow.className = "row";
			featuresList.appendChild(mainRow);

			let cellCounter = 0;

			//Loop over table cells
			for (let cellIndex in sectionContent)
			{
				cellCounter++;
				let currentTooltipDiv = null;

				if (cellCounter == 1)
				{
					let leftTooltipDiv = document.createElement('div');
					leftTooltipDiv.className = "col-2 col-4-xlarge feature-section-tooltip feature-section-tooltip-left";
					mainRow.appendChild(leftTooltipDiv);
					currentTooltipDiv = leftTooltipDiv;
				}

				let sectionDivCell = document.createElement('div');
				sectionDivCell.className = "col-4 col-8-xlarge feature-section-container";
				mainRow.appendChild(sectionDivCell);

				if (cellCounter == 2)
				{
					let rightTooltipDiv = document.createElement('div');
					rightTooltipDiv.className = "col-2 col-4-xlarge feature-section-tooltip feature-section-tooltip-right";
					mainRow.appendChild(rightTooltipDiv);
					currentTooltipDiv = rightTooltipDiv;

					cellCounter = 0;
				}

				let sectionCell = document.createElement('section');
				// sectionCell.className = "row"
				sectionCell.style.height = '100%';
				sectionDivCell.appendChild(sectionCell);

				let titleSection = document.createElement('div');
				titleSection.className = "section-title-container";
				sectionCell.appendChild(titleSection);

				let titleElement = document.createElement('h3');
				titleElement.textContent = sectionContent[cellIndex]['Title'];
				titleElement.className = 'section-title';
				titleSection.appendChild(titleElement);

				let titleDecoContainer = document.createElement('div');
				titleDecoContainer.className = 'section-title-deco-container';
				titleSection.appendChild(titleDecoContainer);

				let titleDeco = document.createElement('div');
				titleDeco.className = 'section-title-deco';
				titleDecoContainer.appendChild(titleDeco);

				let textContainer = document.createElement('div');
				textContainer.className = 'feature-text-container';
				sectionCell.appendChild(textContainer);

				//#region Tooltip element holder
				let tooltipContainer = document.createElement('div');
				tooltipContainer.className = "feature-tooltip-container";
				currentTooltipDiv.appendChild(tooltipContainer);

				let tooltipText = document.createElement('p');
				tooltipContainer.appendChild(tooltipText);
				//#endregion
				
				for (let contentIndex in sectionContent[cellIndex]['Content'])
				{
					let currentContent = sectionContent[cellIndex]['Content'][contentIndex];

					if(!Array.isArray(currentContent))
					{
						let text = currentContent;
						let simpleText = document.createElement('p');
						simpleText.className = 'feature-text';
						simpleText.textContent = text;
						textContainer.appendChild(simpleText);
					}
					else
					{
						let listElement = document.createElement('ul');
						listElement.className = 'feature-text-list';
						textContainer.appendChild(listElement);

						for (let key in currentContent)
						{
							let itemElement = document.createElement('li');
							itemElement.textContent = currentContent[key];
							listElement.appendChild(itemElement);
						}
					}
				}
				if(sectionContent[cellIndex]['Hyperlink'])
				{
					if(sectionContent[cellIndex]['Hyperlink'].length > 0)
					{
						sectionDivCell.className += " section-hyperlink";

						//Create simple a element to hold hyperlink value
						let hyperlinkElementContainer = document.createElement('a');
						hyperlinkElementContainer.className = 'hyperlink-holder';
						hyperlinkElementContainer.href = sectionContent[cellIndex]['Hyperlink'];
						$(hyperlinkElementContainer).hide();
						sectionDivCell.appendChild(hyperlinkElementContainer);

						//Hyperlink on same page
						if (sectionContent[cellIndex]['Hyperlink'].includes("#"))
						{
							sectionDivCell.addEventListener("click", smoothScrollEventHandler.bind(event, sectionContent[cellIndex]['Hyperlink']), false);
						}
						//Hyperlink on other page
						else 
						{
							let parsedHyperlink = sectionContent[cellIndex]['Hyperlink'].split('.');
							let extension = parsedHyperlink[parsedHyperlink.length - 1];
							const containsElement = AVAILABLE_HYPERLINK_EXTENSIONS.some(element => {
								if (extension.includes(element))
								{
									return true;
								}
								return false;
							});
							
							if (containsElement) {
								sectionDivCell.addEventListener("click", goToPageEventHandler.bind(event, sectionContent[cellIndex]['Hyperlink']), false);
							}
						}
					}
				}
				if(sectionContent[cellIndex]['Tooltip'])
				{
					tooltipText.textContent = sectionContent[cellIndex]['Tooltip'];
					if (cellCounter == 1)
					{
						sectionDivCell.addEventListener("mouseover", simpleAnimEventHandler.bind(event, currentTooltipDiv, { duration: 1, opacity: 1, right: "10px" }), false);
						sectionDivCell.addEventListener("mouseleave", simpleAnimEventHandler.bind(event, currentTooltipDiv, { duration: 1, opacity: 0, right: "50px" }, 1), false);
						
					}
					else if (cellCounter == 0)
					{
						sectionDivCell.addEventListener("mouseover", simpleAnimEventHandler.bind(event, currentTooltipDiv, { duration: 1, opacity: 1, right: "-10px" }), false);
						sectionDivCell.addEventListener("mouseleave", simpleAnimEventHandler.bind(event, currentTooltipDiv, { duration: 1, opacity: 0, right: "-50px" }, 1), false);
						
					}
				}
			}
			break;
		case 'Image':
			$(currentContentMainContainer).addClass('content-image');
			//Image(s) container
			let imageGrpContainer = document.createElement('div');
			currentContentMainContainer.appendChild(imageGrpContainer);

			//If a size has been provided
			let imageSize = sectionContent.Size ? sectionContent.Size : null;

			//Either an array or a single string of image paths
			let sectionImagePathValue = sectionContent.Path ? sectionContent.Path : sectionContent;

			let maxImagePerLine = sectionContent['MaxColumn'] ? Math.min(sectionImagePathValue.length, sectionContent['MaxColumn']) : Array.isArray(sectionImagePathValue) ? sectionImagePathValue.length : 1;
			imageGrpContainer.className = "images-hori-container col-12";

			//#region Setup images in grid or lineindex depending on size
			if (window.innerWidth > 980) {
				$(imageGrpContainer).css("grid-template-columns", "repeat(" + maxImagePerLine + ", 1fr)");
			}

			else {
				$(imageGrpContainer).css("grid-template-columns", "repeat(1, 1fr)");
			}
			window.addEventListener("resize",
				function () {
					if (window.innerWidth < 980) {
						$(imageGrpContainer).css("grid-template-columns", "repeat(1, 1fr)");
					}
					else {
						$(imageGrpContainer).css("grid-template-columns", "repeat(" + maxImagePerLine + ", 1fr)");
					}
				}, false);
			//#endregion
			if (Array.isArray(sectionImagePathValue))
			{
				for (let key in sectionImagePathValue)
					createImageContent(sectionImagePathValue[key], imageGrpContainer, imageSize);
			}
			else
				createImageContent(sectionImagePathValue, imageGrpContainer, imageSize);

			break;
		case 'Video':
			$(currentContentMainContainer).addClass('content-video');
			let videoGrpContainer = document.createElement('div');
			videoGrpContainer.className = "video-single-container";
			currentContentMainContainer.appendChild(videoGrpContainer);
			let videoSize = sectionContent.Size ? sectionContent.Size : null;
			let videoPath = sectionContent.Path ? sectionContent.Path : sectionContent;
			//Is it a youtube or video path ?

			if (matchYoutubeUrl(videoPath) || matchVimeoURL(videoPath))
			{
				createSourceElement(videoGrpContainer, 'iframe', videoPath, 'video-info video-iframe', videoSize, { "allow": "autoplay; fullscreen; picture-in-picture", "frameborder": "0" });
			}

			//Or it's a local file
			else
			{
				videoPath = "../videos/" + videoPath;
				let videoExtension = videoPath.split('.')[1];

				let videoElement = createSourceElement(videoGrpContainer, 'video', videoPath, 'video-info video-simple', videoSize, { "type": "video/" + videoExtension });
				videoElement.setAttribute('controls', true);
			}
			break;
	}

	//EDIT - Create edit DOM elements for each content element
	createContentEditElement(sectionType, currentContentMainEditContainer, sectionContent);

	lastType = sectionType;

	//Edit - Add delete/edit buttons
	let editButtonsContainer = document.createElement('div');
	editButtonsContainer.className = 'col-1 row edit-content-container';
	
	currentContentMainEditContainer.insertBefore(editButtonsContainer, currentContentMainEditContainer.firstChild);

	let deleteButton = document.createElement('button');
	deleteButton.className = 'col-12 delete-content-button';

	let deleteButtonImg = document.createElement('img');
	deleteButtonImg.className = 'col-12 delete-content-button-img';
	deleteButtonImg.src = '../images/icons/remove.png';
	deleteButton.appendChild(deleteButtonImg);

	deleteButton.addEventListener('click', deleteContentEventHandler.bind(event, currentContentMainEditContainer, sectionRootName), false);
	
	let editButton = document.createElement('button');
	editButton.className = 'col-12 edit-content-button';

	let editButtonImg = document.createElement('img');
	editButtonImg.className = 'col-12 edit-content-button-img';
	editButtonImg.src = '../images/icons/edit.png';
	editButton.appendChild(editButtonImg);

	editButton.addEventListener('click', editContentEventHandler.bind(event, currentContentMainEditContainer, sectionType, $(currentContentMainEditContainer).find('.main-content-row'), $(currentContentMainEditContainer).find('.content-edit-container')), false);
	
	editButtonsContainer.appendChild(editButton);
	editButtonsContainer.appendChild(deleteButton);
	
	//Edit - Add reordering buttons
	let reorderButtons = document.createElement('div');
	reorderButtons.className = 'col-1 edit-reorder-container';

	let reorderForm = document.createElement('form');
	$(reorderForm).attr({'onsubmit':"return false;"});

	
	let reorderHiddenButton = document.createElement('button');
	reorderHiddenButton.type = 'submit';
	$(reorderHiddenButton).hide();
	reorderForm.appendChild(reorderHiddenButton)
	
	
	let goesUpButton = document.createElement('button');
	let goesUpButtonImg = document.createElement('img');
	goesUpButton.appendChild(goesUpButtonImg);
	goesUpButtonImg.src = '../images/icons/up-arrow.png';
	goesUpButton.className = 'edit-reorder-up';
	
	let orderInput = document.createElement('input');
	orderInput.className = 'edit-order-input'
	orderInput.type = 'number';
	orderInput.min = 1; 
	
	let goesDownButton = document.createElement('button');
	let goesDownButtonImg = document.createElement('img');
	goesDownButtonImg.src = '../images/icons/down-arrow.png';
	goesDownButton.className = 'edit-reorder-down';
	goesDownButton.appendChild(goesDownButtonImg);
	
	reorderButtons.appendChild(goesUpButton);
	reorderForm.appendChild(orderInput);
	reorderButtons.appendChild(reorderForm);
	reorderButtons.appendChild(goesDownButton);
	currentContentMainEditContainer.appendChild(reorderButtons);
	
	//Edit - Add row to receive drop of content
	let receiveContentDropContainer = createEditDragContentBox(sectionTextContainer, sectionRootDiv);
	
	let globalContentIndex = getContentGlobalIndex(sectionRootName);
	//Setup array of contents depending or index or just push at the end
	if(contentsIndexToInsert < 0)
	{
		contents[sectionRootName].push(sectionType);
		globalContentIndex += contents[sectionRootName].length;
		orderInput.value = globalContentIndex;
	}
	else
	{
		contents[sectionRootName].splice(contentsIndexToInsert + 1, 0, sectionType);
		globalContentIndex += contentsIndexToInsert;
		orderInput.value = globalContentIndex;
	}

	reorderForm.addEventListener('submit', swapContentByTargetInputHandler.bind(event, currentContentMainEditContainer, orderInput), false);

	goesUpButton.addEventListener('click', swapContentByDirectionHandler.bind(event, currentContentMainEditContainer, true), false);
	goesDownButton.addEventListener('click', swapContentByDirectionHandler.bind(event,currentContentMainEditContainer, false), false);

	return {'Content' : currentContentMainEditContainer, 'EditBox' : receiveContentDropContainer};
}

let UpdateImageContentEventHandler = function(imageGrpContainer, amountInput, sectionImagePathValue, imageSize, event)
{
	let currentImages = $(imageGrpContainer).find('.image-container');

	//Need to remove some images
	if(currentImages.length > amountInput.value)
	{
		for(var i = currentImages.length; i >= amountInput.value; i--)
		{
			console.log(i)
			$(currentImages[i]).remove();
		}
	}
	else if(currentImages.length < amountInput.value)
	{
		console.log('doit créer : ' + (amountInput.value - currentImages.length) + ' images');
		for(var i = 0 ; i < amountInput.value - currentImages.length ; i++)
		{
			let imageContent = createImageContent(sectionImagePathValue, imageGrpContainer, imageSize);

			let imageInteractionOverlayContainer = createImageOverlay(imageContent);
					
			let imgElement = $(imageContent).find('.image-info')[0];

			imageInteractionOverlayContainer.addEventListener('click', uploadNewContent.bind(event, 'Image', imgElement));
			imageInteractionOverlayContainer.addEventListener('drop', uploadNewContentInitialize.bind(event, 'Image', imgElement));
			imageContent.appendChild(imageInteractionOverlayContainer);
		}
	}
}

function createImageContent(sectionImagePathValue, imageGrpContainer, imageSize) {
	let imagePath = "../images/" + sectionImagePathValue;
	let imageContainer = document.createElement('div');
	imageContainer.className = 'image-container';
	imageGrpContainer.appendChild(imageContainer);
	console.log(imageSize)
	createSourceElement(imageContainer, 'img', imagePath, 'image-info', imageSize);

	return imageContainer;
}

function getContentGlobalIndex(sectionRootName) {
	var sectionsToAddOrders = [...SECTIONS_ORDER];
	let globalContentIndex = 0;

	sectionsToAddOrders.splice(sectionsToAddOrders.indexOf(sectionRootName));
	sectionsToAddOrders.forEach(function (value)
	{
		globalContentIndex += contents[value].length;
	});
	return globalContentIndex;
}

function getContentTypeByIndex(contentIndex, sectionName = null)
{
	if(sectionName)
	{
		return contents[sectionName][contentIndex];
	}
	else
	{
		let sectionSubIndex = getSectionAndSubIndexByIndex(contentIndex);
		return 	contents[sectionSubIndex['Section']][sectionSubIndex['SubIndex']];
	}
}

function getSectionAndSubIndexByIndex(contentIndex)
{
	for(key in SECTIONS_ORDER)
		{
			let itemsAmountInSection = contents[SECTIONS_ORDER[key]].length;
			if((contentIndex - itemsAmountInSection) > 0)
			{
				contentIndex -= itemsAmountInSection;
			}
			else
			{
				return {'Section' : SECTIONS_ORDER[key], 'SubIndex' : parseInt(contentIndex) - 1};
			}
		}
}

// function getContentByIndex(contentIndex)
// {
// 	let sectionSubIndex = getSectionAndSubIndexByIndex(contentIndex);

// 	let innerParent = sectionNameRelation[sectionSubIndex['Section']];
// }

let swapContentByTargetInputHandler = function(thisElement, otherElementIndexInput, event)
{
	console.log(otherElementIndexInput)
	let targetElementSectionSubIndex = getSectionAndSubIndexByIndex(otherElementIndexInput.value);
	let targetElement = $($(sectionNameRelation[targetElementSectionSubIndex['Section']]).find('.inner')[0].getElementsByClassName('main-content-edit-row'))[targetElementSectionSubIndex['SubIndex']];

	swapContent(thisElement, targetElement);
}

let swapContentByDirectionHandler = function(thisElement, isGoingUp, event)
{
	//Get necessary informations to retrieve element index and global index depending on sections
	let thisElementIndex = $(thisElement.parentNode.getElementsByClassName('main-content-edit-row')).index(thisElement);
	let thisElementParent = thisElement.parentNode;
	let sectionKeyName = getKeyByValue(sectionNameRelation, thisElementParent.parentNode);
	let thisGlobalIndex = getContentGlobalIndex(sectionKeyName);

	if(isGoingUp)
	{
		//If can't go up because already on top of page content
		if(thisElementIndex + thisGlobalIndex == 0)
		{
			return;
		}
		else
		{
			if(thisElementIndex > 0)
			{
				console.log('in')
				let previousContent = thisElement.parentNode.getElementsByClassName('main-content-edit-row')[thisElementIndex - 1];
				swapContent(thisElement, previousContent, thisElementIndex + thisGlobalIndex);
				return;
			}
			//Need to change to section above
			else if(thisElementIndex == 0)
			{
				let previousSectionIndex = SECTIONS_ORDER.indexOf(sectionKeyName) - 1;
				let contentsInPreviousSection = $($(sectionNameRelation[SECTIONS_ORDER[previousSectionIndex]]).find('.inner')[0]).find('.main-content-edit-row');
				let lastItemInPreviousSection = contentsInPreviousSection[contentsInPreviousSection.length - 1];

				swapContent(thisElement, lastItemInPreviousSection, thisGlobalIndex);
				return;
			}
		}
	}
	else
	{
		//If can't go down because already at the bottom of page content
		if(thisElementIndex + thisGlobalIndex >= $(document).find('.main-content-edit-row').length - 1)
		{
			return;
		}
		else
		{
			let amountOfContentInSections = $(thisElement.parentNode).find('.main-content-edit-row').length;
			if(thisElementIndex < amountOfContentInSections - 1)
			{
				console.log('in')
				let nextContent = thisElement.parentNode.getElementsByClassName('main-content-edit-row')[thisElementIndex + 1];
				swapContent(thisElement, nextContent,  thisElementIndex + thisGlobalIndex + 2);
				return;
			}
			//Need to change to section beyond
			else if(thisElementIndex == amountOfContentInSections - 1)
			{
				let nextSectionIndex = SECTIONS_ORDER.indexOf(sectionKeyName) + 1;
				let contentsInNextSection = $($(sectionNameRelation[SECTIONS_ORDER[nextSectionIndex]]).find('.inner')[0]).find('.main-content-edit-row');
				let firstItemInNextSection = contentsInNextSection[0];
				swapContent(thisElement, firstItemInNextSection, thisGlobalIndex + thisElementIndex + 2);
				return;
			}
		}
	}
}

function swapContent(thisElement, targetElement, thisContentNewOrderIndex = -1) {
	let thisElementIndex = $(thisElement.parentNode.getElementsByClassName('main-content-edit-row')).index(thisElement);
	let thisElementParent = thisElement.parentNode;
	let sectionKeyName = getKeyByValue(sectionNameRelation, thisElementParent.parentNode);
	let thisGlobalIndex = getContentGlobalIndex(sectionKeyName);

	$(thisElement).insertBefore(targetElement);
	$(targetElement).insertAfter($(thisElementParent.getElementsByClassName('receive-drop-container')[Math.max(0, thisElementIndex)])[0]);

	$(targetElement).find('.edit-order-input')[0].value = (thisGlobalIndex + thisElementIndex + 1);
	console.log('target value : ' + (thisGlobalIndex + thisElementIndex + 1))
	//If we used arrow to reorder, we need to update the active content index ourselves
	if(thisContentNewOrderIndex >= 0)
	{
		$(thisElement).find('.edit-order-input')[0].value = thisContentNewOrderIndex;
		console.log('source value : ' + thisContentNewOrderIndex)
	}
}

function swapContentByIndex(contentIndexA, contentIndexB)
{
	let contentA = getContentTypeByIndex(contentIndexA);
	let contentB = getContentTypeByIndex(contentIndexB);

	console.log(contentA)
	console.log(contentB)
}

function createSimpleListItem(listContainer, textContent)
{
	let ligneContainer = document.createElement('li');
	ligneContainer.innerHTML = textContent;
	listContainer.appendChild(ligneContainer);
}

//EDIT - create edit part
function createContentEditElement(contentType, parent, currentContent)
{
	let editContentContainer = document.createElement('div');
	editContentContainer.className = 'row col-10 content-edit-container';
	let editContentBox = document.createElement('div');
	editContentBox.className = 'col-12 content-edit-box';

	parent.appendChild(editContentContainer);
	editContentContainer.appendChild(editContentBox);
	
	$(editContentContainer).hide();

	switch(contentType)
	{
		case 'Header' :
			let editHeaderInput = document.createElement('input');
			editHeaderInput.className = 'content-edit-input edit-header edit-text';
			editHeaderInput.type = 'text';
			editHeaderInput.value = currentContent;
			editHeaderInput.spellcheck = false;
			editContentBox.appendChild(editHeaderInput);
			break;

		case 'Text':
			let editTextInput = document.createElement('textarea');
			editTextInput.className = 'content-edit-input edit-text edit-textarea edit-adapt-text';
			editTextInput.cols = 100;
			editTextInput.maxLength = 2000;
			editTextInput.value = currentContent;
			editContentBox.appendChild(editTextInput);
			break;
			
		case 'List':
			editContentBox.className += ' edit-list-container';

			//Create append button
			let appendButtonBox = document.createElement('div');
			appendButtonBox.className = 'row';
			editContentBox.appendChild(appendButtonBox);

			let appendListElementButton = document.createElement('button');
			appendListElementButton.className = 'off-5 col-1 edit-list-append-button';

			appendListElementButton.addEventListener('click', createEditListItemEventHandler.bind(event, editContentBox), false);
			let appendListElementImg = document.createElement('img');

			appendListElementImg.src = '../images/icons/add.png';

			appendButtonBox.appendChild(appendListElementButton);
			appendListElementButton.appendChild(appendListElementImg);
			
			//Append elements
			for(listElementIndex in currentContent)
			{
				createEditListItem(editContentBox, currentContent[listElementIndex]);
			}
			break;

		case 'Image':
			let clonedImageContent = $($($(parent).children()[0]).children()[0]).clone(true)[0];
			editContentBox.appendChild(clonedImageContent);

			let images = $(clonedImageContent).find('img');
			
			$(images).each(
				function(key, element)
				{
					// $(editContentContainer).removeClass('col-11').addClass('col-10');
					let imageInteractionOverlayContainer = createImageOverlay(clonedImageContent);
					
					let imgElement = $(clonedImageContent).find('.image-info')[key];

					imageInteractionOverlayContainer.addEventListener('click', uploadNewContent.bind(event, contentType, imgElement));
					imageInteractionOverlayContainer.addEventListener('drop', uploadNewContentInitialize.bind(event, contentType, imgElement));
					
					$(element).parent()[0].appendChild(imageInteractionOverlayContainer);
				}
			);

			var interactionSnippetContainer = document.createElement('div');
			interactionSnippetContainer.className = 'col-12 edit-interaction-snippet';
			$(interactionSnippetContainer).insertAfter(clonedImageContent);
			
			var interactionSnippetText = document.createElement('p');
			interactionSnippetText.className = 'edit-snippet-text';
			interactionSnippetText.textContent = 'Cliquez ou Draguez une nouvelle image';
			interactionSnippetContainer.appendChild(interactionSnippetText)
			
			let inputImagesEditContainer = document.createElement('div');
			inputImagesEditContainer.className = 'row edit-image-input-container';
			$(editContentBox).prepend(inputImagesEditContainer)

			//Indication Nbr d'images
			let imageAmountIndicDiv = document.createElement('div');
			imageAmountIndicDiv.className = 'off-1 col-2 edit-vertical-snippet';
			let imageAmountIndicText = document.createElement('p');
			imageAmountIndicText.className = 'edit-snippet-text edit-snipppet-right';
			imageAmountIndicText.textContent = "Images";
			imageAmountIndicDiv.appendChild(imageAmountIndicText);

			inputImagesEditContainer.appendChild(imageAmountIndicDiv);
			//Input amount of image
			let inputImageAmount = document.createElement('input');
			inputImageAmount.className = 'col-2 edit-input-images-amount';
			inputImageAmount.type = 'number';
			inputImageAmount.value = images.length;
			inputImageAmount.placeholder = "Nbr d'images";
			inputImagesEditContainer.appendChild(inputImageAmount);

			//Input Amount per row
			let cssItemsPerRow = $(clonedImageContent).css('grid-template-columns').split('(')[1].split(',')[0];
			let inputImagePerRow = document.createElement('input');
			inputImagePerRow.className = 'off-2 col-2 edit-input-images-per-row';
			inputImagePerRow.type = 'number';
			inputImagePerRow.value = cssItemsPerRow;
			inputImagePerRow.placeholder = "Colonnes";
			inputImagesEditContainer.appendChild(inputImagePerRow);

			//Indication Nbr d'images
			let imageColsIndicDiv = document.createElement('div');
			imageColsIndicDiv.className = 'col-2 edit-vertical-snippet';
			let imageColsIndicText = document.createElement('p');
			imageColsIndicText.className = 'edit-snippet-text edit-snipppet-left';
			imageColsIndicText.textContent = "Colonnes";
			imageColsIndicDiv.appendChild(imageColsIndicText);

			inputImagesEditContainer.appendChild(imageColsIndicDiv);

			inputImagePerRow.addEventListener('change',
				function(event)
				{
					$(clonedImageContent).css('grid-template-columns', 'repeat(' + event.currentTarget.value + ', 1fr)')
				}
			, false);

			let defaultImagePath = "../images/pic02.jpg";
			
			let size = {'Size' : { 'Width' : '100%', 'Height' : '100%'}}
			if($(images[0]).css("width"))
				size['Size']['Width'] = $(images[0]).css("width")

			if($(images[0]).css("height"))
				size['Size']['Height'] = $(images[0]).css("height")
			
			inputImageAmount.addEventListener('change', UpdateImageContentEventHandler.bind(event, clonedImageContent, inputImageAmount, defaultImagePath, size), false);
				
			break;
		
		case 'Video':
			let clonedVideoContent = $($($(parent).children()[0]).children()[0]).clone(true)[0];

			$(editContentContainer).addClass('blocking-video-container');
			editContentBox.appendChild(clonedVideoContent);
			$(editContentContainer).removeClass('col-11').addClass('col-10');

			var interactionSnippetContainer = document.createElement('div');
			interactionSnippetContainer.className = 'col-12 edit-interaction-snippet';
			editContentBox.appendChild(interactionSnippetContainer)

			let videoElement = $(clonedVideoContent).find('.video-info')[0];
			let imageInteractionOverlayContainer = createImageOverlay(clonedVideoContent);
			$(imageInteractionOverlayContainer).insertAfter(videoElement)
			
			var interactionSnippetText = document.createElement('p');
			interactionSnippetText.className = 'edit-snippet-text';
			interactionSnippetText.textContent = 'Cliquez ou Draguez une nouvelle video\n Ou entrez un lien Youtube/Vimeo share';
			interactionSnippetContainer.appendChild(interactionSnippetText)

			let newVideoForm = document.createElement('form');
			$(newVideoForm).attr({'onsubmit':"return false;"});
			editContentBox.appendChild(newVideoForm);

			let videoLinkInput = document.createElement('input');
			videoLinkInput.className = 'edit-videolink-input';
			videoLinkInput.type = 'text';
			videoLinkInput.placeholder = 'https://www.youtube.com/embed/2Jmty_NiaXc';
			newVideoForm.appendChild(videoLinkInput); 
			
			let videoLinkSubmit = document.createElement('button');
			videoLinkSubmit.type = 'submit';
			$(videoLinkSubmit).hide();
			newVideoForm.appendChild(videoLinkSubmit);

			//Youtube or Vimeo links
			videoLinkInput.addEventListener('submit', trySetNewVideoLink.bind(event, videoLinkInput, videoElement), false);
			videoLinkSubmit.addEventListener('click', trySetNewVideoLink.bind(event, videoLinkInput, videoElement), false);

			//Upload
			imageInteractionOverlayContainer.addEventListener('click', uploadNewContent.bind(event, contentType, videoElement));
			imageInteractionOverlayContainer.addEventListener('drop', uploadNewContentInitialize.bind(event, contentType, videoElement));
			imageInteractionOverlayContainer.addEventListener('click', clearInput.bind(event, videoLinkInput));

			break;
		
		case 'Table' :
			let clonedTableContent = $($($(parent).children()[0]).children()[0]).clone(true)[0];
			$(editContentContainer).removeClass('col-11').addClass('col-10');
			editContentBox.appendChild(clonedTableContent);

			//#region for each Cell section
			$(clonedTableContent).find('.feature-section-container').each(function(key, element)
			{
				//Remove hyperlink class that contain animation
				if($(element).hasClass('section-hyperlink'))
					$(element).removeClass('section-hyperlink');

				//#region Delete cell button
				let deleteCellButton = document.createElement('button');
				deleteCellButton.className = 'delete-cell-button';

				let deleteCellImg = document.createElement('img');
				deleteCellImg.src = '../images/icons/remove.png';

				deleteCellButton.appendChild(deleteCellImg);
				element.appendChild(deleteCellButton);

				deleteTableCellEvent(deleteCellButton, element, editContentBox);
					
				//#endregion
			
				//#region Hyperlink input
				let hyperlinkInput = document.createElement('input');
				hyperlinkInput.type = 'text';
				hyperlinkInput.className = 'table-cell-hyperlink-edit edit-text';
				hyperlinkInput.placeholder = 'Hyperlien local';
				if($(element).find('.hyperlink-holder')[0])
				{
					let splittedHyperlink = $(element).find('.hyperlink-holder')[0].href.split('/');
					hyperlinkInput.value = splittedHyperlink[splittedHyperlink.length - 1 ]
				}
				$(element).find('section')[0].appendChild(hyperlinkInput);
				//#endregion

				//#region Title 'h3' edit version
				$(element).find('h3').each(function(key, element)
				{
					let titleElementInput = document.createElement('textarea')
					titleElementInput.maxLength = 100;
					titleElementInput.placeholder = 'Titre';
					titleElementInput.value = element.textContent;
					titleElementInput.className = 'table-title-edit edit-textarea';

					// titleElementInput.addEventListener('input', adaptTextareaSize, false);
					$(titleElementInput).insertBefore(element);
					$(element).remove();
				});
				//#endregion

							
				//#region Descriptions 'p' edit version
				$(element).find('p').each(function(key, element)
				{
					//TODO fonctionaliser
					let descriptionEditRow = createEditTableText(element.textContent);

					$(descriptionEditRow).insertBefore(element);
					$(element).remove();
				});
				//#endregion

				//#region List 'ul' edit version
				$(element).find('ul').each(function(key, ulElement)
				{
					// ulElement.className += ' table-list-edit col-10';

					let newEditList = createEditTableList($(ulElement).find('li'));
					$(newEditList).insertAfter(ulElement);
					ulElement.remove();

				});
				//#endregion

				//#region Add items buttons
				let featureContentContaienr = $(element).find('.feature-text-container')[0];
				let newItemsButtons = createTableCellNewItemButtons(featureContentContaienr);
				$(newItemsButtons).insertBefore(hyperlinkInput);
				//#endregion
			});

			//#endregion

			//Create edit contents for each cell
			//#region Tooltip edit version

			$(clonedTableContent).find('.feature-tooltip-container').each(function(key, tooltipElement)
			{
				$(tooltipElement).parent()[0].style.opacity = 1;
				
				let tooltipEditContainer = document.createElement('div');
				tooltipEditContainer.className = "edit-tooltip-container";

				tooltipElement.appendChild(tooltipEditContainer);
				let tooltipEdit = document.createElement('textarea');
				tooltipEdit.className = 'edit-textarea edit-tooltip';

				tooltipEditContainer.appendChild(tooltipEdit);
				
				let toggleTooltipButton = document.createElement('button');
				toggleTooltipButton.className = 'toggle-tooltip-button';

				let toggleTooltipImg = document.createElement('img');
				
				if($(tooltipElement).find('p')[0].textContent.length == 0)
				{
					$(tooltipEdit).hide();
					toggleTooltipImg.src = '../images/icons/add.png';
				}
				else
				{
					toggleTooltipImg.src = '../images/icons/remove.png';
					tooltipEdit.textContent = $(tooltipElement).find('p')[0].textContent;
				}
				$($(tooltipElement).find('p')[0]).remove();
				
				toggleTooltipButton.appendChild(toggleTooltipImg);
				tooltipElement.appendChild(toggleTooltipButton);

				addToggleEditTableToolboxHandler(toggleTooltipButton, tooltipEdit, toggleTooltipImg);
			});
			//#endregion
			
			//#region Create last child to add new cell
			//Select the last cell divs
			let currentLastCell = $(clonedTableContent).find('.feature-section-container:nth-last-child(-n + 2)')[0];
			let currentLastCellTooltitp = $($(clonedTableContent).find('.feature-section-tooltip:nth-last-child(-n + 2)')[0]);
			let addNewCellContainer = $(currentLastCell).clone(false);

			if($(currentLastCellTooltitp).hasClass('feature-section-tooltip-left'))
			{
				addNewCellContainer.insertAfter(currentLastCell);
			}
			else
			{
				addNewCellContainer.insertAfter(currentLastCellTooltitp);
				addNewCellContainer.addClass('off-4-xlarge off-2');
			}
			//Remove what we don't need from the copy
			$($(addNewCellContainer).find('section')[0]).remove();
			$($(addNewCellContainer).find('.delete-cell-button')[0]).remove();

			let addCellButton = document.createElement('button');
			addCellButton.className = 'table-cell-add-cell-btn';
			addNewCellContainer[0].appendChild(addCellButton);

			let addCellButtonImg = document.createElement('img');
			addCellButtonImg.className = 'table-cell-add-cell-img';
			addCellButton.appendChild(addCellButtonImg);
			addCellButtonImg.src = '../images/icons/add.png';

			addCellButton.addEventListener('click', appendTableCellEventHandler.bind(event,addCellButton.parentElement.parentElement, addCellButton.parentElement), false);
			//#endregion
			break;
	}

	return editContentContainer;
}

var tableItemsContents = ['Text', 'List'];

function createTableCellNewItemButtons(contentContainer)
{
	let buttonsContainer = document.createElement('div');
	buttonsContainer.className = 'row edit-table-add-items-container';

	tableItemsContents.forEach(element => 
	{
		let buttonBox = document.createElement('div');
		buttonBox.className = 'col-6';
		let newItemButton = document.createElement('button');
		let newItemText = document.createElement('p');
		newItemText.textContent = element;

		newItemButton.appendChild(newItemText);
		buttonBox.appendChild(newItemButton);
		buttonsContainer.appendChild(buttonBox);

		switch(element)
		{
			case 'Text':
				newItemButton.addEventListener('click', 
				function(event)
				{
					let descriptionEditRow = createEditTableText('');
					contentContainer.appendChild(descriptionEditRow);
				});
				
				break;
				
			case 'List':
				newItemButton.addEventListener('click', 
				function(event)
				{
					let listEditRow = createEditTableList();
					contentContainer.appendChild(listEditRow);
				});
				break;
			default:
				break;
		}
	});

	return buttonsContainer;
}

let appendTableCellEventHandler = function(parent, triggerContainer, event)
{
	//Consider first cell as a template because a table won't exist with 0 cells
	let contentCellToAdd = $($(parent).find('.feature-section-container:nth-child(2)')[0]).clone(true, true);
	let tooltipCellToAdd = $($(parent).find('.feature-section-tooltip:first-child')[0]).clone(true, true);
	
	contentCellToAdd.find('textarea').each(function(key, element)
	{
		element.value = '';
	});
	
	tooltipCellToAdd.find('textarea').each(function(key, element)
	{
		element.value = '';
	});

	contentCellToAdd.find('.feature-text-container').empty();

	let lastChild = $(parent).find('.feature-section-container:last-child')[0];
	let lastTooltip = $(parent).find('.feature-section-tooltip').last();

	if ($(lastTooltip).hasClass('feature-section-tooltip-left')) {
		tooltipCellToAdd.removeClass('feature-section-tooltip-left');
		tooltipCellToAdd.addClass('feature-section-tooltip-right');
		contentCellToAdd.insertBefore(lastChild);
		tooltipCellToAdd.insertBefore(lastChild);
	}

	else {
		tooltipCellToAdd.insertBefore(lastChild);
		contentCellToAdd.insertBefore(lastChild);
	}

	adaptAppendTableCellButton(tooltipCellToAdd, triggerContainer);

	let deleteCellButton = contentCellToAdd.find('.delete-cell-button')[0];
	let contentEditBox = contentCellToAdd.closest('.content-edit-box');
	deleteTableCellEvent(deleteCellButton, contentCellToAdd, contentEditBox);

	let tooltipToggleButton = tooltipCellToAdd.find('.toggle-tooltip-button')[0];
	let tooltipToggleImg = $(tooltipToggleButton).find('img').first()[0];
	let tooltipTextarea = tooltipCellToAdd.find('textarea').first()[0];
	addToggleEditTableToolboxHandler(tooltipToggleButton, tooltipTextarea, tooltipToggleImg);

	let itemsButtons = createTableCellNewItemButtons(contentCellToAdd.find('.feature-text-container')[0]);
	let oldButtons = contentCellToAdd.find('.edit-table-add-items-container')[0];
	$(itemsButtons).insertAfter(oldButtons);
	oldButtons.remove();
	
}

let createTableListEditItemInitialize = function(parent, event)
{
	let newListItem = document.createElement('li');
	newListItem.className = 'table-listitem-edit';
	$(newListItem).insertBefore($(parent).find('button')[0]);
	createEditTableListTextarea(newListItem);
}

let editContentEventHandler = function(mainContentElement, contentType, content, editContent, event)
{
	editContent.toggle();
	content.toggle();
	//If content was hidden, then we were editing so let's update content
	if(!content.is(':hidden'))
	{
		$(event.currentTarget).find('img')[0].src = '../images/icons/edit.png';
		switch(contentType)
		{
			case 'Header':
				var newText = editContent.find('input')[0].value;
				content.find('h3').text(newText);
				
				break;
				
			case 'Text':
				var newText = editContent.find('textarea')[0].value;
				
				content.find('p').text(newText);
				break;

			case 'List':
				var currentListLength = content.find('li').length;
				var currentList = content.find('li');
				
				let amountElementToRemove = Math.max(0, currentListLength - editContent.find('textarea').length);
				
				for(let i = 0 ;  i < amountElementToRemove ;  i++)
				{
					currentList[currentListLength - i - 1].remove();
				}
				
				editContent.find('textarea').each(
					function(index, element)
					{
						//Not need to recreate element DOM if there are enough
						if(index < currentListLength)
						{
							$(currentList[index]).text(element.value);
						}
						else
						{
							createSimpleListItem(content.find('ul')[0], element.value);
						}
					}
				);
				break;
			
			case 'Image':
				let size = {'Width' : '100%', 'Height' : '100%'};
				let firstImage = content.find('image-container')[0];
				if($(firstImage).css("width"))
					size['Size']['Width'] = $(images[0]).css("width");

				if($(firstImage).css("height"))
					size['Size']['Height'] = $(images[0]).css("height");

				let editImages = $(editContent).find('.image-info');
				let images = content.find('.image-info');

				
				//Create or update image
				editImages.each(
					function(key, element)
					{
						let currentImage = content.find('.image-info')[key] ? content.find('.image-info')[key] : null;
						let imgSrc = element.src.split('images/');
						imgSrc = imgSrc[imgSrc.length - 1];
						if(!currentImage)
						{
							currentImage = createImageContent(imgSrc, content.find('.images-hori-container')[0], size);
						}else
						{
							console.log(imgSrc)
							currentImage.src = '../images/' + imgSrc;
						}
					}
				);

				if(images.length > editImages.length)
				{
					for(var i = images.length; i >= editImages.length ; i--)
					{
						console.log(i)
						$(images[i]).parent().remove();
					}
				}

				$(content.find('.images-hori-container')[0]).attr({'style':
					$(editContent.find('.images-hori-container')[0]).attr('style')}
				);
				break;

			case 'Video':
				let newVideoSrc = $(editContent).find('.video-info')[0].src;
				content.find('.video-info')[0].src = newVideoSrc;
				break;
			case 'Table':
				let newTableDatasValue = [];
				//#region Create new table datas
				//For every cell
				$(editContent).find('.feature-list')[0].firstChild.childNodes.forEach(function(element, key)
				{
					let currentCellDatasValue = {};

					if(key == $(editContent).find('.feature-list')[0].firstChild.childNodes.length -1)
						return;
					if($(element).hasClass('feature-section-container'))
					{
						let newCellTitle = $(element).find('.table-title-edit')[0].value;
						currentCellDatasValue['Title'] = newCellTitle;

						if($(element).find('.table-cell-hyperlink-edit')[0].value.length > 0)
						{
							currentCellDatasValue['Hyperlink'] = $(element).find('.table-cell-hyperlink-edit')[0].value;
						}

						//#region Content part
						let cellContent = $(element).find('.feature-text-container')[0];
						currentCellDatasValue['Content'] = [];

						$(cellContent).children().each(
							function(key, element)
							{
								if($(element).hasClass('edit-table-description'))
								{
									let currentDescriptionContent = $(element).find('textarea')[0].value;

									if(currentDescriptionContent.length > 0)
									{
										currentCellDatasValue['Content'].push(currentDescriptionContent)
									}
								}
								else if($(element).hasClass('edit-table-list'))
								{
									let currentListValues = []
									$(element).find('textarea').each(function(key, itemElement)
									{
										let currentItemContent = itemElement.value;

										if(currentItemContent.length > 0)
										{
											currentListValues.push(currentItemContent);
										}
									});
									currentCellDatasValue['Content'].push(currentListValues)
								}
							}
						);
						//#endregion

						//#region Tooltip part
						let tooltipContainer = $(element).next().hasClass('feature-section-tooltip') ? $(element).next() : $(element).prev();
						if(!$($(tooltipContainer).find('.edit-tooltip')[0]).is(':hidden'))
						{
							currentCellDatasValue['Tooltip'] = $(tooltipContainer).find('.edit-tooltip')[0].value;
						}
						newTableDatasValue.push(currentCellDatasValue);
						//#endregion
					}
					
				});

				//#endregion
				let indexToInsert = $(mainContentElement.parentNode.getElementsByClassName('main-content-edit-row')).index(mainContentElement);
				//Create new table with newTableDatasValue
				let newUpdatedTable = addContent(
					newTableDatasValue,																//Content map data of this item
					'Table',																		//Type {Table, Text, Header, Image ...}
					$(editContent).closest('.inner')[0],													//Section parent
					$(editContent).closest('.inner')[0].parentNode,
					getKeyByValue(sectionNameRelation, $(editContent).closest('.inner')[0].parentNode),	//Section name
					indexToInsert																	//Index to insert contents in
				);
				$(newUpdatedTable['Content']).insertAfter(mainContentElement);
				$(mainContentElement).remove();
				break;
			case 'Intro':
				sumary.textContent = editContent.find('textarea')[0].value;
				title.textContent = editContent.find('input')[0].value;
				
				break;
			case 'Cards':
				let editInitials = $(editContent).find('.edit-card-initials');
				let editNames = $(editContent).find('.edit-card-name');
				let editShorts = $(editContent).find('.edit-card-short');

				let contentInitials = $(content).find('.card-initials');
				let contentNames = $(content).find('.card-name');
				let contentShorts = $(content).find('.card-short');

				editInitials.each(function(key, initialEditElement)
				{
					contentInitials[key].textContent = initialEditElement.value;
				});

				editNames.each(function(key, nameEditElement)
				{
					contentNames[key].textContent = nameEditElement.value;
				});

				editShorts.each(function(key, shortEditElement)
				{
					contentShorts[key].textContent = shortEditElement.value;
				});
				downloadEditNewPageList(content);
				break;
			default:
				console.log('Unknown type');
				break;
		}
	}
	//Just simply change button image background when we toggle in edit mode
	else
	{
		$(event.currentTarget).find('img')[0].src = '../images/icons/confirm.png';
	}
}

let createEditListItemEventHandler = function(parent, event)
{
	return createEditListItem(parent);
}

function createEditTableList(items = null)
{
	let listEditRow = document.createElement('div');
	listEditRow.className = 'row edit-table-list';

	let editList = document.createElement('ul');
	editList.className = 'feature-text-list table-list-edit col-10';
	//For each 'li' item, create its edit version
	if(items != null)
		items.each(function(key, liElement)
		{
			createEditTableListTextarea(liElement);
			editList.appendChild(liElement);
		});

	//Add buttons to append item
	let appendItemButton = document.createElement('button');
	let appendItemImg = document.createElement('img');
	appendItemButton.className = 'add-button';
	appendItemImg.className = 'add-button-img edit-button-colored';

	appendItemButton.appendChild(appendItemImg);
	appendItemImg.src = '../images/icons/add.png';

	let deleteItemButton = createRemoveTableItemButton(listEditRow);

	editList.appendChild(appendItemButton);
	$(listEditRow).insertBefore(editList);
	listEditRow.appendChild(editList);
	listEditRow.appendChild(deleteItemButton);
	//On add button click, create a new item through 'createTableListEditItemInitialize' before it creates a textarea in this new 'li' item
	appendItemButton.addEventListener('click', createTableListEditItemInitialize.bind(event, editList))

	return listEditRow;
}

function createEditTableText(textContent)
{
	let descriptionEditRow = document.createElement('div');
	descriptionEditRow.className = 'row edit-table-description';

	let descriptionElementInput = document.createElement('textarea');
	descriptionElementInput.maxLength = 1000;
	descriptionElementInput.placeholder = 'Description';
	descriptionElementInput.value = textContent;
	descriptionElementInput.className = 'table-description-edit edit-textarea col-10';

	let removeItemButton = createRemoveTableItemButton(descriptionEditRow);

	descriptionEditRow.appendChild(descriptionElementInput);
	descriptionEditRow.appendChild(removeItemButton);

	return descriptionEditRow;
}

function createRemoveTableItemButton(itemToRemove) 
{
	let buttonBox = document.createElement('div');
	buttonBox.className = 'col-2 edit-table-remove-content-button-box';

	let removeItemButton = document.createElement('button');
	let removeItemImg = document.createElement('img');

	removeItemButton.className = 'edit-table-remove-content-button';
	buttonBox.appendChild(removeItemButton);
	removeItemButton.appendChild(removeItemImg);
	removeItemImg.src = '../images/icons/remove.png';

	removeItemButton.addEventListener('click', function (event)
	{
		itemToRemove.remove();
	});

	return buttonBox;
}

function addToggleEditTableToolboxHandler(toggleTooltipButton, tooltipEdit, deleteTooltipImg)
{
	toggleTooltipButton.addEventListener('click',
		function (event)
		{
			$(tooltipEdit).toggle();
			deleteTooltipImg.src = $(tooltipEdit).is(':hidden') ? '../images/icons/add.png' : '../images/icons/remove.png';
		},
		false);
}

function adaptAppendTableCellButton(lastTooltip, triggerContainer) 
{

	if (!$(lastTooltip).hasClass('feature-section-tooltip-left'))
	{
		if (!$(triggerContainer).hasClass('off-4-xlarge off-2'))
			$(triggerContainer).addClass('off-4-xlarge off-2');
	}
	else 
	{
		$(triggerContainer).removeClass('off-4-xlarge off-2');
	}
}

function deleteTableCellEvent(deleteCellButton, element, editContentBox) 
{
	deleteCellButton.addEventListener('click',
		function (event) {
			//remove section container and sibling tooltip associated
			let tooltipToRemove = $(element).next().hasClass('feature-section-tooltip') ? $(element).next() : $(element).prev();
			let currentKey = $(element).index();
			element.remove();
			tooltipToRemove.remove();
			
			//Reagencing
			$($(editContentBox).find('.feature-list')[0].firstChild).children().each(
				function (key, element) {
					if (key % 2 == 1 && key >= currentKey)
						$(element).insertBefore($(element).prev());
					}
					);
					
					$($(editContentBox).find('.feature-list')[0].firstChild).children().each(
				function (key, element) {
					if ($(element).hasClass('feature-section-tooltip-left') && (key - 3) % 4 == 0 && key > 0)
					$(element).removeClass('feature-section-tooltip-left').addClass('feature-section-tooltip-right');
					
					else if ($(element).hasClass('feature-section-tooltip-right') && key % 4 == 0) {
						$(element).removeClass('feature-section-tooltip-right').addClass('feature-section-tooltip-left');
					}
				}
				);
			
			let addCellButton = $(editContentBox).find('.table-cell-add-cell-btn')[0]
			let lastTooltip = $(editContentBox).find('.feature-section-tooltip').last();
			adaptAppendTableCellButton(lastTooltip, addCellButton.parentElement);
		},
		false);
}

function createEditTableListTextarea(parent) 
{
	parent.className = 'table-listitem-edit';
	let editTextarea = document.createElement('textarea');
	editTextarea.className = 'edit-textarea';
	editTextarea.textContent = parent.textContent;
	editTextarea.placeholder = 'Entrez votre texte';
	parent.textContent = '';
	parent.appendChild(editTextarea);

	parent.addEventListener('click', function (event)
	{
		if (event.target.nodeName == 'LI') {
			if ($(event.target).siblings().length == 0)
				$(event.target).parent().remove();

			else
				this.remove();
		}
	}, false);

	return editTextarea;
}

function createImageOverlay(parent)
{
	parent.className += ' interaction-overlay-container';

	let imageInteractionOverlayContainer = document.createElement('div');
	imageInteractionOverlayContainer.className = 'interaction-overlay';

	let imageInteractionOverlayImage = document.createElement('img');
	imageInteractionOverlayImage.className = 'interaction-overlay-img';
	imageInteractionOverlayImage.src = '../images/icons/upload.png';
	imageInteractionOverlayImage.style.opacity = 0;
	imageInteractionOverlayContainer.appendChild(imageInteractionOverlayImage);

	//Fancy event
	imageInteractionOverlayContainer.addEventListener('mouseover', simpleAnimEventHandler.bind(event, imageInteractionOverlayContainer, { 'duration': 0.3, 'backgroundColor': 'rgba(0,0,0,.15)' }), false);
	imageInteractionOverlayContainer.addEventListener('mouseleave', simpleAnimEventHandler.bind(event, imageInteractionOverlayContainer, { 'duration': 0.3, 'backgroundColor': 'rgba(0,0,0,0)' }), false);
	imageInteractionOverlayContainer.addEventListener('mouseover', simpleAnimEventHandler.bind(event, imageInteractionOverlayImage, { 'duration': 0.3, 'opacity': '.25' }), false);
	imageInteractionOverlayContainer.addEventListener('mouseleave', simpleAnimEventHandler.bind(event, imageInteractionOverlayImage, { 'duration': 0.3, 'opacity': '0' }), false);

	imageInteractionOverlayContainer.addEventListener('dragenter', simpleAnimEventHandler.bind(event, imageInteractionOverlayContainer, { 'duration': 0.3, 'backgroundColor': 'rgba(0,0,0,.15)' }), false);
	imageInteractionOverlayContainer.addEventListener('dragleave', simpleAnimEventHandler.bind(event, imageInteractionOverlayContainer, { 'duration': 0.3, 'backgroundColor': 'rgba(0,0,0,0)' }), false);
	imageInteractionOverlayContainer.addEventListener('dragenter', simpleAnimEventHandler.bind(event, imageInteractionOverlayImage, { 'duration': 0.3, 'opacity': '.25' }), false);
	imageInteractionOverlayContainer.addEventListener('dragleave', simpleAnimEventHandler.bind(event, imageInteractionOverlayImage, { 'duration': 0.3, 'opacity': '0' }), false);
	
	return imageInteractionOverlayContainer;
}

function createEditListItem(parent, itemContent = 'Nouvel element')
{
	let editItemRow = document.createElement('div');
	editItemRow.className = 'row';

	let editListEltTextInput = document.createElement('textarea');
	editListEltTextInput.className = 'content-edit-input edit-textarea edit-list-text col-11';
	editListEltTextInput.cols = 100;
	editListEltTextInput.maxLength = 2000;
	editListEltTextInput.value = itemContent;
	editListEltTextInput.spellcheck = false;

	let editListItemRemoveButton = document.createElement('button');
	editListItemRemoveButton.className = 'content-edit-list-remove-item col-1';

	editListItemRemoveButton.addEventListener('click', removeItemEventHandler.bind(event, editItemRow), false);

	let editListItemRemoveImg = document.createElement('img');
	editListItemRemoveButton.appendChild(editListItemRemoveImg);
	editListItemRemoveImg.src = ' ../images/icons/remove.png';

	editItemRow.appendChild(editListEltTextInput);
	editItemRow.appendChild(editListItemRemoveButton);

	$(editItemRow).insertBefore(parent.lastElementChild);

	return editListEltTextInput;
}

let deleteContentEventHandler = function(element, section, event)
{
	deleteContent(element, section);
}

function deleteContent(element, section)
{
	let contentIndex = $(element.parentNode.getElementsByClassName('main-content-edit-row')).index(element);
	contents[section].splice(contentIndex, 1);
	$(element).next().remove();
	$(element).remove();
}

function createEditDragContentBox(sectionTextContainer, sectionRootDiv) 
{
	let receiveContentDropContainer = document.createElement('div');
	receiveContentDropContainer.className = 'row receive-drop-container';

	if (sectionTextContainer != null) {
		sectionTextContainer.appendChild(receiveContentDropContainer);
	}

	else {
		sectionRootDiv.appendChild(receiveContentDropContainer);
	}

	let dragNewContentBoxContainer = document.createElement('div');
	dragNewContentBoxContainer.className = 'off-5 col-2 receive-drop';
	receiveContentDropContainer.appendChild(dragNewContentBoxContainer);

	let dragNewContentText = document.createElement('p');
	dragNewContentText.className = 'receive-drop-text';
	dragNewContentText.textContent = 'Drag content here';
	dragNewContentBoxContainer.appendChild(dragNewContentText);

	dragNewContentBoxContainer.addEventListener('mouseenter',
		receiDropEventHandler.bind(event, dragNewContentBoxContainer,
			{ duration: .3, backgroundColor: 'rgba(255, 0, 89.25, .1)', cursor: 'grab' }), false);

	dragNewContentBoxContainer.addEventListener('mouseup',
		receiDropEventHandler.bind(event, dragNewContentBoxContainer,
			{ duration: .3, backgroundColor: 'rgba(255, 0, 89.25, .05)', cursor: 'initial' }), false);

	dragNewContentBoxContainer.addEventListener('mouseleave',
		receiDropEventHandler.bind(event, dragNewContentBoxContainer,
			{ duration: .3, backgroundColor: 'rgba(255, 0, 89.25, .05)', cursor: 'initial' }), false);

	return receiveContentDropContainer;
}

function createSourceElement(parent, type, src, className, size, attributes = {})
{
	let element = document.createElement(type);

	if(size != null)
	{
		if(size.Height)
			parent.style.height = size.Height;
		if(size.Width)
			parent.style.width = size.Width;
	}

	element.className = className;
	element.src = src;

	for(let key in attributes){
		element.setAttribute(key, attributes[key]);
	}

	parent.appendChild(element);
	return element;
}

var simpleAnimEventHandler = function(element, attributes, event)
{
	gsap.to(element, attributes)
}

var goToPageEventHandler = function(url, event)
{
	window.location.href = url;
}

var smoothScrollEventHandler = function(anchor, event)
{
	gsap.to(window, {duration: 1, scrollTo:anchor});
}

var displayTooltipEventHandler = function(tooltipText,tooltipElement, event)
{
	gsap.to(tooltipElement, {
		duration : .33,
		opacity : 1
	});

	let tooltipTextElement = tooltipElement.firstElementChild;
	
	if(tooltipTextElement.textContent != tooltipText)
	{
		tooltipTextElement.textContent = tooltipText;
	}
}

function matchYoutubeUrl(url)
{
    var p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    return p.test(url);
}

function matchVimeoURL(url)
{
	var p = /(http|https)?:\/\/(www\.|player\.)?vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|video\/|)(\d+)(?:|\/\?)/;
	return p.test(url);
}

function askContent(sourceJson)
{
	fillPage(sourceJson);
}

function getPageJSDataFile(filePath, isJson)
{
	let content = readTextFile(filePath, function(text){
		//Parse in JS data file content we need
		let startIndex = text.indexOf('{');
		let endIndex = text.lastIndexOf('}',text.length - 2);
		let data = text.substr(startIndex,endIndex - startIndex + 1);
	
		if(isJson)
		{
			return JSON.parse(content);
		}
	
		return data;
	})
	return content;
}

//Saving page
let saveContentEventHandler = function (fileName, extension, textContent)
{
	//Create a blob to generate downlaod URL of content
	var blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
	var blobURL = URL.createObjectURL(blob);

	//Ephemeral button to download
	let downloadElement = document.createElement('a');
	$('html').append(downloadElement);
	downloadElement.href = blobURL;
	downloadElement.download = fileName + extension;

	//Simulate click to download
	downloadElement.click();
	downloadElement.remove();
}

//Read file
function readTextFile(file, callback)
{
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/js");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}


function createDownloadPageContentElements()
{
	let downloadPageContentContainer = document.createElement('div');
	let downloadPageContentButton = document.createElement('button');
	let downloadPageContentImage = document.createElement('img');
	downloadPageContentImage.src = '../images/icons/save.png';
	downloadPageContentContainer.appendChild(downloadPageContentButton);
	downloadPageContentButton.appendChild(downloadPageContentImage);
	
	downloadPageContentContainer.className = 'edit-save-content-container';
	document.getElementById('wrapper').appendChild(downloadPageContentContainer);

	downloadPageContentContainer.addEventListener('click', downloadCurrentPageDataEventHandler , false);
}

function getActivePageElement()
{
	let activePageElement = '';
	$('nav').find('li').each(function(key, element)
	{
		if($($(element).find('a')[0]).hasClass('active'))
		{
			activePageElement = $(element).find('a')[0];
			return;
		}
	});
	return activePageElement;
}

let downloadCurrentPageDataEventHandler = function(event)
{
	//Read template file just to get the body
	readTextFile('../PagesContent/Template.js',
		function(pagesListText)
		{	
			let previousData = getFileContentOnly(pagesListText);
			let datas = convertCurrentPageContentToDatas();
			let dataStr = JSON.stringify(datas, null, 4);
			
			//#region Useless thanks to Lucie
			// dataStr = dataStr.replaceAll('}', "\n}");
			// dataStr = dataStr.replaceAll('}]}', '\n}]}');
			// dataStr = dataStr.replaceAll('{', "{\n\t");
			// dataStr = dataStr.replaceAll(':[{', ":\n\t[{");
			// dataStr = dataStr.replaceAll(',{', "\n,{\t");
			// dataStr = dataStr.replaceAll('","', '",\n\t"');
			// dataStr = dataStr.replaceAll(':{', ':\n{');
			// dataStr = dataStr.replaceAll('],"', '],\n\t"');
			// dataStr = dataStr.replaceAll('},', '},\n');
			// dataStr = dataStr.replaceAll('}}}', '\n}\n}\n}');
			// dataStr = dataStr.replaceAll('}]', '\n}\n]');
			// dataStr += '\n}';
			//#endregion
			let newPageData = pagesListText.replace(previousData, dataStr)
			let activePageActiveURL = window.location.href;
			let splittedPagePath = activePageActiveURL.split('/');
			let currentPageName = splittedPagePath[splittedPagePath.length - 1].split('.')[0];
	
			saveContentEventHandler(currentPageName, '.js', newPageData);
		});
}

function convertCurrentPageContentToDatas()
{
	let newDatas = {};
	//Page head info
	newDatas['Title'] = document.getElementById('Title').textContent;
	newDatas['Sumary'] = document.getElementById('Sumary').textContent;

	let backgroundImageSrc = document.getElementById('intro').style.backgroundImage.split('\"')[1].replace('../', '');
	newDatas['Visual'] = backgroundImageSrc;

	//Loop over all DOM Content element
	$('.main-content-edit-row').each(function(key, mainElement)
	{
		let mainContent = $(mainElement).find('.main-content-row')[0];
		let contentSection = getKeyByValue(sectionNameRelation, mainElement.parentElement.parentElement)

		if(!newDatas[contentSection])
			newDatas[contentSection] = []

		if($(mainContent).hasClass('content-header'))
		{
			newDatas[contentSection].push({Type : 'Header', Value : $(mainContent).find('h3')[0].textContent})
		}
		else if($(mainContent).hasClass('content-text'))
		{
			newDatas[contentSection].push({Type : 'Text', Value : $(mainContent).find('p')[0].textContent})
		}
		else if($(mainContent).hasClass('content-list'))
		{
			let listItemsValue = []
			$(mainContent).find('li').each(function(key, listItemElement)
			{
				listItemsValue.push(listItemElement.textContent);
			});
			newDatas[contentSection].push({Type : 'List', Value : listItemsValue})
		}
		else if($(mainContent).hasClass('content-table'))
		{
			let tableDataValues = []

			$(mainContent).find('.feature-section-container').each(function(key, tableSectionElement)
			{
				let tableDataCell = {}
				//Title
				tableDataCell['Title'] = $(tableSectionElement).find('.section-title')[0].textContent ;
				
				let tableCellContents = [];
				//#region Content
				$($(tableSectionElement).find('.feature-text-container')[0]).children().each(function(key, tableContentItemElement)
				{
					if($(tableContentItemElement).hasClass('feature-text'))
					{
						tableCellContents.push($(tableContentItemElement)[0].textContent);
					}
					else if ($(tableContentItemElement).hasClass('feature-text-list'))
					{
						let tableCellListContent = []
						$(tableContentItemElement).children().each(function(key, tableContentListItem)
						{
							tableCellListContent.push(tableContentListItem.textContent);
						});
						tableCellContents.push(tableCellListContent);
					}
					
				});
				
				//#region Tooltip 
				let tooltipContainer = $(tableSectionElement).prev().hasClass('feature-section-tooltip') ? $(tableSectionElement).prev()[0] : $(tableSectionElement).next()[0];
				
				let tooltipText = $(tooltipContainer).find('p')[0].textContent;
				if(tooltipText.length > 0)
				{
					tableDataCell['Tooltip'] = tooltipText;
				}
				//#endregion
				

				//#region Hyperlink
				let hyperlink = $(tableSectionElement).find('.hyperlink-holder')[0];
				if(hyperlink)
				{
					let splittedLink = hyperlink.href.split('/');
					tableDataCell['Hyperlink'] = splittedLink[splittedLink.length - 1];
				}
				//#endregion
				tableDataCell['Content'] = tableCellContents;
				//#endregion
				tableDataValues.push(tableDataCell);
			});
			newDatas[contentSection].push({Type : 'Table', Value : tableDataValues})
		}
		else if($(mainContent).hasClass('content-image'))
		{
			let imagesContainers = $(mainContent).find('.image-container');
			let imageContentValue = {};
			//Mutliple images
			if(imagesContainers.length > 1)
			{
				let imagesPaths = []
				imagesContainers.each(function(key, imageContainerElement)
				{
					let splittedImgPath =$(imageContainerElement).find('img')[0].src.split('images/');
					imagesPaths.push(splittedImgPath[splittedImgPath.length - 1]);
				});
				imageContentValue['Path'] = imagesPaths;
			}
			//Single image
			else if (imagesContainers.length == 1)
			{
				let splittedImgPath = $(imagesContainers[0]).find('img')[0].src.split('images/');
				imageContentValue['Path'] = splittedImgPath[splittedImgPath.length - 1];
			}
			
			imageContentValue['Size'] =  {'Height' : imagesContainers[0].style.height, 'Width' : imagesContainers[0].style.width};
			newDatas[contentSection].push({Type : 'Image', Value : imageContentValue})
		}
		else if($(mainContent).hasClass('content-video'))
		{
			let videoContentValue = {};
			
			let videoContent = $(mainContent).find('video')[0] ? $(mainContent).find('video')[0] : $(mainContent).find('iframe')[0];
			let videoPath = '';
			if(videoContent.nodeName == 'VIDEO')
			{
				let splittedVideoPath = videoContent.src.split('videos/');
				videoPath = splittedVideoPath[splittedVideoPath.length - 1].replaceAll('%20', ' ');
			}
			else if(videoContent.nodeName == 'IFRAME')
			{
				videoPath = videoContent.src;
			}
			
			let directVideoContainer = $(mainContent).find('.video-single-container')[0];
			videoContentValue['Path'] = videoPath;
			videoContentValue['Size'] =  {'Height' : directVideoContainer.style.height, 'Width' : directVideoContainer.style.width};

			newDatas[contentSection].push({Type : 'Video', Value : videoContentValue})
		}
	});
	return newDatas;
}

function createIntroEdit()
{
	//#region Setup
	let innerIntro = $(headerBg).find('.inner')[0];
	$(innerIntro).addClass('row');
	
	$(title).addClass('col-12');
	$(sumary).addClass('col-12');
	
	let introContentContainer = document.createElement('div');
	let editIntroContentContainer = document.createElement('div');
	
	introContentContainer.className = 'col-12 intro-content-container';
	editIntroContentContainer.className = 'edit-intro-content-container';

	introContentContainer.appendChild(title);
	introContentContainer.appendChild(sumary);
	innerIntro.appendChild(introContentContainer);
	innerIntro.appendChild(editIntroContentContainer);
	$(editIntroContentContainer).hide();
	//#endregion

	//#region Buttons
	let editIntroContainer = document.createElement('div');
	editIntroContainer.className = 'col-12 edit-intro-container';

	let editIntroButton = document.createElement('button');
	editIntroButton.className = 'edit-intro-button';

	let editIntroImg = document.createElement('img');
	editIntroImg.src = '../images/icons/edit.png';
	editIntroButton.appendChild(editIntroImg);

	editIntroContainer.appendChild(editIntroButton);

	innerIntro.appendChild(editIntroContainer);

	//#endregion

	//#region Edit inputs

	let titleEdit = document.createElement('input');
	let sumaryEdit = document.createElement('textarea');
	titleEdit.type = 'text';
	titleEdit.className = 'col-12 edit-title';

	titleEdit.value = title.textContent;
	sumaryEdit.value = sumary.textContent;
	sumaryEdit.className = 'col-12 edit-sumary';
	editIntroContentContainer.appendChild(titleEdit);
	editIntroContentContainer.appendChild(sumaryEdit);
	
	editIntroButton.addEventListener('click', editContentEventHandler.bind(event, $(innerIntro), 'Intro', $(introContentContainer), $(editIntroContentContainer)), false); 

	//#endregion
	//#region Background Image drop
	let newBGImageDropContainer = document.createElement('div');
	newBGImageDropContainer.className = 'off-4 col-4 edit-intro-bg receive-drop-container';
	innerIntro.appendChild(newBGImageDropContainer);

	let newBGImageDropBox = document.createElement('div');
	newBGImageDropBox.className = 'col-12 receive-drop';
	newBGImageDropContainer.appendChild(newBGImageDropBox);

	let newBGImageText = document.createElement('p')
	newBGImageText.className = 'receive-drop-text';
	newBGImageText.textContent = "Click/Drop background image here";
	newBGImageDropBox.appendChild(newBGImageText);

	//Fancy event
	newBGImageDropBox.addEventListener('mouseover', simpleAnimEventHandler.bind(event, newBGImageDropBox, { 'duration': 0.3, 'backgroundColor': 'rgba(255, 0, 89.25, .55)' }), false);
	newBGImageDropBox.addEventListener('mouseleave', simpleAnimEventHandler.bind(event, newBGImageDropBox, { 'duration': 0.3, 'backgroundColor': 'rgba(255, 0, 89.25, .35)' }), false);

	newBGImageDropBox.addEventListener('dragenter', simpleAnimEventHandler.bind(event, newBGImageDropBox, { 'duration': 0.3, 'backgroundColor': 'rgba(255, 0, 89.25, .55)' }), false);
	newBGImageDropBox.addEventListener('dragleave', simpleAnimEventHandler.bind(event, newBGImageDropBox, { 'duration': 0.3, 'backgroundColor': 'rgba(255, 0, 89.25, .35)' }), false);

	newBGImageDropBox.addEventListener('click', uploadNewContent.bind(event, 'BGImage', headerBg));
	newBGImageDropBox.addEventListener('drop', uploadNewContentInitialize.bind(event, 'BGImage', headerBg));
	
	//#endregion
}

//Initialize content data on drag and drop (creation)
function initializeItemContent(type)
{
	let contentData = {"Type" : type, "Value": ''};
	
	switch(type)
	{
		case 'Table':
			contentData.Value = [{"Title" : "Titre", "Content" : ["Descriptif par défaut"]}];
			break;
		case 'Text':
			contentData.Value = 'Nouveau texte';
			break;
		case 'Header':
			contentData.Value = 'Nouveau texte';
			break;

		case 'List' :
			contentData.Value = ['Nouvel element'];
			break;
		case 'Image':
			contentData.Value = {
				"Path" : "placeholders/placeholder1280x720.jpg",
				"Size":{"Height" : "100%", "Width" : "100%"}};
			break;
		case 'Video':
			contentData.Value = {"Path" : "https://www.youtube.com/embed/NpEaa2P7qZI", "Size":{"Height" : "480px", "Width" : "720px"} };
			break;
	}
	return contentData;
}

let dragToolBoxItemEventHandler = function(element, event)
{
	element.css({'top' : yMousePos, 'left' : xMousePos});
}

function captureMousePosition(event)
{
    xMousePos = event.pageX;
    yMousePos = event.pageY;
    window.status = "x = " + xMousePos + " y = " + yMousePos;
}

//#region Events on start

$(function(){
	$(document).on('mousemove', function(event)
	{
		captureMousePosition(event);

		if(isDragingContent)
		{
			$('body').css({cursor: 'grabbing'});
		}
	});
	
	$(window).on('scroll', function(event)
	{
		if(lastScrolledLeft != $(document).scrollLeft()){
			xMousePos -= lastScrolledLeft;
			lastScrolledLeft = $(document).scrollLeft();
			xMousePos += lastScrolledLeft;
		}
		if(lastScrolledTop != $(document).scrollTop()){
			yMousePos -= lastScrolledTop;
			lastScrolledTop = $(document).scrollTop();
			yMousePos += lastScrolledTop;
		}
		window.status = "x = " + xMousePos + " y = " + yMousePos;
	});
});

let receiDropEventHandler = function(element, params, event)
{
	if(isDragingContent)
		gsap.to(element, params);
}

//#endregion


window.addEventListener("drop",function(e)
{
	e = e || event;
	e.preventDefault();
}, false);

window.addEventListener("dragover",function(e){
	e = e || event;
	e.preventDefault();
},false);
//#region Uploads
//Upload new content by creating a temp input element
let uploadNewContent = function(contentType, element, event)
{
	let tempFileInput = '';
	//If we canceled before, it still exists so check if there is one before creating
	if($(document.body).find('.temp-file-input')[0])
	{
		tempFileInput = $(document.body).find('.temp-file-input')[0]
	}
	else
	{
		tempFileInput = document.createElement('input')
		tempFileInput.className = 'temp-file-input';
	}

	switch(contentType)
	{
		case 'Image':
			tempFileInput.accept="image/png, image/gif, image/jpeg, image/jpg"; 
			break;
		case 'BGImage':
			tempFileInput.accept="image/png, image/gif, image/jpeg, image/jpg"; 
			break;
		case 'Video':
			tempFileInput.accept="video/mp4, image/mov, image/avi"; 
			break;
		
	}
	$(tempFileInput).hide();
	tempFileInput.type = 'file';

	$('body').append(tempFileInput);
	$(tempFileInput).trigger('click');

	tempFileInput.addEventListener('change', uploadNewContentInitialize.bind(event, contentType, element), false, {once : true});
	document.body.onfocus = cancelTempInputFieldEventHandler;

}

let cancelTempInputFieldEventHandler = function(event)
{
	setTimeout(tryRemoveTempIInputField, 100);
	document.body.onfocus -= cancelTempInputFieldEventHandler;
}

function tryRemoveTempIInputField()
{
	if($(document.body).find('.temp-file-input')[0])
		if($(document.body).find('.temp-file-input')[0].value.length == 0)
			$(document.body).find('.temp-file-input')[0].remove();
}

function uploadNewContentInitialize(contentType, element, event)
{
	//Get our temp file input if we clicked
	let tempFileInput = $(document.body).find('.temp-file-input')[0];
	let fileName = '';

	if(tempFileInput)
	{
		let fileNameSplitted = tempFileInput.value.split('\\');
		fileName = fileNameSplitted[fileNameSplitted.length -1];
	}
	//Else check if we draged
	else if(!tempFileInput && event.dataTransfer.files[0])
	{
		fileName = event.dataTransfer.files[0].name;
	}
	else
		return;

	if(fileName != '')
		switch(contentType)
		{
			case 'Image':
				element.src = "../images/" + fileName;
				break;

			case 'Video':
				if(element.nodeName.toUpperCase() != 'VIDEO')
				{
					let mainContainer = element.closest('.main-content-edit-row');
					let indexToInsert = $(mainContainer.parentNode.getElementsByClassName('main-content-edit-row')).index(mainContainer);
					let sectionRootName = getKeyByValue(sectionNameRelation, element.closest('.inner').parentNode);

					let currentContentMainContainer = addContent(
						fileName,
						'Video',
						element.closest('.inner'),
						element.closest('.inner').parentNode,
						getKeyByValue(sectionNameRelation, element.closest('.inner').parentNode),
						indexToInsert
					)
					$(currentContentMainContainer['Content']).insertAfter($(mainContainer).next());
					$(currentContentMainContainer['EditBox']).insertAfter(currentContentMainContainer['Content']);
					
					deleteContent(mainContainer,sectionRootName);

					$(currentContentMainContainer['Content']).find('.edit-content-button')[0].click();
				}else
				{
					element.src = "../videos/" + fileName;
				}

				break;
			case 'BGImage':
				$(element).css({'background-image' : "url(../images/" + fileName + ")"});
				break;
		}
	//Remove temp input
	$(tempFileInput).remove()

}

let trySetNewVideoLink = function(elementInput, element, event)
{
	if(matchYoutubeUrl(elementInput.value) || matchVimeoURL(elementInput.value))
	{
		//If this video isn't an iframe, then we must change it
		if(element.nodeName.toUpperCase() != 'IFRAME')
		{
			let mainContainer = element.closest('.main-content-edit-row');
			let indexToInsert = $(mainContainer.parentNode.getElementsByClassName('main-content-edit-row')).index(mainContainer);
			let sectionRootName = getKeyByValue(sectionNameRelation, element.closest('.inner').parentNode);

			let currentContentMainContainer = addContent(
				elementInput.value,
				'Video',
				element.closest('.inner'),
				element.closest('.inner').parentNode,
				getKeyByValue(sectionNameRelation, element.closest('.inner').parentNode),
				indexToInsert
			)
			$(currentContentMainContainer['Content']).insertAfter($(mainContainer).next());
			$(currentContentMainContainer['EditBox']).insertAfter(currentContentMainContainer['Content']);
			
			console.log(currentContentMainContainer['Content'])
			deleteContent(mainContainer,sectionRootName);

			$(currentContentMainContainer['Content']).find('.edit-content-button')[0].click();
			
		}else
		{
			element.src = elementInput.value;
		}
	}
	else if (elementInput.value != '')
		alert("Ton lien n'est ni un lien share Youtube ou Vimeo :/")

	event.preventDefault();
}

let clearInput = function(elementInput, event)
{	
	elementInput.value == ''
}

//#endregion