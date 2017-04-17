# DigitalShootingManager (DSM)
Verwaltungsoberfläche für DSCs, benötigt einen DSC-Gateway.

![Demo](https://raw.githubusercontent.com/DigitalShooting/assets/master/dsm1.png)


## Installation

### Abhängigkeiten
- nodejs (>4)
- npm

### Git
````
# clone and update submodules
git clone --recursiv https://github.com/DigitalShooting/DSM.git
cd DSC

# NPM rebuild
npm rebuild

# configure (more under /docs/config.md)
ls config/

# start
node index.js
````

## Funktionen

### Stände
Verwaltung der Stände:
- Ein/ Ausschalten
- Disziplin/ Part
- Verein/ Schütze
- Manschaft
- Drucken

### Stammdaten
Verwaltung von **Schützen**, **Vereine** und **Mannschaften**.
Ein Schütze kann einem Verein zugeordnet werden.
Mannschaften sind *keinem* Verein zugeordnet, sondern dienen nur als Zuordnung zur Anzahl der Schützen in einer Mannschaft, welche zur Berechnung der Zwischenstände benötigt wird.

### Statistiken
Anzeige einer Historie aller Daten, welche vom DSC-Gateway gesammelt werden. Alte Sessions können auf eine aktive Linie geladen werden.



## Licence
GNU GENERAL PUBLIC LICENSE Version 3
