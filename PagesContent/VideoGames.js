let Catego = {
    "Title": "Jeux Video",
    "Sumary": "Entre 2018 et 2019, j'ai travaillé dans deux studios de jeu vidéo : Endroad et Gerwin.",
    "Visual": "images/Fallback.jpg",
    "Manual": [
        {
            "Type" : "SectionName",
            "Value" : "Gerwin"
        },
        {
            "Type": "Header",
            "Value": "Juillet 2019 – Mars 2020"
        },
        {
            "Type": "Text",
            "Value": "Arrivée chez Gerwin pendant le développement de Bravospeed, j’ai travaillé sur le code gameplay et l’intégration des UIs, mais aussi la diminution du poids de l’application et l’intégration des analytics (AB testing, entonnoirs…)."
        },
        {
            "Type": "Text",
            "Value": "Bravospeed étant un jeu de loterie gratuite sur Mobile, une attention toute particulière devait être portée à deux éléments :"
        },
        {
            "Type": "List",
            "Value": ["La responsivité des Uis.","Les connexions à la base de données."]
        }
    ],
    "Faq": [
        {
            "Type" : "SectionName",
            "Value" : "Endroad"
        },
        {
            "Type": "Header",
            "Value": "Mai à Octobre 2018 "
        },
        {
            "Type": "Text",
            "Value": "Chez Endroad, j’ai été développeuse Unity sur leur premier jeu : Fallback."
        },          
        {
            "Type": "Text",
            "Value": "J’étais en charge de l’intégration de l’audio et ais développé plusieurs outils dans ce but. Le principal était un système d’audio matérials : Dans une zone sélectionné, un audio-material va être associé automatiquement à chaque mesh en fonction de sa texture."
        }, 
        {
            "Type" : "Image",
            "Value" : "EndroadAudioSurfaces_Square.PNG"
        },          
        {
            "Type": "Text",
            "Value": "J’ai aussi travaillé sur les Uis (générées via le code). J’ai enrichi la bibliothèque existante et créé les outils de débogage d’UI."
        },            
        {
            "Type": "Text",
            "Value": "Enfin, il a fallut intégrer les analytics (GoogleAnalytics) et ajouter la surcouche Steam."
        },            
        {
            "Type": "Text",
            "Value": "Disponible sur Steam, le jeu à  87 % de reviews positives."
        }, 
        {
            "Type": "Video",
            "Value": "https://www.youtube.com/embed/coFkHtFi28Y"
        },            
    ],
    "Dev": [
        {
            "Type" : "SectionName",
            "Value" : "Zero Games"
        },
        {
            "Type": "Text",
            "Value": "Dans le cadre de mon projet de fin d’études, j’ai travaillé sur un module Unity de météo pour le studio Zero Games Studio."
        },          
        {
            "Type": "Text",
            "Value": "Les événements météos sont gérés via un node editor et un ensemble de shaders."
        },    
        {
            "Type" : "Video",
            "Value" : "https://www.youtube.com/embed/SfbwfLjqabw"
        }
        
    ]
}

function getPageDatas()
{
	return Catego;
}