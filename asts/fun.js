{"LETF": [
  "f",
  {"ARGS": [
    "a",
    "b",
    "c"
  ]},
  {"SEQ": [
    {"ASSIGN": [
      "b",
      {"NUM": [
        0
      ]}
    ]},
    {"ADD": [
      {"MUL": [
        {"VAR": [
          "a"
        ]},
        {"VAR": [
          "b"
        ]}
      ]},
      {"MUL": [
        {"VAR": [
          "b"
        ]},
        {"VAR": [
          "c"
        ]}
      ]}
    ]}
  ]},
  {"LETV": [
    "x",
    {"NUM": [
      1
    ]},
    {"LETV": [
      "y",
      {"NUM": [
        2
      ]},
      {"LETV": [
        "z",
        {"NUM": [
          3
        ]},
        {"SEQ": [
          {"READ": [
            "x"
          ]},
          {"IF": [
            {"EQUAL": [
              {"VAR": [
                "x"
              ]},
              {"NUM": [
                1
              ]}
            ]},
            {"ADD": [
              {"CALLV": [
                "f",
                {"ARGS": [
                  {"VAR": [
                    "x"
                  ]},
                  {"VAR": [
                    "y"
                  ]},
                  {"VAR": [
                    "z"
                  ]}
                ]}
              ]},
              {"VAR": [
                "y"
              ]}
            ]},
            {"ADD": [
              {"CALLR": [
                "f",
                {"ARGS": [
                  "x",
                  "y",
                  "z"
                ]}
              ]},
              {"VAR": [
                "y"
              ]}
            ]}
          ]}
        ]}
      ]}
    ]}
  ]}
]}
