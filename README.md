☕ Airbean API – Beställ kaffe med drönarleverans
Ett REST-API byggt med Node.js, Express och SQLite för den påhittade kaffekedjan Airbean. Med API:et kan man se menyn, läsa om företaget, lägga kaffe i en varukorg, skapa konto, beställa som gäst eller inloggad och se sin orderhistorik.

Gjort av: Samira Jama, individuellt projekt i kursen Backend-utveckling.

🧠 Tekniska val
1. Databasen först

Innan jag började koda ritade jag ett ER-diagram över databasen, så att jag visste hur användare, varukorgar, produkter och ordrar hänger ihop.

ER-diagram

https://docs.google.com/document/d/1jlFGdzOxYaTdUoxhgIizYo26AK4-WThGv0t6cV_SWNc/edit?tab=t.0

Två saker jag tänkte på:

Priset sparas på varje orderrad. Om priset i menyn ändras senare visar gamla ordrar fortfarande det kunden betalade.
user_id kan vara tom, så att man kan beställa som gäst utan konto.
2. Koden är uppdelad efter vad den gör

Koden ligger i routes, controllers och middleware i stället för i en enda fil:

routes säger vilken URL som går till vilken funktion
middleware kontrollerar att datan är rätt innan något sparas
controllers läser och sparar i databasen

Det gör att varje fil blir kort och att det är lätt att hitta var något händer.

3. Kontroll av meny och pris

När man lägger något i varukorgen kontrollerar API:et att produkten finns i menyn och att priset stämmer med databasen. Är något fel får man ett tydligt felmeddelande, till exempel "Fel pris för Bryggkaffe, ska vara 39 kr".

4. Säkra id:n och lösenord

Användare, varukorgar och ordrar får slumpade id:n (uuid) som inte går att gissa. Orderhistoriken hämtas med användarens id, inte användarnamnet. Lösenord sparas hashade med bcryptjs, aldrig som vanlig text.

📡 API-endpoints

Metod	Endpoint	Beskrivning
GET	/api/menu	Hela menyn
GET	/api/menu/:id	En produkt
POST	/api/menu	Lägg till produkt
PUT	/api/menu/:id	Ändra produkt
DELETE	/api/menu/:id	Ta bort produkt
GET	/api/about	Om företaget
POST	/api/cart	Skapa varukorg
GET	/api/cart/:cartId	Visa varukorg
POST	/api/cart/:cartId/items	Lägg till produkt i korgen
DELETE	/api/cart/:cartId/items/:id	Ta bort produkt ur korgen
POST	/api/users/signup	Skapa konto
POST	/api/users/login	Logga in
GET	/api/users/:userId/orders	Orderhistorik
POST	/api/orders	Beställ det som ligger i korgen
GET	/api/orders/:orderId	Visa en order

🚀 Köra projektet lokalt
bash
git clone 
cd airbean-api
npm install
npm run dev

Servern startar på http://localhost:3000. Databasen skapas automatiskt och fylls med menyn.

