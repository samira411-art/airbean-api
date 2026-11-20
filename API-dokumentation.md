## API-dokumentation

Servern körs på `http://localhost:3000`. Alla svar är JSON och har `"success": true` eller `"success": false`.

Vid fel ser svaret alltid ut så här:
```json
{ "success": false, "error": "Felmeddelande" }
```

Gäller alla endpoints:

| Kod | Beskrivning |
|-----|-------------|
| 400 | Body är inte giltig JSON. |
| 404 | Adressen finns inte. |
| 500 | Något gick fel på servern. |

---

## Meny

### `GET /api/menu`

Hämtar hela menyn.

**Response `200`:**
```json
{
  "success": true,
  "menu": [
    { "id": 1, "title": "Bryggkaffe", "desc": "Bryggd på månadens bönor.", "price": 39 },
    { "id": 2, "title": "Caffè Doppio", "desc": "Bryggd på månadens bönor.", "price": 49 }
  ]
}
```

---

### `GET /api/menu/:id`

Hämtar en produkt.

**URL-parametrar:**
* `id` (heltal, obligatorisk): Produktens id.

**Response `200`:**
```json
{
  "success": true,
  "product": { "id": 1, "title": "Bryggkaffe", "desc": "Bryggd på månadens bönor.", "price": 39 }
}
```

**Felkoder:**

| Kod | Beskrivning |
|-----|-------------|
| 400 | `id` är inte ett positivt heltal. |
| 404 | Produkten finns inte. |

---

### `POST /api/menu`

Lägger till en produkt i menyn.

**Request body:**
```json
{
  "title": "Flat White",
  "desc": "Espresso med mjölk.",
  "price": 52
}
```

**Response `201`:**
```json
{
  "success": true,
  "product": { "id": 7, "title": "Flat White", "desc": "Espresso med mjölk.", "price": 52 }
}
```

**Felkoder:**

| Kod | Beskrivning |
|-----|-------------|
| 400 | `title` eller `desc` saknas eller är tom. |
| 400 | `price` är inte ett positivt heltal. |
| 409 | Det finns redan en produkt med samma namn. |

---

### `PUT /api/menu/:id`

Ändrar en produkt. Alla fält måste skickas med.

**URL-parametrar:**
* `id` (heltal, obligatorisk): Produktens id.

**Request body:**
```json
{
  "title": "Flat White",
  "desc": "Dubbel espresso med mjölk.",
  "price": 55
}
```

**Response `200`:**
```json
{
  "success": true,
  "product": { "id": 7, "title": "Flat White", "desc": "Dubbel espresso med mjölk.", "price": 55 }
}
```

**Felkoder:**

| Kod | Beskrivning |
|-----|-------------|
| 400 | `id` är inte ett positivt heltal. |
| 400 | `title`, `desc` eller `price` har fel format. |
| 404 | Produkten finns inte. |
| 409 | En annan produkt har redan samma namn. |

---

### `DELETE /api/menu/:id`

Tar bort en produkt. Produkten tas också bort från alla varukorgar.

**URL-parametrar:**
* `id` (heltal, obligatorisk): Produktens id.

**Response `200`:**
```json
{
  "success": true,
  "deleted": { "id": 7, "title": "Flat White", "desc": "Dubbel espresso med mjölk.", "price": 55 }
}
```

**Felkoder:**

| Kod | Beskrivning |
|-----|-------------|
| 400 | `id` är inte ett positivt heltal. |
| 404 | Produkten finns inte. |
| 409 | Produkten finns i en order och kan inte tas bort. Annars skulle orderhistoriken gå sönder. |

---

## Om företaget

### `GET /api/about`

Hämtar information om Airbean.

**Response `200`:**
```json
{
  "success": true,
  "about": {
    "title": "Vårt kaffe",
    "description": "Airbean levererar nybryggt kaffe direkt till dig med drönare. Vi köper våra bönor från små odlare i Etiopien och Colombia och rostar dem själva i små omgångar."
  }
}
```

---

## Användare

### `POST /api/users/signup`

Skapar ett nytt konto. Användaren får ett slumpat id (uuid). Lösenordet sparas hashat och skickas aldrig tillbaka.

**Request body:**
```json
{
  "username": "samira",
  "password": "hemligt123"
}
```

**Response `201`:**
```json
{
  "success": true,
  "user": {
    "userId": "bd5d0e42-f1c8-44aa-983e-c03904313032",
    "username": "samira"
  }
}
```

**Felkoder:**

| Kod | Beskrivning |
|-----|-------------|
| 400 | `username` saknas eller är kortare än 3 tecken. |
| 400 | `password` saknas eller är kortare än 6 tecken. |
| 409 | Användarnamnet är redan taget. |

---

### `POST /api/users/login`

Loggar in en användare.

**Request body:**
```json
{
  "username": "samira",
  "password": "hemligt123"
}
```

**Response `200`:**
```json
{
  "success": true,
  "user": {
    "userId": "bd5d0e42-f1c8-44aa-983e-c03904313032",
    "username": "samira"
  }
}
```

**Felkoder:**

| Kod | Beskrivning |
|-----|-------------|
| 400 | `username` eller `password` har fel format. |
| 401 | Fel användarnamn eller lösenord. |

---

### `GET /api/users/:userId/orders`

Hämtar orderhistorik för en användare. Nyaste ordern visas först.

**URL-parametrar:**
* `userId` (uuid, obligatorisk): Användarens id.

**Response `200`:**
```json
{
  "success": true,
  "orders": [
    {
      "orderId": "d59706b8-a20b-40dc-b598-fa996c01365f",
      "userId": "bd5d0e42-f1c8-44aa-983e-c03904313032",
      "items": [
        { "id": 1, "title": "Bryggkaffe", "price": 39, "quantity": 2 }
      ],
      "totalPrice": 78,
      "createdAt": "2026-11-20 09:02:04",
      "eta": "2026-11-20 09:22:04"
    }
  ]
}
```

**Felkoder:**

| Kod | Beskrivning |
|-----|-------------|
| 400 | `userId` är inte ett giltigt uuid. |
| 404 | Användaren finns inte. |

---

## Varukorg

### `POST /api/cart`

Skapar en tom varukorg. Skicka med `userId` om användaren är inloggad. En gäst skickar en tom body.

**Request body (inloggad):**
```json
{
  "userId": "bd5d0e42-f1c8-44aa-983e-c03904313032"
}
```

**Response `201`:**
```json
{
  "success": true,
  "cart": {
    "cartId": "68465723-6139-47cb-b97c-e275339ddcbe",
    "userId": "bd5d0e42-f1c8-44aa-983e-c03904313032",
    "items": [],
    "total": 0
  }
}
```
*Notera: för en gäst är `userId` `null`.*

**Felkoder:**

| Kod | Beskrivning |
|-----|-------------|
| 400 | `userId` är inte ett giltigt uuid. |
| 400 | Användaren finns inte. |

---

### `GET /api/cart/:cartId`

Visar varukorgen med produkter och totalsumma.

**URL-parametrar:**
* `cartId` (uuid, obligatorisk): Varukorgens id.

**Response `200`:**
```json
{
  "success": true,
  "cart": {
    "cartId": "68465723-6139-47cb-b97c-e275339ddcbe",
    "userId": "bd5d0e42-f1c8-44aa-983e-c03904313032",
    "items": [
      { "id": 1, "title": "Bryggkaffe", "price": 39, "quantity": 2 },
      { "id": 6, "title": "Cortado", "price": 39, "quantity": 1 }
    ],
    "total": 117
  }
}
```

**Felkoder:**

| Kod | Beskrivning |
|-----|-------------|
| 400 | `cartId` är inte ett giltigt uuid. |
| 404 | Varukorgen finns inte. |

---

### `POST /api/cart/:cartId/items`

Lägger till en produkt i varukorgen. Om produkten redan finns i korgen ökar antalet.

Produkten måste finnas i menyn och priset måste stämma med menyn.

**URL-parametrar:**
* `cartId` (uuid, obligatorisk): Varukorgens id.

**Request body:**
```json
{
  "id": 1,
  "price": 39,
  "quantity": 2
}
```

**Response `200`:**
```json
{
  "success": true,
  "cart": {
    "cartId": "68465723-6139-47cb-b97c-e275339ddcbe",
    "userId": "bd5d0e42-f1c8-44aa-983e-c03904313032",
    "items": [
      { "id": 1, "title": "Bryggkaffe", "price": 39, "quantity": 2 }
    ],
    "total": 78
  }
}
```

**Felkoder:**

| Kod | Beskrivning |
|-----|-------------|
| 400 | `cartId` är inte ett giltigt uuid. |
| 400 | `id` är inte ett heltal eller `price` är inte ett tal. |
| 400 | `quantity` är inte ett heltal mellan 1 och 20. |
| 400 | Produkten finns inte i menyn. |
| 400 | Fel pris, t.ex. `"Fel pris för Bryggkaffe, ska vara 39 kr"`. |
| 404 | Varukorgen finns inte. |

---

### `DELETE /api/cart/:cartId/items/:id`

Tar bort en produkt ur varukorgen.

**URL-parametrar:**
* `cartId` (uuid, obligatorisk): Varukorgens id.
* `id` (heltal, obligatorisk): Produktens id.

**Response `200`:**
```json
{
  "success": true,
  "cart": {
    "cartId": "68465723-6139-47cb-b97c-e275339ddcbe",
    "userId": "bd5d0e42-f1c8-44aa-983e-c03904313032",
    "items": [
      { "id": 1, "title": "Bryggkaffe", "price": 39, "quantity": 2 }
    ],
    "total": 78
  }
}
```

**Felkoder:**

| Kod | Beskrivning |
|-----|-------------|
| 400 | `cartId` eller `id` har fel format. |
| 404 | Varukorgen finns inte. |
| 404 | Produkten finns inte i varukorgen. |

---

## Ordrar

### `POST /api/orders`

Gör en beställning av allt som ligger i varukorgen. Priset räknas ut på servern från menyn. Varukorgen tas bort efteråt.

Om korgen skapades med ett `userId` kopplas ordern till användaren, annars blir det en gästorder.

**Request body:**
```json
{
  "cartId": "68465723-6139-47cb-b97c-e275339ddcbe"
}
```

**Response `201`:**
```json
{
  "success": true,
  "order": {
    "orderId": "d59706b8-a20b-40dc-b598-fa996c01365f",
    "userId": "bd5d0e42-f1c8-44aa-983e-c03904313032",
    "items": [
      { "id": 1, "title": "Bryggkaffe", "price": 39, "quantity": 2 }
    ],
    "totalPrice": 78,
    "createdAt": "2026-11-20 09:02:04",
    "eta": "2026-11-20 09:22:04"
  }
}
```
*Notera: `eta` är tiden då kaffet beräknas levereras, 20 minuter efter beställningen. Tiderna är i UTC.*

**Felkoder:**

| Kod | Beskrivning |
|-----|-------------|
| 400 | `cartId` saknas eller är inte ett giltigt uuid. |
| 400 | Varukorgen finns inte. |
| 400 | Varukorgen är tom. |

---

### `GET /api/orders/:orderId`

Visar en order.

**URL-parametrar:**
* `orderId` (uuid, obligatorisk): Orderns id.

**Response `200`:**
```json
{
  "success": true,
  "order": {
    "orderId": "d59706b8-a20b-40dc-b598-fa996c01365f",
    "userId": "bd5d0e42-f1c8-44aa-983e-c03904313032",
    "items": [
      { "id": 1, "title": "Bryggkaffe", "price": 39, "quantity": 2 }
    ],
    "totalPrice": 78,
    "createdAt": "2026-11-20 09:02:04",
    "eta": "2026-11-20 09:22:04"
  }
}
```

**Felkoder:**

| Kod | Beskrivning |
|-----|-------------|
| 400 | `orderId` är inte ett giltigt uuid. |
| 404 | Ordern finns inte. |

---

## WebSockets

Om jag skulle använda WebSockets i projektet skulle det vara för att visa **var beställningen är, i realtid**.

**Hur det fungerar nu**

Mitt API använder REST. Det betyder att appen alltid måste fråga servern. För att se om kaffet är på väg måste appen anropa `GET /api/orders/:orderId` om och om igen, eller så måste användaren ladda om sidan.

**Hur det skulle fungera med WebSockets**

1. När användaren har beställt öppnar appen en WebSocket-anslutning och skickar sitt `orderId`.
2. Anslutningen är öppen hela tiden.
3. När något händer med ordern skickar servern själv ett meddelande till appen, till exempel när kaffet är klart eller när drönaren har lyft.

**Exempel på meddelande från servern:**
```json
{
  "orderId": "d59706b8-a20b-40dc-b598-fa996c01365f",
  "status": "Drönaren har lyft",
  "minutesLeft": 8
}
```

**Mervärde**

* **För användaren:** man ser direkt vad som händer med beställningen och slipper ladda om. Man skulle också kunna följa drönaren på en karta.
* **För servern:** färre onödiga anrop, eftersom appen inte behöver fråga hela tiden.
* **Men:** allt behöver inte WebSockets. Att hämta menyn eller skapa ett konto fungerar bra med vanlig REST.
