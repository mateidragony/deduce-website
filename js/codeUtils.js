const operators = ["->", "\\+\\+", "\\/", "\\|", "&", "\\[\\+\\]", "\\[o\\]", "\\(=", "<=", 
                   ">=", "\\/=", "≠", "⊆", "≤", "≥", "∈", "∪", "\\+", "%", "\\*", "⨄", "-", 
                   "∩", "∘", "λ", "@", ":", "&gt;", "&lt;", "\\(", "\\)", "{", "}", ",", "=", 
                   "\\."]

const prims = ["true", "false", "0", "[0-9]+", "empty"]

const defines = ["node", "suc", "take", "set_of", "empty_no_members", 
                 "single", "member_union", "single_equal"]

const primsSym = ["∅", "\\[0\\]", "\\?"]

const types = ["MultiSet","Option","Pair","Set","List","Int","Nat", "int", "bool", "fn", "type"]

const keywords = ["define","function","fun","switch","case","union","if","then","else","import",
                  "generic","assert","have","transitive","symmetric","extensionality","reflexive",
                  "injective","sorry","help","conclude","suffices","enough","by","rewrite",
                  "conjunct", "induction","where","suppose","with","definition","apply","to","cases",
                  "obtain","enable","stop","equations","of","arbitrary","choose","term", "from",
                  "assume","for","recall","in","and","or","print","not","some","all", "theorem", 
                  "lemma", "proof", "end"]


function getRegex(ls){
    let fullRegex = ls.reduce((a, s) => `\\b${s}\\b|` + a, "")
    return fullRegex.substring(0, fullRegex.length - 1)
}

function getRegexSymbols(ls){
    let fullRegex = ls.reduce((a, s) => `${s}|` + a, "")
    return fullRegex.substring(0, fullRegex.length - 1)
}

function replaceLeadingTabs(str){
    if (str[0] != "\t") return str
    return "<span class=\"tab\"></span>" + replaceLeadingTabs(str.substring(1))
}


function codeToHTML(code){
    // scan to get user defined functions and variables
    const fncRe = new RegExp("(?<=\\bfunction\\s)\\w+(?=\\s*[\\(|<])", "g")
    const thmRe = new RegExp("(?<=\\btheorem\\s)\\w+(?=\\s*:)", "g") 
    const uniRe = new RegExp("(?<=\\bunion\\s)\\w+(?=\\s*<)?", "g") 
    const defRe = new RegExp("(?<=\\bdefine\\s)\\w+(?=\\s*:)?", "g") 
    let userDefs =  []
            .concat([...code.matchAll(fncRe)][0])
            .concat([...code.matchAll(thmRe)][0])
            .concat([...code.matchAll(uniRe)][0])
            .concat([...code.matchAll(defRe)][0])
    userDefs = userDefs.filter(e => e !== undefined)
    // prep regex
    const ore = new RegExp(getRegexSymbols(operators), "g")
    const pre = new RegExp(getRegex(prims) + "|" + getRegexSymbols(primsSym), "g")
    const tre = new RegExp(getRegex(types), "g")
    const kre = new RegExp(getRegex(keywords), "g")
    const dre = new RegExp(getRegex(defines.concat(userDefs)), "g")
    // remove first new line
    code = (code[0] == '\n' ? code.substring(1) : code)
    // fixing things for html
    code = code.replaceAll("<", "&lt;");
    code = code.replaceAll(">", "&gt;");
    // (heavy quote) lexing (heavy quote)
    code = code.replaceAll(" ", "\x00"); // temporary
    code = code.replaceAll(ore, "<span class=\"operator\">$&</span>");
    code = code.replaceAll(pre, "<span class=\"prim\">$&</span>");
    code = code.replaceAll(tre, "<span class=\"type\">$&</span>");
    code = code.replaceAll(kre, "<span class=\"keyword\">$&</span>");
    code = code.replaceAll(dre, "<span class=\"defines\">$&</span>");
    code = code.replaceAll("\n", "<br>\n");
    code = code.replaceAll("\x00", "&nbsp;"); // told you it was temporary

    return code;
}

// set codeblocks
for (let cb in codeBlocks) {
    try{
        const htmlCode = document.getElementById(cb)
        htmlCode.innerHTML = codeToHTML(codeBlocks[cb])
        
        const copyButton = document.createElement("button")
        const copyTooltip = document.createElement("p")

        copyTooltip.classList.add("button-tooltip")
        copyButton.innerHTML = "<i class=\"fa-solid fa-clone\"></i>"
        copyButton.setAttribute("title", "Copy code")

        copyButton.onclick = () => {
            if(navigator){
                let code = codeBlocks[cb]
                navigator.clipboard.writeText(code[0] == '\n' ? code.substring(1) : code)
                copyTooltip.innerHTML = "Copied!"
            } else {
                copyTooltip.innerHTML = "Error copying code."
            }
            copyTooltip.style.opacity = "100";
        }
        copyButton.onmouseleave = copyButton.ontouchend = () => copyTooltip.style.opacity = "0";

        htmlCode.appendChild(copyButton)
        htmlCode.appendChild(copyTooltip)
    } catch (error) {
        console.error(error);
        console.log(`No matching html id for ${cb}. Skipping...`)
    }
}