# Application de messagerie en temps réel

Cette application permet la communication en temps réel d'un client avec un membre du service client via Websockets.
Elle est construite avec Angular pour le front-end et Spring pour le back-end.

## Fonctionnalités

- Envoi et réception de messages en temps réel
- Différentiation des rôles client et service client
- Interface responsive et minimaliste

## Technologies utilisées
### Front-end

- Angular (TypeScript, HTML, CSS)
- RxJS pour la gestion de Websockets

### Back-end

- Spring Boot
- Stomp et Websockets

## Installation

1. Cloner le repository

> git clone https://github.com/areceveur/PoC_projet13.git
>
> cd PoC_Projet13

2. Back-end

Assurez vous d'avoir Java17 et Maven installés.

Configurez la base de  à partir du fichier back/scr/main/resources/script.sql

Lancez le back-end :

> mvn: spring-boot:run

3. Front-end

Assurez-vous d'avoir Node.js et Angular CLI installés.

Installez les dépendances du projet :

> cd front
>
> npm install

Lancez le serveur de déveleppement

> ng serve

4. Accéder à l'application

- Front-end : http://localhost:4200
- Back-end : http://localhost:8080