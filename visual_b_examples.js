// if.b
window.ex1 = {"IF": [
  {"NOT": [
    {"TRUE":[]}
  ]},
  {"ADD": [
    {"NUM": [
      3
    ]},
    {"NUM": [
      1
    ]}
  ]},
  {"IF": [
    {"FALSE":[]},
    {"SUB": [
      {"NUM": [
        4
      ]},
      {"NUM": [
        1
      ]}
    ]},
    {"LESS": [
      {"NUM": [
        5
      ]},
      {"NUM": [
        0
      ]}
    ]}
  ]}
]};

ex1Code = '\n\
(* simple *)\n\
\n\
if not(true)\n\
then (3 + 1)\n\
else (\n\
	if false\n\
	then (4 - 1)\n\
	else (5 < 0)\n\
)'



// less2.b
window.ex2 = {"LETV": [
  "x",
  {"NUM": [
    3
  ]},
  {"LETV": [
    "y",
    {"NUM": [
      4
    ]},
    {"IF": [
      {"LESS": [
        {"DIV": [
          {"VAR": [
            "x"
          ]},
          {"VAR": [
            "y"
          ]}
        ]},
        {"NUM": [
          5
        ]}
      ]},
      {"SEQ": [
        {"SEQ": [
          {"SEQ": [
            {"ASSIGN": [
              "x",
              {"RECORD":[]}
            ]},
            {"ASSIGN": [
              "y",
              {"RECORD": [
                ["a",{"NUM": [  1]}],
                ["b",{"NUM": [  2]}],
                ["c",{"NUM": [  3]}]
              ]}
            ]}
          ]},
          {"ASSIGNF": [
            {"VAR": [
              "y"
            ]},
            "a",
            {"NUM": [
              3
            ]}
          ]}
        ]},
        {"EQUAL": [
          {"FIELD": [
            {"VAR": [
              "y"
            ]},
            "a"
          ]},
          {"FIELD": [
            {"VAR": [
              "y"
            ]},
            "c"
          ]}
        ]}
      ]},
      {"VAR": [
        "x"
      ]}
    ]}
  ]}
]};

ex2Code = '(* less *)\n\
let x:=3 in \n\
let y:=4 in\n\
if ((x/y) < 5) \n\
then (\n\
	x:={};\n\
	y:={a:=1,b:=2,c:=3}; \n\
	y.a := 3;\n\
	y.a = y.c\n\
)\n\
else x\n\
'


// test6.b recursive factorial
window.ex3 = {"LETF": [
  "fac",
  {"ARGS": [
    "x"
  ]},
  {"IF": [
    {"NOT": [
      {"LESS": [
        {"VAR": [
          "x"
        ]},
        {"NUM": [
          1
        ]}
      ]}
    ]},
    {"MUL": [
      {"VAR": [
        "x"
      ]},
      {"CALLV": [
        "fac",
        {"ARGS": [
          {"SUB": [
            {"VAR": [
              "x"
            ]},
            {"NUM": [
              1
            ]}
          ]}
        ]}
      ]}
    ]},
    {"NUM": [
      1
    ]}
  ]},
  {"LETV": [
    "x",
    {"NUM": [
      0
    ]},
    {"SEQ": [
      {"READ": [
        "x"
      ]},
      {"WRITE": [
        {"CALLV": [
          "fac",
          {"ARGS": [
            {"VAR": [
              "x"
            ]}
          ]}
        ]}
      ]}
    ]}
  ]}
]};

ex3Code = '(* recursive - factorial *) \n\
\n\
let \n\
   proc fac(x) = \n\
      if not (x < 1) then (x * fac(x-1)) \n\
      else (1) \n\
   in\n\
let x := 0 in \n\
   read x; \n\
   write fac(x) \n'


// test3.b fibonacci
window.ex4 = {"LETV": [
  "x",
  {"NUM": [
    0
  ]},
  {"LETV": [
    "y",
    {"NUM": [
      1
    ]},
    {"LETV": [
      "z",
      {"NUM": [
        1
      ]},
      {"LETV": [
        "k",
        {"NUM": [
          0
        ]},
        {"LETV": [
          "c",
          {"NUM": [
            0
          ]},
          {"SEQ": [
            {"READ": [
              "k"
            ]},
            {"WHILE": [
              {"EQUAL": [
                {"VAR": [
                  "c"
                ]},
                {"NUM": [
                  0
                ]}
              ]},
              {"IF": [
                {"LESS": [
                  {"VAR": [
                    "z"
                  ]},
                  {"VAR": [
                    "k"
                  ]}
                ]},
                {"SEQ": [
                  {"SEQ": [
                    {"SEQ": [
                      {"WRITE": [
                        {"VAR": [
                          "z"
                        ]}
                      ]},
                      {"ASSIGN": [
                        "x",
                        {"VAR": [
                          "y"
                        ]}
                      ]}
                    ]},
                    {"ASSIGN": [
                      "y",
                      {"VAR": [
                        "z"
                      ]}
                    ]}
                  ]},
                  {"ASSIGN": [
                    "z",
                    {"ADD": [
                      {"VAR": [
                        "x"
                      ]},
                      {"VAR": [
                        "y"
                      ]}
                    ]}
                  ]}
                ]},
                {"ASSIGN": [
                  "c",
                  {"NUM": [
                    1
                  ]}
                ]}
              ]}
            ]}
          ]}
        ]}
      ]}
    ]}
  ]}
]}

ex4Code = '(* fibonacci *)\n\
\n\
let x := 0 in\n\
let y := 1 in\n\
let z := 1 in\n\
let k := 0 in\n\
let c := 0 in\n\
\n\
read k;\n\
while (c = 0) do (\n\
	if (z < k) then (\n\
		write z;\n\
		x := y;\n\
		y := z;\n\
		z := x + y\n\
	) else (\n\
		c := 1\n\
	)\n\
)\n'

window.runEx1 = function() {
    initialize(ex1);
    setCode(ex1Code);
}

window.runEx2 = function() {
    initialize(ex2);
    setCode(ex2Code);
}

window.runEx3 = function() {
    initialize(ex3);
    setCode(ex3Code);
}

window.runEx4 = function() {
    initialize(ex4);
    setCode(ex4Code);
}
