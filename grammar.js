module.exports = grammar({
	name: 'kdl',

	extras: $ => [" ", "\t", "\uFEFF"], // TODO: Whitespace table

	// TODO: We currently require a trailing newline at the end because I haven't figured out a way
	// to allow a node to be ended by EOF in addition to newline.

	rules: {
		document: $ => seq(optional($._linespace), repeat(seq($.node, optional($._linespace)))),

		node: $ => seq($.identifier, optional($._escline), repeat($._node_prop_or_arg), optional($._node_children), $._node_terminator),

		_node_prop_or_arg: $ => seq(choice($.prop, $.value), optional($._escline)),
		_node_children: $ => seq("{", optional($._linespace), repeat(seq($.node, optional($._linespace))), "}"),
		_node_terminator: $ => choice(";", $.single_line_comment, $._newline), // TODO: eof

		prop: $ => seq($.identifier, token.immediate("="), $.value),

		identifier: $ => /[a-z][a-z0-9]*/, // TODO

		value: $ => choice($.number, $.boolean, $.null), // TODO

		number: $ => choice($._decimal, $._hex, $._octal, $._binary),

		_binary: $ => /[+-]?0b[01][01_]*/,
		_octal: $ => /[+-]?0o[0-7][0-7_]*/,
		_hex: $ => /[+-]?0x[0-9a-fA-F][0-9a-fA-F_]*/,
		_decimal: $ => /[+-]?[0-9][0-9_]*(\.[0-9][0-9_]*)?([eE][+-]?[0-9][0-9_]*)?/,

		boolean: $ => choice("false", "true"),
		null: $ => "null",

		// The different kinds of whitespace defined by KDL
		_linespace: $ => choice($._newline, $.single_line_comment),
		_newline: $ => "\n", // TODO: Whole newline table

		_escline: $ => seq("\\", choice($.single_line_comment, $._newline)),

		single_line_comment: $ => seq("//", repeat1(/[^\n]/), $._newline), // TODO EOF
	}
});
