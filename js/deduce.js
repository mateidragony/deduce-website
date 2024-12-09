const butt = document.getElementById("submit")
const output = document.getElementById("code-output")
const input = document.getElementById("code-input")

const deduceServerURL = "http://127.0.0.1:12347/deduce"

function do_thing() {
    output.innerHTML = "Sending..."
    fetch(deduceServerURL, {
            method: "POST",
            body: input.value
        }
    )
        .then(res => res.text())
        .then(data => output.innerHTML = data.replaceAll("\n", "<br>").replace("test.pf", "input"))
}


butt.onclick = do_thing