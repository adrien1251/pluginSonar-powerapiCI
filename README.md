# Powerapi Sonar Plugin

Ce projet est un plugin sonar pour afficher l'énergie de votre projet avec un historique. Le plugin peut vous permettre de détecter une hausse énergétique de votre projet et ainsi pouvoir le corriger rapidement. 

# Que fait ce plugin

1. Affiche l'énergie totale de tous les tests de votre projet.
2. Affiche l'énergie totale de chaque classe de test, ainsi que chaque méthode de test.
3. Vous pouvez filtrer entre chaque build / chaque test de votre projet. 

# Utilisation

Il faut tout d'abord scanner votre projet avec maven et le plugin **[powerapi maven plugin](https://github.com/adrien1251/powerapiMavenPlugin)** pour ensuite vous rendre dans votre projet sur sonar, puis consulter la page powerapi stat. 
