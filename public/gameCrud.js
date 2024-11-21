const sqlite3 = require("sqlite3").verbose();
const db = require("./database.js");

// Create new game with all necessary information
async function createGame(gameName, description, leadDesigner, publisher, boxArtUrl, releaseDate, minPlayers, maxPlayers, playTime, age) {
    try {
        const hashedPassword = await encryptPassword(password);
        db.run(
            `
            INSERT OR IGNORE INTO Games (gameName, description, leadDesigner, publisher, boxArtUrl, releaseDate, minPlayers, maxPlayers, playTime, age)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [gameName, description, leadDesigner, publisher, boxArtUrl, releaseDate, minPlayers, maxPlayers, playTime, age],
            function (e) {
                if (e) {
                    console.log(`ERR: Game creation failed. See below:`);
                    console.error(e.message);
                } else {
                    console.log(`Inserted game`);
                }
            }
        );
    } catch (e) {
        console.error(e.message);
    }
}

// Return a game with specified ID
async function readGame(id) {
    return new Promise((resolve, reject) => {
        db.get(`
            SELECT gameName, description, leadDesigner, publisher, boxArtUrl, releaseDate, minPlayers, maxPlayers, playTime, age
            FROM Games
            WHERE userId = ?`, [id], (err, row) => {
            if (err) {
                console.log(`ERR: Game read failed. See below:`);
                console.error(err.message);
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

// Update a column of a game at specified ID with a new value
async function updateGame(id, column, newValue) {
    const query = `UPDATE Games SET ${column} = ? WHERE gameId = ?`;
    db.run(query, [newValue, id], function (err) {
        if (err) {
            console.log(`ERR: Game update failed. See below:`);
            console.error(err.message);
        } else {
            console.log(`Updated game with id ${id}`);
        }
    });
}

// Delete a game at specified ID
function deleteGame(id) {
    db.run(`
        DELETE FROM Games
        WHERE gameId = ?`, [id], function (err) {
        if (err) {
            console.log(`ERR: Game delete failed. See below:`);
            console.error(err.message);
        } else {
            console.log(`Deleted game with id ${id}`);
        }
    });
}