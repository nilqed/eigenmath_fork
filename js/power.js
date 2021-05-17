function
power()
{
	var h, i, n, p1, BASE, EXPO;

	EXPO = pop();
	BASE = pop();

	if (istensor(BASE)) {
		power_tensor();
		return;
	}

	if (iszero(BASE) && isnegativenumber(EXPO))
		stopf("divide by zero");

	if (BASE == symbol(EXP1) && isdouble(EXPO)) {
		push_double(Math.E);
		BASE = pop();
	}

	if (BASE == symbol(PI) && isdouble(EXPO)) {
		push_double(Math.PI);
		BASE = pop();
	}

	// 1^expr = expr^0 = 1

	if (isplusone(BASE) || iszero(EXPO)) {
		if (isdouble(BASE) || isdouble(EXPO))
			push_double(1.0);
		else
			push_integer(1);
		return;
	}

	// expr^1 = expr

	if (isplusone(EXPO)) {
		push(BASE);
		return;
	}

	// 0^expr

	if (iszero(BASE)) {
		if (isnum(EXPO)) {
			if (isdouble(BASE) || isdouble(EXPO))
				push_double(0.0);
			else
				push_integer(0);
		} else {
			push_symbol(POWER);
			push(BASE);
			push(EXPO);
			list(3);
		}
		return;
	}

	// BASE and EXPO numerical?

	if (isnum(BASE) && isnum(EXPO)) {
		power_numbers(BASE, EXPO);
		return;
	}

	// BASE is an integer? (EXPO is not numerical)

	if (isinteger(BASE)) {
		h = stack.length;
		push(BASE);
		factor();
		n = stack.length - h;
		for (i = 0; i < n; i++) {
			p1 = stack[h + i];
			if (car(p1) == symbol(POWER)) {
				push_symbol(POWER);
				push(cadr(p1)); // base
				push(caddr(p1)); // expo
				push(EXPO);
				multiply_expand();
				list(3);
			} else {
				push_symbol(POWER);
				push(p1);
				push(EXPO);
				list(3);
			}
			stack[h + i] = pop();
		}
		if (n > 1) {
			sort_factors(h);
			list(n);
			push_symbol(MULTIPLY);
			swap();
			cons();
		}
		return;
	}

	// BASE is a fraction? (EXPO is not numerical)

	if (isfraction(BASE)) {
		push(BASE);
		numerator();
		push(EXPO);
		power();
		push(BASE);
		denominator();
		push(EXPO);
		negate_expand();
		power();
		multiply_expand();
		return;
	}

	// BASE = e ?

	if (BASE == symbol(EXP1)) {
		power_natural_number(EXPO);
		return;
	}

	// do this before checking for (a + b)^n

	if (iscomplexnumber(BASE) && isnum(EXPO)) {
		power_complex_number(BASE, EXPO);
		return;
	}

	// (a + b)^n -> (a + b) * (a + b) ...

	if (car(BASE) == symbol(ADD)) {
		power_sum(BASE, EXPO);
		return;
	}

	// (a * b) ^ c -> (a ^ c) * (b ^ c)

	if (car(BASE) == symbol(MULTIPLY)) {
		h = stack.length;
		p1 = cdr(BASE);
		while (iscons(p1)) {
			push(car(p1));
			push(EXPO);
			power();
			p1 = cdr(p1);
		}
		multiply_factors(stack.length - h);
		return;
	}

	// (a^b)^c -> a^(b * c)

	if (car(BASE) == symbol(POWER)) {
		push(cadr(BASE));
		push(caddr(BASE));
		push(EXPO);
		multiply_expand(); // always expand products of exponents
		power();
		return;
	}

	// none of the above

	push_symbol(POWER);
	push(BASE);
	push(EXPO);
	list(3);
}
