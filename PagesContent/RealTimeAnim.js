let Tool = {
    "Title": "Animation temps réel",
    "Sumary": "Chez Miam!animation de puis 2020, j'ai travaillé sur leurs deux séries en temps réel : Edmond & Lucy (réalisée sur Unity) et Les Minus (réalisée sur Unreal).",
    "Visual": "images/Miam.png",
    "Manual": [
        {
            "Type" : "SectionName",
            "Value" : "Miam!Studio"
        },
        {
            "Type": "Text",
            "Value": "Après deux passages dans des studios de jeu vidéo je suis entrée chez Miam!Studio, le premier studio français d’animation temps réel. "
        },
        {
            "Type": "Text",
            "Value": "En tant qu’ingénieure en informatique, j’ai mis en place la partie production du pipe de la série Edmond & Lucy réalisée sur Unity. Cette série de 52 épisodes de 11 minutes a été livrée à France Télévision en 2022. Pour cette série j’ai aussi développé sur Unity la boardmachine, outil phare utilisé au quotidien par les storyboarders."
        },
        {
            "Type": "Text",
            "Value": "En prévision de Les Minus, nouvelle série de Miam!Studio réalisée sur Unreal et destinée à Canal+, j’ai été promue responsable R&D. Pour cette seconde série, j’ai préparé en autonomie la liste des développements à réaliser pour compléter le pipe multi-productions commencé sur Edmond & Lucy. De plus, j’ai développé les outils de Layout puis, après l’arrivée des artistes, une partie des outils de Lighting. "
        },
        {
            "Type": "Text",
            "Value": "Afin de répondre au mieux aux besoins spécifiques d’un pipe multi-productions, j’ai développé sur Unity et Unreal mais aussi en python et en batch. Tout cela en gérant en parallèle l’équipe de développement et ses plannings. "
        },
        {
            "Type": "Text",
            "Value": "Le travail technique réalisé sur ces deux séries a été présenté au public lors de plusieurs conférences organisées par Unreal et devant des étudiants en études supérieures (filières ATI de l’université de Paris et Filière JIN de l’ENSIIE & TSP)."
        },
        {
            "Type" : "Video",
            "Value" : "https://www.youtube.com/embed/I-jcYwezGPs"
        },
    ],
    "Faq": [
        {
            "Type" : "SectionName",
            "Value" : "Edmond & Lucy"
        },
        {
            "Type": "Header",
            "Value": "Avril 2020 – 2023 "
        },
        {
            "Type": "Text",
            "Value": "Pour Edmond & Lucy, première série en temps réel de Miam animation, j’ai travaillé principalement sur deux axes : La création d’outils de prod pour dégager du temps à l’équipe de production et la boardmachine, un outil destiné aux boarders."
        },
        {
            "Type": "Image",
            "Value": "Edmond.png"
        },
        {
            "Type": "Header",
            "Value": "Outils de production (Python)"
        },
        {
            "Type": "Text",
            "Value": "Les outils de production ont permis une semi automatisation de : "
        },
        {
            "Type" : "List",
            "Value" : ["La création des Breakdown List (découpage et casting d’un épisode plan par plan) et la sortie des éléments d’animatic.", "L’envoi des notes de retakes sur Shotgrid.", "La génération d’épisodes sur Shotgrid."]
        },
        {
            "Type": "Text",
            "Value": "A titre d’exemple, grâce à l’outil de création de breakdown, la tâche est passée de 3 jours par semaine à 1."
        },
        {
            "Type": "Header",
            "Value": "BoardMachine (Unity)"
        },
        {
            "Type": "Text",
            "Value": "La Boardmachine, elle, permet aux boarders de créer des mises en scène 3D avec les différents assets de la série (décors, personnages…). Développé sur Unity, cet outil est fournit aux boarders sous forme d’exécutable. Les assets sont chargés sous forme de bundles. Couplé à un module de contrôle des accès, cela permet aux boarders en télétravail d’utiliser l’outil sur leur propre machine, sans connexion aux infrastructures miam. Cet outil a permis d’améliorer la qualité des boards et de réduire le nombre de retakes. Équipée du module de livelink, la boardmachine a également été utilisée par notre prestataire Jungler à l’étape de l’animation."
        },
        {
            "Type" : "Video",
            "Value" : "https://www.youtube.com/embed/9EUOyBUL5KM"
        },
        {
            "Type": "Text",
            "Value": "En complément de la BoardMachine, il existe un projet de génération des bundles. Ce projets contient plusieurs éléments : "
        },
        {
            "Type" : "List",
            "Value" : ["Import d'assets au format GlTF (depuis Blender, Unreal ou Maya)","Nettoyage automatisé des assets (suppression des éléments de rigs, ajout de colliders...) ", "Génération automatisée des bundles et éléments associés."]
        },
        {
            "Type": "Header",
            "Value": "Librairies Miam (Unity)"
        },
        {
            "Type": "Text",
            "Value": "Post livraison de la série une étape de récupération, optimisation et réorganisation du code en librairies Unity a également été effectuée."
        },
        {
            "Type": "Header",
            "Value": "Voyage de La Chose (Unity)"
        },
        {
            "Type": "Text",
            "Value": "Le Voyage de La Chose est un platformer réalisé sur Unity et dans lequel on incarne la Chose, un des personnage de Edmond et Lucy. Le jeu sortira sur Android début 2025."
        },
        {
            "Type": "Image",
            "Value": "VoyageChose.png"
        },
        {
            "Type": "Text",
            "Value": "Pour ce jeu j’ai travaillé sur : "
        },
        {
            "Type": "List",
            "Value": ["L’optimisation des performances.", "La réduction du poids de l’application."]
        }
    ],
    "Dev": [
        {
            "Type" : "SectionName",
            "Value" : "Les Minus"
        },
        {
            "Type": "Header",
            "Value": "Mai 2023 – Aujourd’hui"
        },
        {
            "Type": "Text",
            "Value": "La seconde série en temps réel de Miam, Les Minus, est réalisée sur Unreal. La préparation de son pipe a été entamée dès la fin d’Edmond et Lucy. Un travail de rétro-analyse du pipe Edmond (appuyé par le post mortem) a été effectué. Cela nous a permis de déterminer les outils à développer sur Unreal avant l’arrivée des équipes."
        },
        {
            "Type": "Image",
            "Value": "Minus.png"
        },
        {
            "Type": "Text",
            "Value": "En pratique cela a consisté en : "
        },       
        {
            "Type": "List",
            "Value": ["La sélection du gestionnaire de version (Perforce), sa documentation.","La détermination de l’organisation des projets Unreals.","La création des outils de Layout (Unreal-Blueprints & Batch).","La supervision des outils d’imports d’assets dans Unreal.","La mise en place de l’outil de suivis des développements (Jira)."]
        },        
        {
            "Type": "Text",
            "Value": "Suite à l’arrivée des artistes a commencé une seconde vague de développements pour : "
        },        
        {
            "Type": "List",
            "Value": ["Enrichir les outils de layout (Unreal-Blueprints).","Créer une partie des outils de lighting (Unreal-Blueprints)."]
        },
        {
            "Type": "Text",
            "Value": "A noter que grâce à une architecture rigoureuse lors du développement des outils de production fait pour Edmond et Lucy, ceux-ci ont pu être réutilisés sur Les Minus après ajout d’une console de sélection de prod. De même pour la board machine."
        },
        {
            "Type": "Text",
            "Value": "De même, certains outils proposés par le développement sur Edmond et Lucy ont vu leur utilisation être étendue à plusieurs départements sur Les Minus."
        }
    ]
}

function getPageDatas()
{
	return Tool;
}