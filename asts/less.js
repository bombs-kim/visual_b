{"LETV": [
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
      {"NOT": [
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
        ]}
      ]},
      {"SEQ": [
        {"SEQ": [
          {"SEQ": [
            {"ASSIGN": [
              "x",
              ["RECORD"]
            ]},
            {"ASSIGN": [
              "y",
              {"RECORD": [
                "a"
                {"NUM": [
                  1
                ]},
                "b"
                {"NUM": [
                  2
                ]},
                "c"
                {"NUM": [
                  3
                ]}
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
]}
