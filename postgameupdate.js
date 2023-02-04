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

	if (inst.req.body.suvivor === undefined ||
		inst.req.body.suvivor === '' ||
		inst.req.body.suvivor === null)
	{
		console.log("Suvivor Required!");
		inst.res.json({"res":"error","error":"Suvivor Required!"});
		inst.res.end();
		return;
	}

	var suvivors = JSON.parse(inst.req.body.suvivor);
	console.log(suvivors);
	if (suvivors.length < 1)
	{
		console.log("Survivor Less Than 1");
		inst.res.json({"res":"error","error":"Survivor Less Than 1"});
		inst.res.end();
		return;
	}

	let sql = "";
	suvivors.forEach(function(ele){
		sql += `UPDATE gametransaction set hp='${ele.hp}' where gameid='${gameid}' and word='${ele.word}';`;
	});

	inst.con.query(sql,[inst.req.body.id],function(err, result, fields)
	{
		if (err || result.length === 0)
		{
			console.log(err);
			inst.res.json({"res":"error", "error":err});
			inst.res.end();
			return;
		}

		inst.res.json({"res":"success"});
		inst.res.end();
	});
}
