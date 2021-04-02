function
eval_kronecker(p1)
{
	var t = expanding;
	expanding = 1;
	push(cadr(p1));
	evalf();
	p1 = cddr(p1);
	while (iscons(p1)) {
		push(car(p1));
		evalf();
		kronecker();
		p1 = cdr(p1);
	}
	expanding = t;
}
