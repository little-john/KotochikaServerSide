exports.Execute = (inst) =>
{
	if (inst.req.body.gameid === undefined ||
		inst.req.body.gameid === '' ||
		inst.req.body.gameid === null)
	{
		console.log("GameID Required!");
		inst.res.json({"res":"error","error":"GameID Required!"});
		inst.res.end();
		return;
	}

	if (inst.req.body.guid === undefined ||
		inst.req.body.guid === '' ||
		inst.req.body.guid === null)
	{
		console.log("UserID Required!");
		inst.res.json({"res":"error","error":"UserID Required!"});
		inst.res.end();
		return;
	}

	if (inst.req.body.word === undefined ||
		inst.req.body.word === '' ||
		inst.req.body.word === null)
	{
		console.log("Bet Word Required!");
		inst.res.json({"res":"error","error":"Bet Word Required!"});
		inst.res.end();
		return;
	}

	let round = 1;

	const betCheckSql = "SELECT acceptbet,round from gamemaster where gameid=?";
	inst.con.query(betCheckSql,[inst.req.body.gameid],function(err, result, fields)
	{
		if (err || result.length === 0)
		{
			console.log(err);
			inst.res.json({"res":"error", "error":"GameID not exists!"});
			inst.res.end();
			return;
		}

		if (result[0].acceptbet === 0)
		{
			console.log("Bet Not Acceptable");
			inst.res.json({"res":"error", "error":"Bet Not Acceptable!"});
			inst.res.end();
			return;
		}

		round = result[0].round;

		const sessSQL = "SELECT bet,word1,word2,word3 from gamesession where gameid=? and guid=?;";
		inst.con.query(sessSQL,[inst.req.body.gameid,inst.req.body.guid],function(err, result, fields)
		{
			if (err || result.length === 0)
			{
				console.log(err);
				inst.res.json({"res":"error", "error":"UserID not exists!"});
				inst.res.end();
				return;
			}

			console.log(result);
			var userData = result[0];
			if (userData.bet <= 0)
			{
				console.log("Bet Not Left");
				inst.res.json({"res":"error", "error":"Bet Not Left"});
				inst.res.end();
				return;
			}

			var betWord = inst.req.body.word;
			if (betWord === userData.word1 ||
				betWord === userData.word2 ||
				betWord === userData.word3)
			{
				console.log(err);
				inst.res.json({"res":"error", "error":"Already Bet!"});
				inst.res.end();
				return;
			}

			// WORD IS BETABLE
			userData.bet--;
			if (userData.word1 === '-')
			{
				userData.word1 = betWord;
			}
			else if (userData.word2 === '-')
			{
				userData.word2 = betWord;	
			}
			else
			{
				userData.word3 = betWord;
			}

			let updateSQL = `UPDATE gamesession set bet='${userData.bet}',word1='${userData.word1}',word2='${userData.word2}',word3='${userData.word3}' where gameid='${inst.req.body.gameid}' and guid='${inst.req.body.guid}';`;
			updateSQL += `SELECT word,hp from gametransaction where gameid='${inst.req.body.gameid}' order by hp desc;`;
			inst.con.query(updateSQL,function(err, result, fields)
			{
				if (err)
				{
					console.log(err);
					inst.res.json({"res":"error", "error":err});
					inst.res.end();
					return;
				}

				var survivor = result[1].map(function(value){
					return {"word":value.word,"hp":value.hp};
				});

				console.log(result);
			
				inst.res.json
				(
					{
			        "res":"success",
			        "betleft":userData.bet,
			        "round":round,
			        "history":[userData.word1,userData.word2,userData.word3],
			        "survivor":survivor
			    	}
			    );
			    inst.res.end();
			});	
		});
	});
}
