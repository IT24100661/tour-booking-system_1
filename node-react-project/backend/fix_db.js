const sequelize = require('./src/config/database');

async function fix() {
    try {
        console.log("Fixing Users table...");
        await sequelize.query("ALTER TABLE Users DROP INDEX email_47;");
        await sequelize.query("ALTER TABLE Users DROP INDEX email_46;");
        await sequelize.query("ALTER TABLE Users DROP INDEX email_45;");
        await sequelize.query("ALTER TABLE Users DROP INDEX email_44;");
        await sequelize.query("ALTER TABLE Users DROP INDEX email_43;");
        await sequelize.query("ALTER TABLE Users DROP INDEX email_42;");
        await sequelize.query("ALTER TABLE Users DROP INDEX email_41;");
        await sequelize.query("ALTER TABLE Users DROP INDEX email_40;");
        await sequelize.query("ALTER TABLE Users DROP INDEX email_39;");
        await sequelize.query("ALTER TABLE Users DROP INDEX email_38;");
        await sequelize.query("ALTER TABLE Users DROP INDEX email_37;");
        await sequelize.query("ALTER TABLE Users DROP INDEX email_36;");
        console.log("Fixed.");
    } catch(err) {
        console.error(err);
    } finally {
        await sequelize.close();
    }
}
fix();
