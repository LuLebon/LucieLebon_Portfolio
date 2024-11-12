let Pages = 
	{
   "RealTimeAnim": {
      "Name": "Animation temps réel",
      "Initials": "ATR",
      "DatasFile": "./PagesContent/RealTimeAnim.js",
      "Page": "RealTimeAnim.html",
      "Short": "Création de séries d'animation via les technologies du jeu vidéo.",
      "InNavbar": true
   },
   "VideoGame": {
      "Name": "Jeu Vidéo",
      "Initials": "JV",
      "DatasFile": "./PagesContent/VideoGames.js",
      "Page": "VideoGames.html",
      "Short": "Développeuse sur plusieurs jeux vidéos. Développements orientés moteur.",
      "InNavbar": true
   },
   "VirtualReality": {
      "Name": "Réalité Virtuelle",
      "Initials": "RV",
      "DatasFile": "./PagesContent/VirtualReality.js",
      "Page": "VirtualReality.html",
      "Short": "Développement de plusieurs mini jeux en réalité virtuelle.",
      "InNavbar": true
   },
}

function getPages()
{
	return Pages;
}