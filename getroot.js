exports.CommonGet = (req,res,con) =>
{
	console.log('GETリクエストを受け取りました:'+req.ip);
}

exports.ShowKeywords = (req,res,con) =>
{
	const sql = 'select * from keyword';
    con.query(sql, function (err, result, fields) 
    {  
	    if (err) throw err;
	    console.log("Show Keywords");  
      	console.log(result);
        res.json(result);
	    res.end();  
    });
}
