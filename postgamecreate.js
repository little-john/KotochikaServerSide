exports.Execute = (inst) =>
{
	const wordsSQL = "SELECT word FROM keyword";
	inst.con.query(wordsSQL,function(err, result, fields)
	{
		if (err)
		{
			console.log(err);
			inst.res.json({"res":"error", "error":err});
			inst.res.end();
			return;
		}

		if (Object.keys(result).length < 10)
		{
			console.log("Insufficient Words!");
			inst.res.json({"res":"error", "error":"Insufficient Words!"});
			inst.res.end();
			return;
		}

		const shuffled = result.sort(() => 0.5 - Math.random());
		let selected = shuffled.slice(0, 10);

		var gameid = inst.crypt.randomBytes(inst.byteCnt).toString('base64').substring(0, 8);
		var winner = '******';

		var words = selected.map(function( value ) {
			return value.word;
		});
		var json = JSON.stringify(words);
		console.log(json);

		var survivor = [];

		let insertSQL = `INSERT INTO gameinfo(gameid,words,winner) VALUES('${gameid}','${json}','${winner}');`;
		insertSQL += `INSERT INTO gamemaster(gameid) VALUES('${gameid}');`;
		selected.forEach(function(element){
			survivor.push({"word":element.word,"hp":100});
			insertSQL += `INSERT INTO gametransaction(gameid,word) VALUES('${gameid}','${element.word}');`;
		});

		inst.con.query(insertSQL,function(err, result, fields)
		{
			if (err) throw err;
			console.log("Generated GameID:"+gameid);

			inst.res.json({"res":"success", "gameid":gameid,"survivor":survivor});
			inst.res.end();  
		});	
	});
}
