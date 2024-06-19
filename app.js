let express = require("express");
let { open } = require("sqlite");
let sqlite3 = require("sqlite3");

let path = require("path");

let app = express();
app.use(express.json());

let dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

let initializeDB = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () => {
      console.log("Server is running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDB();

app.get("/players/", async (request, response) => {
  let playersQuery1 = `SELECT * 
  FROM cricket_team`;
  let players1 = await db.all(playersQuery1);
  response.send(players1);
});

app.post("/players/", async (request, response) => {
  let { playerName, jerseyNumber, role } = request.body;
  let playersQuery2 = `INSERT INTO 
  cricket_team(player_name, jersey_number, role)
  VALUES(
      '${playerName}',
      '${jerseyNumber}',
      '${role}'
  );`;
  let players2 = await db.run(playersQuery2);
  response.send("Player Added to Team");
});

app.get("/players/:playerId/", async (request, response) => {
  let { playerId } = request.params;
  let playersQuery3 = `SELECT * 
  FROM cricket_team 
  WHERE player_id = ${playerId};`;
  let players3 = await db.get(playersQuery3);
  response.send(players3);
});

app.put("/players/:playerId/", async (request, response) => {
  let { playerName, jerseyNumber, role } = request.body;
  let { playerId } = request.params;
  let playersQuery4 = `UPDATE
      cricket_team
    SET
      player_name ='${playerName}',
      jersey_number = '${jerseyNumber}',
      role= '${role}'
    WHERE
      player_id = ${playerId};`;
  await db.run(playersQuery4);
  response.send("Player Added to Team");
});

//delete player
app.delete("/players/:playerId/", async (request, response) => {
  let { playerId } = request.params;
  let playersQuery5 = `DELETE FROM cricket_team
  WHERE player_id = ${playerId};`;
  await db.run(playersQuery5);
  response.send("Player Removed");
});

module.exports = app;
