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

	var gameid = inst.req.body.gameid;

	const sql = "SELECT * from gamemaster where gameid=?";
	inst.con.query(sql,[gameid],function(err, result, fields)
	{
		if (err || result.length === 0)
		{
			console.log(err);
			inst.res.json({"res":"error", "error":"GameID not exists!"});
			inst.res.end();
			return;
		}

		const trnSQL = "SELECT word,hp from gametransaction where gameid=? order by hp desc;";
		inst.con.query(trnSQL,[inst.req.body.gameid],function(err, result, fields)
		{		
			if (err || result.length === 0)
			{
				console.log(err);
				inst.res.json({"res":"error", "error":"Suvivor not exists!"});
				inst.res.end();
				return;
			}

			var suvivor = result.find((x)=>x.hp>0);
			if (suvivor === undefined || suvivor === null)
			{
				console.log(err);
				inst.res.json({"res":"error", "error":"All are dead!No Winner!"});
				inst.res.end();
			}

			const finalSQL = "UPDATE gameinfo set winner=? where gameid=?;";
			inst.con.query(finalSQL,[suvivor.word, inst.req.body.gameid],function(err, result, fields)
			{		
				if (err || result.length === 0)
				{
					console.log(err);
					inst.res.json({"res":"error", "error":err});
					inst.res.end();
				}
				console.log("Suvivor:"+suvivor);

				inst.res.json({"res":"success"});
				inst.res.end();
			});
		});
	});
}
