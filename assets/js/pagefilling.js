let title = document.getElementById("Title");
let sumary = document.getElementById("Sumary");
let headerBg = document.getElementById("intro");
let faq = document.getElementById("FAQ");
let manual = document.getElementById("Manual");
let dev = document.getElementById("Dev");
let other = document.getElementById("Other");
let lastType = null;  //Use this for type needing a parent div (list, fiche, table...)
let currentSubContainer = null;

const AVAILABLE_HYPERLINK_EXTENSIONS = ['html', 'php'];

function fillPage(contentDict)
{
	// ---- Intro ----
	title.textContent = contentDict.Title;
	if (contentDict.Visual && contentDict.Visual.length > 4)
	{
		headerBg.style.backgroundImage = "url(" + contentDict.Visual + ")";
	}
	sumary.textContent = contentDict.Sumary;

	// ---- User Manual ----
	setSectionName(manual, "Utilisation");
	fillSection(contentDict.Manual, manual);

	// ---- FAQ ----
	setSectionName(faq, "F.A.Q");
	fillSection(contentDict.Faq, faq);

	// ---- Dev ----
	setSectionName(dev, "Dev");
	fillSection(contentDict.Dev, dev);

	// ---- Other (optional) ----
	//console.log(other.parentNode);
	if(other && contentDict.Other)
	{
		setSectionName(other, contentDict.Other.Title);
		fillSection(contentDict.Other.Content, other);
	}
	else if (other) //remove the useless section
	{
		other.parentNode.removeChild(other);
	}
}

function setSectionName(section, header)
{
	let sectionHeader = section.getElementsByClassName("title")[0];
	if(!sectionHeader) return;
	sectionHeader.textContent = header;
}

function fillSection(sectionContent, sectionRootDiv)
{
	let sectionTextContainer = sectionRootDiv.getElementsByClassName("inner")[0];

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
		//TODO : if missing section, add it
		for (index in sectionContent)
		{
			currentType = sectionContent[index].Type;

			if (currentType != lastType )
			{
				//Open new parent Div
				switch (currentType)
				{					
					case 'Fiche':
						let fichesContainer = document.createElement('div');
						fichesContainer.className = "cards-drawer";
						sectionTextContainer.appendChild(fichesContainer);
						currentSubContainer = fichesContainer;
						break;
					case 'Table':
						let table =document.createElement('div');
						table.className = "features";
						sectionTextContainer.appendChild(table);
						currentSubContainer = table;
						break;
					default :
						currentSubContainer = null;
						break;
				}
			}
			//Add the content
			switch(currentType)
			{
				case 'SectionName':
					setSectionName(sectionRootDiv, sectionContent[index].Value);
					break;

				case 'Header':

					let header = document.createElement('h3');
					header.textContent = sectionContent[index].Value;
					sectionTextContainer.appendChild(header);
					break;

				case 'Text':
					let paragraph = document.createElement('p');
					paragraph.textContent = sectionContent[index].Value;
					sectionTextContainer.appendChild(paragraph);
					break;

				case 'List':
					let listContainer = document.createElement('ul');
					sectionTextContainer.appendChild(listContainer);
					for (ligne in sectionContent[index].Value)  //ligne is an index
					{
						let ligneContainer = document.createElement('li');
						ligneContainer.innerHTML = sectionContent[index].Value[ligne];
						listContainer.appendChild(ligneContainer);
					}
					break;

				case 'Fiche':  //[Encars, header, text, link]
					let fiche = document.createElement('div');
					fiche.className = "tool-card";
					currentSubContainer.appendChild(fiche);
					if(sectionContent[index].Value.length >= 4)  //Meaning we have a link
					{
						let link = document.createElement('a');
						link.href = sectionContent[index].Value[3]; //Start counting at 0 -> fourth element
						fiche.appendChild(link);
						fiche = link; //Allow to continue without needing if/else
					}

					let icon = document.createElement('div');
					icon.className = "text-icon";
					iconTitle = document.createElement('h1');
					iconTitle.textContent = sectionContent[index].Value[0];
					icon.appendChild(iconTitle);
					fiche.appendChild(icon);

					let nameFiche = document.createElement('h3');
					nameFiche.textContent = sectionContent[index].Value[1];
					fiche.appendChild(nameFiche);

					let descriptionFiche = document.createElement('p');
					descriptionFiche.textContent = sectionContent[index].Value[2];
					fiche.appendChild(descriptionFiche);			
					break;

				case 'Table':

					let featuresList = document.createElement('div');
					featuresList.className = "feature-list";
					currentSubContainer.appendChild(featuresList);

					let mainRow = document.createElement('div');
					mainRow.className = "row";
					featuresList.appendChild(mainRow);
					
					let cellCounter = 0;

					//Loop over table cells
					for (let cellIndex in sectionContent[index].Value)
					{
						cellCounter++;
						let currentTooltipDiv = null;
						let currentCellValues = sectionContent[index].Value[cellIndex];
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
						titleElement.textContent = currentCellValues['Title'];
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
						console.log(sectionContent[index].Value[cellIndex])
						for (let contentIndex in currentCellValues['Content'])
						{
							let currentContent = currentCellValues['Content'][contentIndex];
							
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
							sectionDivCell.className += " section-hyperlink";
							
							//Hyperlink on same page
							if ($(sectionContent[cellIndex]['Hyperlink']).length > 0)
							{
								sectionDivCell.addEventListener("click", smoothScrollEventHandler.bind(event, sectionContent[cellIndex]['Hyperlink']), false);
							}
							else 
							{
								
								let parsedHyperlink = sectionContent[title][contentIndex].split('.');
								let extension = parsedHyperlink[parsedHyperlink.length - 1];
								
								const containsElement = AVAILABLE_HYPERLINK_EXTENSIONS.some(element => {
									if (extension.includes(element)) {
										return true;
									}
									return false;
								});
								
								if (containsElement) {
									sectionDivCell.addEventListener("click", goToPageEventHandler.bind(event, sectionContent[title][contentIndex]), false);
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
					//Image(s) container
					let imageGrpContainer = document.createElement('div');
					sectionTextContainer.appendChild(imageGrpContainer);
					
					//If a size has been provided
					let imageSize = sectionContent[index].Value.Size ? sectionContent[index].Value.Size : null;

					//Either an array or a single string of image paths
					let sectionImagePathValue = sectionContent[index].Value.Path ? sectionContent[index].Value.Path : sectionContent[index].Value;
					
					if(Array.isArray(sectionImagePathValue))
					{
						let maxImagePerLine = sectionContent[index].Value['MaxColumn'] ? Math.min(sectionImagePathValue.length, sectionContent[index].Value['MaxColumn']) : sectionImagePathValue.length;
						imageGrpContainer.className = "images-hori-container";
						
						//#region Setup images in grid or line depending on size
						if(window.innerWidth > 980)
						{
							$(imageGrpContainer).css("grid-template-columns","repeat(" + maxImagePerLine + ", 1fr)");
						}
						else
						{
							$(imageGrpContainer).css("grid-template-columns","repeat(1, 1fr)");
						}
						window.addEventListener("resize", 
						function(){ 
							if(window.innerWidth < 980)
							{
								$(imageGrpContainer).css("grid-template-columns","repeat(1, 1fr)");
							}
							else{
								$(imageGrpContainer).css("grid-template-columns","repeat(" + maxImagePerLine + ", 1fr)");
							}
					}, false);
					//#endregion
						
					for(let key in sectionImagePathValue)
						{
							let imagePath = "images/" + sectionImagePathValue[key];
							createSourceElement(imageGrpContainer, 'img', imagePath, 'image-info', imageSize)
						}
					}
					else{
						imageGrpContainer.className = "image-single-container";
						let imagePath = "images/" + sectionImagePathValue;
						createSourceElement(imageGrpContainer, 'img', imagePath,'image-info', imageSize)
					}
					break;

				case 'Video':
					let videoGrpContainer = document.createElement('div');
					videoGrpContainer.className = "video-single-container";
					sectionTextContainer.appendChild(videoGrpContainer);
					let videoSize = sectionContent[index].Value.Size ? sectionContent[index].Value.Size : null;
					let sectionVideoPathValue = sectionContent[index].Value.Path ? sectionContent[index].Value.Path : sectionContent[index].Value;
					
					let videoPath = sectionVideoPathValue;	
					//Is it a youtube or video path ?
					if(matchYoutubeUrl(sectionVideoPathValue) || matchVimeoURL(sectionVideoPathValue))
					{
						//createSourceElement(videoGrpContainer, 'iframe', videoPath, 'video-info', videoSize, {"allow" : "autoplay; fullscreen; picture-in-picture", "frameborder": "0"});
						createSourceElement(videoGrpContainer, 'iframe', videoPath, 'video-info', videoSize, {"allow" : "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share", "frameborder": "0", "referrerpolicy" : "strict-origin-when-cross-origin", "allowfullscreen" : "true"});
					}
					//Or it's a local file
					else
					{
						videoPath = "videos/" + videoPath;
						let videoExtension = sectionVideoPathValue.split('.')[1];

						let videoElement = createSourceElement(videoGrpContainer, 'video', videoPath, 'video-info', videoSize, {"type" : "video/" + videoExtension});
						videoElement.setAttribute('controls',true);
					}
					
					break;
			}
			
			lastType = sectionContent[index].Type;
		}
	}
}

//Create simple image in parent
function createSourceElement(parent, type, src, className, size, attributes = {})
{
	let element = document.createElement(type);

	if(size != null)
	{
		element.style.height = size.Height;
		element.style.width = size.Width;
	}

	element.className = className;
	element.src = src;

	for(let key in attributes){
		element.setAttribute(key, attributes[key]);
	}

	parent.appendChild(element);
	return element;
}

var slideElementEventHandler = function(element, attributes, event)
{
	gsap.to(element, attributes)
}

var goToPageEventHandler = function(url, event){
	window.location.href = url;
}

var smoothScrollEventHandler = function(anchor, event){
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

function matchYoutubeUrl(url) {
    var p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    return p.test(url);
}

function matchVimeoURL(url) {
	var p = /(http|https)?:\/\/(www\.|player\.)?vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|video\/|)(\d+)(?:|\/\?)/;
	return p.test(url);
}

function askContent(sourceJson){
	fillPage(sourceJson);
}