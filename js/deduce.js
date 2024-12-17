
require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.29.1/min/vs/' } });

window.MonacoEnvironment = {
    getWorkerUrl: function (workerId, label) {
        return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
            self.MonacoEnvironment = { baseUrl: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.29.1/min/" };
            importScripts("https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.29.1/min/vs/base/worker/workerMain.min.js");`
        )}`;
    }
};

require(['vs/editor/editor.main'], function () {
    monaco.languages.register({
        id: 'deduce'
    });
    monaco.languages.setMonarchTokensProvider('deduce', {
        // Set defaultToken to invalid to see what you do not tokenize yet
        // defaultToken: 'invalid',

        keywords: [
            "define", "function", "fun", "switch", "case", "union", "if", "then", "else", "import",
            "generic", "assert", "have", "transitive", "symmetric", "extensionality", "reflexive",
            "injective", "sorry", "help", "conclude", "suffices", "enough", "by", "rewrite",
            "conjunct", "induction", "where", "suppose", "with", "definition", "apply", "to", "cases",
            "obtain", "enable", "stop", "equations", "of", "arbitrary", "choose", "term", "from",
            "assume", "for", "recall", "in", "and", "or", "print", "not", "some", "all", "theorem",
            "lemma", "proof", "end"
        ],

        typeKeywords: [
            "MultiSet", "Option", "Pair", "Set", "List", "Int", "Nat", "int", "bool", "fn", "type"
        ],

        operators: [
            "->", "++", "/", "|", "&", "[+]", "[o]", "(=",
            "<=", ">=", "/=", "≠", "⊆", "≤", "≥", "∈", "∪", "+", "%", "(?<!/)*(?!/)", "⨄",
            "-", "∩", "∘", "λ", "@", ":", "<", ">", ",", "=", ".", ";", "#"
        ],

        defines: [
            "node", "suc", "take", "set_of", "empty_no_members",
            "single", "member_union", "single_equal", "length"
        ],

        prims: ["true", "false", "empty"],

        primSymbols: ["∅", "[0]", "?"],


        // we include these common regular expressions
        symbols: /(=|>|<|!|~|\?|:|&|\||\+|-|\^|%|\)|\(|\]|\[|o|0|≠|⊆|≤|≥|∈|∪|∅|.)/,

        specialSymbols: /((?<!\/|\*)\/(?!\/|\*)|(?<!\/)\*(?!\/))/,

        // The main tokenizer for our languages
        tokenizer: {
            root: [
                // identifiers and keywords
                [/[a-zA-Z$][\w$]*/, {
                    cases: {
                        '@typeKeywords': 'typeKeyword',
                        '@keywords': 'keyword',
                        '@prims': 'primitive',
                        '@defines': 'defined',
                        '@default': 'identifier',
                    }
                }],

                // delimiters and operators
                [/[{}()\[\],]/, 'brackets'],
                // [/[<>](?!@symbols)/, '@brackets'],
                [/[*=><!~?:&|+^%≤≥⇔∘∪∩⊆∈⨄∅-]+/, {
                    cases: {
                        '@primSymbols': 'primitive',
                        '@operators': 'operator',
                        '@default': 'operator'
                    }
                }],

                [/(?<!\/|\*)\/(?!\/|\*)/, "operator"],

                // whitespace
                { include: '@whitespace' },

                // numbers
                [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
                [/0[xX][0-9a-fA-F]+/, 'number.hex'],
                [/\d+/, 'number'],
            ],

            comment: [
                [/[^\/*]+/, 'comment'],
                [/\/\*/, 'comment', '@push'],    // nested comment
                ["\\*/", 'comment', '@pop'],
                [/[\/*]/, 'comment']
            ],

            whitespace: [
                [/[ \t\r\n]+/, 'white'],
                [/\/\*/, 'comment', '@comment'],
                [/\/\/.*$/, 'comment'],
            ],
        },
    });
    monaco.editor.defineTheme('deduce-dark', {
        colors: {},
        base: 'vs-dark',
        inherit: false,
        rules: [
            { token: 'keyword', foreground: 'e9cc60' },
            { token: 'typeKeyword', foreground: 'b689fe' },
            { token: 'operator', foreground: 'cfd6e3' },
            { token: 'brackets', foreground: 'cfd6e3' },
            { token: 'typeKeyword', foreground: 'b689fe' },
            { token: 'number', foreground: 'f18bea' },
            { token: 'primitive', foreground: 'f18bea' },
            { token: 'comment', foreground: '999999' },
            { token: 'defined', foreground: '67bef9' },
            { token: 'identifier', foreground: 'fa7188' },
        ]
    });

    const editor = monaco.editor.create(document.getElementById('container'), {
        theme: 'deduce-dark',
        value: "// Enter deduce code here",
        language: 'deduce'
    });

    const butt = document.getElementById("submit")
    const output = document.getElementById("code-output")

    const deduceServerURL = "http://127.0.0.1:12347/deduce"

    function do_thing(code) {
        output.innerHTML = "Sending..."
        fetch(deduceServerURL, {
            method: "POST",
            body: code
        }
        )
            .then(res => res.text())
            .then(data => output.innerHTML = data.replaceAll("\n", "<br>").replace("test.pf", "input"))
    }


    butt.onclick = () => do_thing(editor.getValue())
});