const path = require('path');
const fs = require('fs');

var hotelCount, roomCount, rateCount, userCount;

class DBService {
    constructor(db) {
        this.sequelize = db.sequelize;
        this.Hotel = db.Hotel;
        this.Room = db.Room;
        this.User = db.User;
        this.Rate = db.Rate;
    }

    async populate() {
        try {
            const exists = fs.existsSync(path.join(__dirname, '..', 'data', 'queries.json'));
            hotelCount = await this.Hotel.count();
            roomCount = await this.Room.count();
            rateCount = await this.Rate.count();
            userCount = await this.User.count();

            const initialized = () => {
                if (hotelCount > 0 && roomCount > 0 && rateCount > 0) {
                    console.log(hotelCount, roomCount, rateCount, userCount);
                    return true;
                }
                else {
                    console.log(hotelCount, roomCount, rateCount);
                    return false
                }
            }

            const isInitialized = initialized();

            if (exists && !isInitialized) {
                const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'queries.json')));
                const queries = data.queries;
                for (const query of queries) {
                    await this.sequelize.query(query);
                }
            }
            else {
                console.log('Database is already populated with initial data');
                return;
            }
        } catch (error) {
            console.error(error);
        }
    }

}

module.exports = DBService;