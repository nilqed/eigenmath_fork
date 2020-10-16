function
emit_subscript(u, s)
{
	var v = {type:SUBSCRIPT, a:[]};
	if (s.length == 1)
		emit_italic(v, s);
	else
		emit_special_symbol(v, s);
	emit_update(v);
	u.a.push(v);
}
