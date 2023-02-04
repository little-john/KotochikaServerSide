exports.GameResultGet = (req,res,con) =>
{
	if (req.query.gameid === undefined ||
		req.query.gameid === '' ||
		req.query.gameid === null)
	{
		console.log("GameID Required!");
		res.json({"res":"error","error":"GameID Required!"});
		res.end();
		return;
	}

	let sql = "SELECT winner from gameinfo where gameid=?;";
	sql += "SELECT guid,word1,word2,word3 from gamesession where gameid=?;";

	con.query(sql,[req.query.gameid,req.query.gameid],function(err, result, fields)
	{
		if (err)
		{
			console.log("Error:" + err);
			res.json({"res":"error", "error":err});
			res.end();
			return;
		}

		if (result.length === 0)
		{
			console.log("GameID Doesn't Exists");
			res.json({"res":"error", "error":"GameID Doesn't Exists"});
			res.end();
			return;
		}

		var winner = result[0][0].winner;
		var betGUIDS = result[1].filter(x => x.word1 === winner || x.word2 === winner || x.word3 === winner);

		//console.log(result[1]);
		//console.log(betGUIDS);

		var guids = betGUIDS.map(function(value){
			return value.guid;
		});

		//console.log(guids);

		res.json({"res":"success","winner":winner,"guids":guids});
		res.end();
	});
}

