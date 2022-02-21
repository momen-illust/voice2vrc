commandWord = "着替えスイッチ"

const commands = [
  {
    if: (t) => t.includes("着る") || t.includes("切る"),
    path: "/avatar/parameters/Outer",
    value: 1,
  },
  {
    if: (t) => t.includes("脱ぐ"),
    path: "/avatar/parameters/Outer",
    value: 0,
  },
];

function post(path, value) {
  fetch("http://localhost:9090/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      path: path,
      value: value,
    }),
  });
}

function evtypelog(event) {
  console.log(event.type);
}

let isCommandMode = false;

document.addEventListener("DOMContentLoaded", () => {
  const $input = document.querySelector("#input");
  /** @type {SpeechRecognition} */
  const re = new (webkitSpeechRecognition || SpeechRecognition)();
  re.onaudiostart = evtypelog;
  re.onaudioend = evtypelog;
  re.onerror = console.log;
  re.onstart = evtypelog;
  re.onnomatch = console.log;
  re.onsoundend = evtypelog;
  re.onsoundstart = evtypelog;
  re.onspeechstart = evtypelog;
  re.onspeechend = evtypelog;
  re.addEventListener("result", (event) => {
    console.log(event);

    const result = event.results.item(0).item(0).transcript;
    $input.textContent = result;
    if (isCommandMode) {
      let matched = false;
      commands.forEach(({ if: test, path, value }) => {
        if (test(result)) {
          matched = true;
          console.log(path, value);
          post(path, value)
        }
        if (!matched) {
          $input.textContent = "聞き取れませんでした"
        }
        isCommandMode = false;
      });
    } else {
      if (result.includes(commandWord)) {
        isCommandMode = true;
      }
    }
  });
  re.addEventListener("end", (event) => {
    console.log(event);
    re.start();
  });
  re.start();
});
