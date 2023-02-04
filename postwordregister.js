exports.Execute = (inst) =>
{
	if (inst.req.body.word === undefined ||
		inst.req.body.word === '' ||
		inst.req.body.word === null)
	{
		console.log("Keyword Required!");
		inst.res.json({"res":"error","error":"Keyword Required!"});
		inst.res.end();
		return;
	}

	if (inst.req.body.word.length > 10)
	{
		console.log("Keyword Over 10!");
		inst.res.json({"res":"error","error":"Keyword Over 10!"});
		inst.res.end();
		return;
	}

	const sql = "INSERT INTO keyword(word) VALUES(?)";
	var word = inst.req.body.word;
	inst.con.query(sql,[word],function(err, result, fields)
	{
		if (err)
		{
			inst.res.json({"res":"error","error":"Duplicate"});
			inst.res.end();
			console.log(err);
			return;
		} 
		
		console.log("RegisterWord:" + word);
		inst.res.json({"res":"success"});
		inst.res.end();
	});
}
