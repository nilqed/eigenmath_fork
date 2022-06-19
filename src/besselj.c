#include "defs.h"

void
eval_besselj(struct atom *p1)
{
	push(cadr(p1));
	eval();

	push(caddr(p1));
	eval();

	besselj();
}

void
besselj(void)
{
	int n;
	double d;
	struct atom *X, *N, *SIGN;

	N = pop();
	X = pop();

	if (isdouble(X) && issmallinteger(N)) {
		push(N);
		n = pop_integer();
		d = jn(n, X->u.d);
		push_double(d);
		return;
	}

	// bessej(0,0) = 1

	if (iszero(X) && iszero(N)) {
		push_integer(1);
		return;
	}

	// besselj(0,n) = 0

	if (iszero(X) && isinteger(N)) {
		push_integer(0);
		return;
	}

	// half arguments

	if (N->k == RATIONAL && MEQUAL(N->u.q.b, 2)) {

		// n = 1/2

		if (N->sign == MPLUS && MEQUAL(N->u.q.a, 1)) {
			push_integer(2);
			push_symbol(PI);
			divide();
			push(X);
			divide();
			push_rational(1, 2);
			power();
			push(X);
			sinfunc();
			multiply();
			return;
		}

		// n = -1/2

		if (N->sign == MMINUS && MEQUAL(N->u.q.a, 1)) {
			push_integer(2);
			push_symbol(PI);
			divide();
			push(X);
			divide();
			push_rational(1, 2);
			power();
			push(X);
			cosfunc();
			multiply();
			return;
		}

		// besselj(x,n) = (2/x) (n-sgn(n)) besselj(x,n-sgn(n)) - besselj(x,n-2*sgn(n))

		if (N->sign == MPLUS)
			push_integer(1);
		else
			push_integer(-1);

		SIGN = pop();

		push_integer(2);
		push(X);
		divide();
		push(N);
		push(SIGN);
		subtract();
		multiply();
		push(X);
		push(N);
		push(SIGN);
		subtract();
		besselj();
		multiply();
		push(X);
		push(N);
		push_integer(2);
		push(SIGN);
		multiply();
		subtract();
		besselj();
		subtract();

		return;
	}

	push_symbol(BESSELJ);
	push(X);
	push(N);
	list(3);
}
