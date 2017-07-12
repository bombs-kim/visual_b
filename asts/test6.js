{"LETF": [
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
]}
