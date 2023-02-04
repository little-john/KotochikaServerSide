exports.Execute = (inst) =>
{
	if (inst.req.body.id === undefined ||
		inst.req.body.id === '' ||
		inst.req.body.id === null)
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

	var round = 1;
	var survivor = [];

	const trnSQL = "SELECT word,hp from gametransaction where gameid=? order by hp desc;";
	inst.con.query(trnSQL,[inst.req.body.id],function(err, result, fields)
	{
		if (err || result.length === 0)
		{
			console.log(err);
			inst.res.json({"res":"error", "error":"GameID not exists!"});
			inst.res.end();
			return;
		}

		survivor = result.map(function(value){
			return {"word":value.word,"hp":value.hp};
		});

		const roundGetSql = "SELECT round from gamemaster where gameid=?";
		inst.con.query(roundGetSql,[inst.req.body.id],function(err, result, fields)
		{
			if (err || result.length === 0)
			{
				console.log(err);
				inst.res.json({"res":"error", "error":err});
				inst.res.end();
				return;
			}

			round = result[0].round;
			
			const sessSQL = "SELECT bet,word1,word2,word3 from gamesession where gameid=? and guid=?;";
			inst.con.query(sessSQL,[inst.req.body.id,inst.req.body.guid],function(err, result, fields)
			{
				if (err || result.length === 0)
				{
					console.log(err);
					inst.res.json({"res":"error", "error":"UserID not exists!"});
					inst.res.end();
					return;
				}

				console.log(result);
				
				inst.res.json
				(
					{
			        "res":"success",
			        "betleft":result[0].bet,
			        "round":round,
			        "history":[result[0].word1,result[0].word2,result[0].word3],
			        "survivor":survivor
			    	}
			    );
			    inst.res.end();
			});
		});
	});
}

