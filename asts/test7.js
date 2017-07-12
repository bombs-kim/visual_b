{"LETV": [
  "x",
  {"NUM": [
    5
  ]},
  {"LETF": [
    "reduce",
    {"ARGS": [
      "y"
    ]},
    {"IF": [
      {"NOT": [
        {"EQUAL": [
          {"VAR": [
            "y"
          ]},
          {"NUM": [
            0
          ]}
        ]}
      ]},
      {"SEQ": [
        {"ASSIGN": [
          "y",
          {"SUB": [
            {"VAR": [
              "y"
            ]},
            {"NUM": [
              1
            ]}
          ]}
        ]},
        {"ADD": [
          {"NUM": [
            1
          ]},
          {"CALLR": [
            "reduce",
            {"ARGS": [
              "y"
            ]}
          ]}
        ]}
      ]},
      {"NUM": [
        1
      ]}
    ]},
    {"SEQ": [
      {"WRITE": [
        {"CALLR": [
          "reduce",
          {"ARGS": [
            "x"
          ]}
        ]}
      ]},
      {"WRITE": [
        {"VAR": [
          "x"
        ]}
      ]}
    ]}
  ]}
]}
