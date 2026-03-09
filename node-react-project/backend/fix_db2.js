const sequelize = require('./src/config/database');

async function getIndexes() {
    try {
        const [results] = await sequelize.query("SHOW INDEXES FROM Users WHERE Key_name LIKE 'email%';");
        console.log(results.map(r => r.Key_name));
        for (const res of results) {
            console.log(`Dropping ${res.Key_name}...`);
            await sequelize.query(`ALTER TABLE Users DROP INDEX ${res.Key_name};`);
        }
    } catch(err) {
        console.error(err);
    } finally {
        await sequelize.close();
    }
}
getIndexes();
