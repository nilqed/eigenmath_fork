#include "app.h"

void
eval_nonstop(void)
{
	if (journaling) {
		pop();
		push_symbol(NIL);
		return; // not reentrant
	}

	toj = 0;
	journaling = 1;
	eval_nonstop_nib();
	journaling = 0;
	toj = 0;
}

void
eval_nonstop_nib(void)
{
	// these have to be volatile, crash occurs otherwise

	int volatile save_tos, save_tof, save_eval_level, save_loop_level, save_expanding;

	if (setjmp(jmpbuf1)) {

		undo(); // restore symbol table

		tos = save_tos;
		tof = save_tof;

		eval_level = save_eval_level;
		loop_level = save_loop_level;
		expanding = save_expanding;

		push_symbol(NIL); // return value

		return;
	}

	save_tos = tos - 1;
	save_tof = tof;

	save_eval_level = eval_level;
	save_loop_level = loop_level;
	save_expanding = expanding;

	evalf();
}
