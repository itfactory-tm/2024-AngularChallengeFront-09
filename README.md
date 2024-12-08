# Laser Llama Frontend

## Beschrijving
De Laser Llama frontend is een Angular-applicatie die deel uitmaakt van het festival plannings- en voorstellingssysteem. Deze applicatie werkt samen met de .NET Core backend en gebruikt Auth0 voor authenticatie.

## Vereisten
- Node.js
- npm
- Git

## Installatie

### Repository Klonen
```bash
git clone https://github.com/itfactory-tm/2024-AngularChallengeFront-09
cd 2024-AngularChallengeFront-09
```

### Afhankelijkheden Installeren
```bash
npm install
```

## Configuratie
Maak een `environment.ts` bestand aan in de `src/environments/` map met de volgende configuratie:

```typescript
export const environment = {
  baseUrl: '{BACKEND_URL}/api',
  auth0Domain: '{YOUR_AUTH0_DOMAIN}',
  auth0ClientId: '{YOUR_AUTH0_CLIENT_ID}',
  auth0Audience: '{YOUR_AUTH0_CLIENT_AUDIENCE}'
};
```

Er zijn twee omgevingsconfiguraties mogelijk:
- `environment.ts`: Productie-instellingen
- `environment.development.ts`: Ontwikkelingsinstellingen

Angular zal automatisch het juiste bestand selecteren op basis van de gebruikte opdracht.

## Ontwikkelen
De applicatie starten in ontwikkelingsmodus:
```bash
ng serve
```
De applicatie is nu beschikbaar op `http://localhost:4200/`

## Testen
Unit tests uitvoeren:
```bash
ng test
```
Dit zal de Karma test runner starten en alle unit tests in het project uitvoeren.

## Bouwen voor Productie
Een productie-build genereren:
```bash
ng build
```
De gebouwde bestanden zullen zich bevinden in de `dist/` map.

### Na de Build: .htaccess Configuratie
Na het bouwen van de applicatie, maak een `.htaccess` bestand aan in de `dist/` map met de volgende inhoud:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine on
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^(.*) /index.html [L]
</IfModule>
```

Dit .htaccess bestand zorgt ervoor dat alle navigatie correct wordt afgehandeld in een Single Page Application (SPA), waardoor directe navigatie naar geneste routes correct werkt.

## Authenticatie
De applicatie gebruikt Auth0 voor authenticatie. Zorg ervoor dat je de juiste Auth0-configuratie hebt ingesteld in je environment-bestand.


## Ondersteuning
Voor vragen of problemen, neem contact op met het ontwikkelteam.
