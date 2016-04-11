# Form-based authentication with `express`, `knex`, `postgres`, `bcrypt`

Application Setup
--

To run the app:

  1. Create a `.env` file with a random cookie secret:

  ```sh
  echo SECRET=$(node -e "require('crypto').randomBytes(48, function(ex, buf) { console.log(buf.toString('hex')) });") >> .env
  ```

  3. Install `npm` dependencies and create the `psql` database:

  ```sh
  npm install
  createdb passport_knex
  ```

  4. Run the `knex` migration (located in the migrations folder) to create the tables on the database:

  ```sh
  knex migrate:latest
  ```

  5. Start the app:

  ```sh
  npm start
  ```

The app is hosted on port 3000: [http://localhost:3000/](http://localhost:3000/)

## Bcrypt Hashing & Salt
The modular crypt format for bcrypt consists of

* `$2$`, `$2a$` or `$2y$` identifying the hashing algorithm and format,
* a two digit value denoting the cost parameter, followed by `$`
* a 53 characters long base-64-encoded value (they use the alphabet `.`, `/`, `0`–`9`, `A`–`Z`, `a`–`z` that is different to the [standard Base 64 Encoding](http://tools.ietf.org/html/rfc4648#section-4) alphabet) consisting of:
  * 22 characters of salt (effectively only 128 bits of the 132 decoded bits)
  * 31 characters of encrypted output (effectively only 184 bits of the 186 decoded bits)

Thus the total length is 59 or 60 bytes respectively.

Examples:

```js
let hash = bcrypt.hashSync('password', 10);
 // '$2a$10$VqeqkeCsxlKfRefRSNZXf.WH5o52XyO3f4wZYAuVd8yGSoZamiT9u'

bcrypt.compareSync('password', hash);
 // true

bcrypt.compareSync('wRoNgPaSsWoRd', hash);
 // false
```

The number `10` in the `hashSync` example above referes to the number of cycles used to generate the salt. The larger this number, the longer it takes to create the salt, which in theory makes it more secure.

