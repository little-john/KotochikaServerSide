exports.Execute = (inst) =>
{
	if (inst.req.body.id === undefined ||
		inst.req.body.id === '' ||
		inst.req.body.id === null)
	{
		console.log("GAMEID Required!");
		inst.res.json({"res":"error","error":"GAMEID Required!"});
		inst.res.end();
		return;
	}

	const sql = 'select * from gamemaster where gameid=?';
	var gameid = inst.req.body.id;

	inst.con.query(sql, [gameid],function (err, result, fields) 
	{	
		if (err)
		{
			throw err;
		}

		if (Object.keys(result).length==0)
		{
			console.log("GAMEID Doesn't Exist!");
			inst.res.json({"res":"error","error":"GAMEID Doesn't Exist!"});
			inst.res.end();
			return;
		}
		
		console.log(result);

		const insertSql = "INSERT INTO gamesession(gameid,guid,word1,word2,word3) VALUES(?,?,?,?,?)";
		var guid = inst.crypt.randomBytes(inst.byteCnt).toString('base64').substring(0, 6);
		var defaultBetWord = '-';
		console.log("Generated New GUID:"+guid);

		inst.con.query(
			insertSql,
			[gameid,guid,defaultBetWord,defaultBetWord,defaultBetWord],
			function(err, result, fields)
		{
			if (err)
			{
				throw err;	
			}   
			inst.res.json({"res":"success","guid":guid});
			inst.res.end();
		});		  
	});
}
