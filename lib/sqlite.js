const path = require('path');
const Sequelize = require('sequelize');
const sequelizeCursorPagination = require('sequelize-cursor-pagination');


const sequelize = new Sequelize('gopkg', undefined, undefined, {
    dialect: 'sqlite',
    storage: path.resolve(__dirname, '../dist/data.sqlite'),
    logging: false,
    define: {
        timestamps: false,
        freezeTableName: true
    }
})

const code = {
    type: Sequelize.STRING,
    primaryKey: true
};
const name = Sequelize.STRING;
const fullName = Sequelize.STRING;
const lat = Sequelize.STRING;
const lng = Sequelize.STRING;
const primaryKeyField = 'code';

const Province = sequelize.define('province', {code, name, fullName, lat, lng});
const City = sequelize.define('city', {code, name, fullName, lat, lng});
const Area = sequelize.define('area', {code, name, fullName, lat, lng});

sequelizeCursorPagination({primaryKeyField})(Province);
sequelizeCursorPagination({primaryKeyField})(City);
sequelizeCursorPagination({primaryKeyField})(Area);



Province.hasMany(City);

City.belongsTo(Province);
City.hasMany(Area);

Area.belongsTo(Province);
Area.belongsTo(City);

async function init() {
    try {
        await sequelize.sync()
    } catch(e) {
        console.log(e);
        process.exit(-1)
    }
}

module.exports = {
    init,
    Province,
    City,
    Area
}