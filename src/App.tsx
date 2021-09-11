import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import { devtools } from "webextension-polyfill";

// function spinny() {
//   console.log(document);
//   //document.body.style.backgroundColor = "#000000";
//   const head = document.getElementsByTagName("HEAD")[0];
//   const newStyle = document.createElement("style");
//   newStyle.innerHTML = `
//     @keyframes spinny {
//       from {
//         transform: rotate(0deg);
//       }
//       to {
//         transform: rotate(360deg);
//       }
//     }
//     .post {
//       animation: spinny infinite 20s linear;
//     }
//     `;
//   head.appendChild(newStyle);
// }

async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}
function App() {
  const [headContent, setHeadContent] = useState("");
  const [classInput, setClassInput] = useState("");

  //grab initial head content onMount
  useEffect(() => {
    const head = window.document.getElementsByTagName("HEAD")[0];
    setHeadContent(head.innerHTML);
  }, []);

  async function injectCSS(chosenClass: string) {
    //const head = window.document.getElementsByTagName("HEAD")[0];
    //const newStyle = document.createElement("style");
    const tab = await getCurrentTab();

    // function spinnyJS() {
    //   console.log(document);
    //   //document.body.style.backgroundColor = "#000000";
    //   const head = document.getElementsByTagName("HEAD")[0];
    //   const newStyle = document.createElement("style");
    //   newStyle.innerHTML = `
    //     @keyframes spinny {
    //       from {
    //         transform: rotate(0deg);
    //       }
    //       to {
    //         transform: rotate(360deg);
    //       }
    //     }
    //     .${chosenClass} {
    //       animation: spinny infinite 20s linear;
    //     }
    //     `;
    //   console.log(newStyle);
    //   head.appendChild(newStyle);
    // }
    const newCSS = `
    @keyframes spinny {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
    .${chosenClass} {
      animation: spinny infinite 20s linear;
    }
    `;
    //alert("tab is: " + tab.id);
    //alert("tab is: " + tab.id);
    if (tab.id || tab.id === 0) {
      try {
        chrome.scripting.insertCSS(
          {
            target: { tabId: tab.id },
            css: newCSS,
          },
          () => {
            alert("Sucessfully inserted CSS!");
          }
        );
      } catch (error) {
        alert(error);
      }
    } else alert("Invalid Tab ID!");
  }

  function resetCSS() {
    const head = window.document.getElementsByTagName("HEAD")[0];
    head.innerHTML = headContent;
  }
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <input
          type="text"
          value={classInput}
          placeholder="Choose a CSS Class"
          onChange={(event) => setClassInput(event.target.value)}
        />
        <button onClick={() => injectCSS(classInput)}>Move the Text</button>
        <button onClick={() => resetCSS()}>Reset the CSS</button>
        <div className="test-class">Boop Dee Boop</div>
      </header>
    </div>
  );
}

export default App;
