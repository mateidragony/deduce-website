//
// TODO: . does not style
//



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
        symbols: /(=|>|<|!|~|\?|:|&|\||\+|-|\^|%|\)|\(|\]|\[|o|0|≠|⊆|≤|≥|∈|∪|∅|\.)/,

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
                [/[.@*=><!~?:&|+^%≤≥⇔∘∪∩⊆∈⨄∅-]+/, {
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
        value: "// Enter deduce code here\n\n\n",
        language: 'deduce',
        automaticLayout: true
    });

    const butt = document.getElementById("submit")
    const output = document.getElementById("code-output")

    const deduceServerURL = "https://deduce.vercel.app/deduce"

    function prepare_output(out, is_err = false, re_sp = true) {
        out = out.replaceAll("\n", "<br>")
        out = out.replaceAll("\t", "    ")
        out = re_sp ? out.replaceAll(" ", "&nbsp;") : out
        return is_err ? `<span class="error">${out}</span>` : out
    }

    function send_deduce(code) {
        output.innerHTML = '<div class="loader">Deducing<span></span></div>'
        fetch(deduceServerURL, {
            method: "POST",
            body: code
        })
            .then(res => {
                if (res.ok) {
                    return res.text()
                }
                throw new Error('')
            })
            .then(data => output.innerHTML = prepare_output(data))
            .catch(error => output.innerHTML = prepare_output('Something went wrong internally.\nIf this error persists please reach us at <a href="mailto:jsiek@iu.edu">jsiek@iu.edu</a>.',
                is_err = true,
                re_sp = false))
    }


    butt.onclick = () => send_deduce(editor.getValue())
});



const resizerNS = document.querySelector('#resizer-ns');
const resizerEW = document.querySelector('#resizer-ew');
const wrapper = document.querySelector('.sandbox');
const container = wrapper.querySelector('.in');
let isHandlerDraggingNS = false;
let isHandlerDraggingEW = false;

document.addEventListener('mousedown', function (e) {
    // If mousedown event is fired from .handler, toggle flag to true
    if (e.target === resizerNS) {
        isHandlerDraggingNS = true;
    }
    if (e.target === resizerEW) {
        isHandlerDraggingEW = true;
    }
});

document.addEventListener('mousemove', function (e) {
    // Don't do anything if dragging flag is false
    if (!isHandlerDraggingNS && !isHandlerDraggingEW) {
        return false;
    }

    // Get offset
    var containerOffsetLeft = wrapper.offsetLeft;
    var containerOffsetTop = wrapper.offsetTop;

    // Get x-coordinate of pointer relative to container
    var pointerRelativeXpos = e.clientX - containerOffsetLeft;
    var pointerRelativeYpos = e.clientY - containerOffsetTop;

    // Arbitrary minimum width set on box A, otherwise its inner content will collapse to width of 0
    var containerMin = 60;

    // Resize box A
    // * 8px is the left/right spacing between .handler and its inner pseudo-element
    // * Set flex-grow to 0 to prevent it from growing
    if (isHandlerDraggingEW) {
        container.style.width = (Math.max(containerMin, pointerRelativeXpos - 8)) + 'px';
        container.style.flexGrow = 0;
    } else if (isHandlerDraggingNS) {

        console.log("heheheha")
        container.style.height = (Math.max(containerMin, pointerRelativeYpos - 8)) + 'px';
        // container.style.flexGrow = 0;
    }
});

document.addEventListener('mouseup', function (e) {
    // Turn off dragging flag when user mouse is up
    isHandlerDraggingNS = false;
    isHandlerDraggingEW = false;
});

