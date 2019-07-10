
const sqlite = require('../lib/sqlite');
const fetch  = require('../lib/fetch').fetch;

async function main() {
    await sqlite.init();
    await fetch()
}
main()