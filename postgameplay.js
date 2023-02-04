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

		var acceptbet = result[0].acceptbet;
		acceptbet = Math.abs(1 - acceptbet);

		var round = result[0].round;
		if (acceptbet === 0)
		{
			console.log("RoundUP:"+round);
			round++;
		}
		else
		{
			console.log("RoundSTART:"+round);
		}

		const updSql = "UPDATE gamemaster set round=?,acceptbet=? where gameid=?";
		inst.con.query(updSql,[round,acceptbet,gameid],function(err, result, fields)
		{
			if (err)
			{
				console.log(err);
				inst.res.json({"res":"error", "error":"err"});
				inst.res.end();
				return;
			}

			inst.res.json({"res":"success", "round":round});
			inst.res.end();
		});
	});
}
