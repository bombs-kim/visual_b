{"LETV": [
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
