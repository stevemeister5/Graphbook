import Sequelize from 'sequelize';

const sequelize = new Sequelize('graphbook_dev', 'devuser', '@Imight123', {
    host: 'localhost',
    dialect: 'mysql',
    operatorsAliases: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
});
