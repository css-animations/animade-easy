import React, { useState, useEffect, useCallback } from "react";
import * as devtoolsProtocol from "devtools-protocol";
import { ANIMATABLE_PROPERTIES } from "./components/NewChild";
async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

const importantAttributesHash: any = {
  class: true,
  id: true,
};

export interface AnimationPropertyType {
  animationName: string;
  animationTypes: AnimationTypeDatum[];
  direction: string;
  duration: string;
}

interface AnimationTypeDatum {
  animationType: ANIMATABLE_PROPERTIES;
  formatFunction: (rawData: string) => string;
}
export const ScaleTypeAnimation: AnimationTypeDatum = {
  animationType: ANIMATABLE_PROPERTIES.scale,
  formatFunction: (rawData: string): string => `transform: scale(${rawData});`,
};

export const RotateTypeAnimation: AnimationTypeDatum = {
  animationType: ANIMATABLE_PROPERTIES.rotate,
  formatFunction: (rawData: string) => `transform: rotate(${rawData}deg)`,
};

interface propertyType {
  name: string;
  value: string;
}

const defaultHighlightConfig = {
  showInfo: true,
  showRulers: true,
  contentColor: {
    r: 0,
    g: 0,
    b: 0,
    a: 0.5,
  },
};
interface DevToolContextType {
  injectedStyles: chrome.scripting.CSSInjection[];
  injectCSS: (chosenSelector: string) => void;
  resetCSS: () => void;
  attachInspect: () => void;
  detachInspect: () => void;
  from: number;
  setFrom: React.Dispatch<React.SetStateAction<number>>;
  to: number;
  setTo: React.Dispatch<React.SetStateAction<number>>;
  chosenClasses: {};
  setChosenClasses: React.Dispatch<React.SetStateAction<{}>>;
  chosenIDs: {};
  injectCSSAnimation: (
    animationObj: AnimationPropertyType,
    percentageList: number[],
  ) => void;
  injectCSSAnimationClasses: (
    animationClasses: animationPropertyType[],
    classNames: string[],
  ) => void;
  injectedAnimations: string[];
}

const defaultDevContext: DevToolContextType = {
  injectedStyles: [],
  injectCSS: (chosenSelector: string) => {},
  resetCSS: () => {},
  attachInspect: () => {},
  detachInspect: () => {},
  from: 0,
  setFrom: () => {},
  to: 100,
  setTo: () => {},
  chosenClasses: {},
  setChosenClasses: () => {},
  chosenIDs: {},
  injectCSSAnimation: (
    animationObj: AnimationPropertyType,
    percentageList: number[],
  ) => {},
  injectCSSAnimationClasses: (
    animationClasses: animationPropertyType[],
    classNames: string[],
  ) => {},
  injectedAnimations: [],
};

export const DevToolContext = React.createContext(defaultDevContext);

interface DevToolProps {
  children: JSX.Element;
}

export function DevToolProvider(props: DevToolProps) {
  const [injectedStyles, setInjectedStyles] = useState<
    chrome.scripting.CSSInjection[]
  >([]);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(100);
  //sets of chosen classes/IDs
  const [chosenClasses, setChosenClasses] = useState({});
  const [chosenIDs, setChosenIDs] = useState({});
  //TODO: make this typed
  const [injectedAnimations, setInjectedAnimations] = useState<string[]>([]);

  //function that listens
  const debugListener = useCallback(
    async function debugListenerFunc(source: any, method: any, params: any) {
      const tab = await getCurrentTab();
      if (!tab && tab !== 0) return;
      const debugee = {
        tabId: tab.id,
      };
      //alert(source);
      console.log(method);
      //console.log the styles as necessary
      if (method === "CSS.styleSheetAdded") {
        console.log(params.header);
      }

      if (method === "Overlay.inspectNodeRequested") {
        //alert(params);
        console.log(params);
        const backendId = params.backendNodeId;
        chrome.debugger.sendCommand(
          debugee,
          "DOM.describeNode",
          {
            backendNodeId: backendId,
          },
          (res: any) => {
            console.log(res);
            const node: devtoolsProtocol.Protocol.DOM.Node = res.node;
            const attributes = node.attributes;
            if (!attributes) return;
            const properties: propertyType[] = [];
            for (let i = 0; i < attributes.length - 1; i++) {
              const deets = attributes[i];
              if (importantAttributesHash[deets]) {
                properties.push({
                  name: deets,
                  value: attributes[i + 1],
                });
                i++;
              }
            }
            console.log(properties);
            for (const property of properties) {
              if (property.name === "class") {
                const classes = property.value.split(" ");
                //get list of classes of DOM node
                for (const currClass of classes) {
                  //injectCSS("." + currClass);
                  setChosenClasses((prevClasses) => ({
                    ...prevClasses,
                    [currClass]: true,
                  }));
                } //inject for the id if it's not a class
              } else if (property.name === "id") {
                const currId = property.value;
                //injectCSS("#" + currId);
                setChosenIDs((prevIDs) => ({
                  ...prevIDs,
                  currId: true,
                }));
              }
            }
          },
        );
      }
      //alert(params);
    },
    [from, to],
  );
  //when component mounts, attach debugger to current tab
  useEffect(() => {
    async function debugAttach() {
      const tab = await getCurrentTab();

      if (!tab && tab !== 0) {
        console.log("No Tab!");
        return;
      }
      const debugee = {
        tabId: tab.id,
      };
      //chrome.debugger.onEvent.removeListener(debugListener);
      chrome.debugger.detach(debugee);
      await attachDebugger();
      chrome.tabs.onActivated.addListener(tabListener);
    }
    debugAttach();
    return () => {
      async function destructor() {
        const tab = await getCurrentTab();
        if (!tab.id && tab.id !== 0) return;
        const debugee = {
          tabId: tab.id,
        };
        chrome.debugger.onEvent.removeListener(debugListener);
        chrome.tabs.onActivated.removeListener(tabListener);
      }
      if (typeof to === "number" && typeof from === "number") {
        console.log("Detaching!");
        destructor();
      }
    };
  }, [from, to]);

  async function tabListener(activeInfo: chrome.tabs.TabActiveInfo) {
    //detach with current active info
    chrome.debugger.onEvent.removeListener(debugListener);
    //await resetCSS();
    chrome.debugger.detach({
      tabId: activeInfo.tabId,
    });
    attachDebugger();
    console.log("Tab changed!");
  }

  //function to attach debugger to current tab
  async function attachDebugger() {
    const tab = await getCurrentTab();
    if (tab || tab === 0) {
      const debugee = {
        tabId: tab.id,
      };
      chrome.debugger.detach(debugee);
      chrome.debugger.attach(debugee, "1.3");
      console.log("Attached!");
      chrome.debugger.onEvent.addListener(debugListener);
      //enable debugging manipulation
      chrome.debugger.sendCommand(debugee, "DOM.enable");
      chrome.debugger.sendCommand(debugee, "CSS.enable");
      chrome.debugger.sendCommand(debugee, "Overlay.enable");
    } else alert("Invalid tab ID!");
  }

  // async function applyAnimation() {
  //   for (let chosenClass of Object.keys(chosenClasses)) {
  //     console.log("Applying animation to a class!");
  //     injectCSS("." + chosenClass);
  //   }
  //   for (let id of Object.keys(chosenIDs)) {
  //     console.log("Applying animation to an id!");
  //     injectCSS("#" + id);
  //   }
  // }

  //function to injectCSS
  const injectCSS = useCallback(
    async (chosenSelector: string) => {
      console.log("from is: " + from);
      console.log("to is: " + to);
      injectCSSFunc(chosenSelector, from, to);
    },
    [from, to],
  );
  async function injectCSSFunc(
    chosenSelector: string,
    from: number,
    to: number,
  ) {
    console.log("from is: " + from);
    console.log("to is: " + to);
    //const head = window.document.getElementsByTagName("HEAD")[0];
    //const newStyle = document.createElement("style");
    const tab = await getCurrentTab();
    const newCSS = `
    @keyframes spinny {
      from {
        transform: rotate(${(360 / 100) * from}deg);
      }
      to {
        transform: rotate(${(360 / 100) * to + 0.01}deg);
      }
    }
    ${chosenSelector} {
      animation: spinny infinite ${(2 * (to - from)) / 100}s linear;
    }
    `;

    if (tab.id || tab.id === 0) {
      try {
        const newInjection: chrome.scripting.CSSInjection = {
          target: { tabId: tab.id },
          css: newCSS,
        };
        chrome.scripting.insertCSS(newInjection, () => {
          setInjectedStyles((prevStyles) => [...prevStyles, newInjection]);
          //alert("Sucessfully inserted CSS!");
        });
      } catch (error) {
        alert(error);
      }
    } else alert("Invalid Tab ID!");
  }

  //function to inject CSS Animation
  async function injectCSSAnimation(
    animationObj: AnimationPropertyType,
    percentageList: number[],
  ) {
    const tab = await getCurrentTab();
    if (!tab.id && tab.id !== 0) return;
    const debugee = {
      tabId: tab.id,
    };
    //TODO: Grab the animation from somewhere

    const THRESHOLD = 30;

    const newAnimationPercentages: number[] = [];
    for (let i = 0; i < percentageList.length && THRESHOLD; i++) {
      const perc = percentageList[i] * 100;
      newAnimationPercentages.push(perc);
      //CHOOSE FROM POINTS SOMEHOW BY INCREMENTING I HERE
    }
    //const newAnimationPercentages = [0, 0.13, 0.8, 1].map((perc) => perc * 100);
    let newCSS = `@keyframes ${animationObj.animationName} {`;
    for (const percentage of newAnimationPercentages) {
      newCSS += `
      ${percentage}% {`;
      for (const property of animationObj.animationTypes) {
        newCSS += `
        ${property.formatFunction("75")};`;
      }
    }
    newCSS += `
  }
    `;
    console.log(newCSS);
    const newInjection: chrome.scripting.CSSInjection = {
      css: newCSS,
      target: debugee,
    };
    chrome.scripting.insertCSS(newInjection, () => {
      setInjectedStyles((prevStyles) => [...prevStyles, newInjection]);
      setInjectedAnimations((prevAnimations) => [
        ...prevAnimations,
        animationObj.animationName,
      ]);
      console.log("Added animation!");
    });
  }

  async function injectCSSAnimationClasses(
    animationClasses: animationPropertyType[],
    classNames: string[],
  ) {
    const ANIMATION_LENGTH = 5;
    const tab = await getCurrentTab();
    if (!tab.id && tab.id !== 0) return;
    const debugee = {
      tabId: tab.id,
    };

    let newCSS = ``;
    //TODO: Grab this from state somewhere idk
    //const CLASS_NAMES = ["jeff", "bezos", "zuck", "gates"];
    for (const name of classNames) {
      newCSS += `
      ${name} {
        `;
      for (const propertyObj of animationClasses) {
        newCSS += `
        animation: ${propertyObj.animationName} infinite ${propertyObj.duration};
        `;
      }
      newCSS += `
    }`;
    }

    console.log(newCSS);
    const newInjection: chrome.scripting.CSSInjection = {
      css: newCSS,
      target: debugee,
    };
    chrome.scripting.insertCSS(newInjection, () => {
      setInjectedStyles((prevStyles) => [...prevStyles, newInjection]);
      console.log("Added animation to classes!");
    });
  }

  async function resetCSS() {
    //const head = window.document.getElementsByTagName("HEAD")[0];
    const tab = await getCurrentTab();
    const tabId = tab.id;
    if (tabId !== undefined) {
      const results = Promise.all(
        injectedStyles.map((styleInjection) => {
          (chrome.scripting as any).removeCSS(styleInjection);
        }),
      );
      setInjectedStyles([]);
    }
  }

  //attach inspect mode
  async function attachInspect() {
    const tab = await getCurrentTab();

    if (!tab && tab !== 0) return;
    const debugee = {
      tabId: tab.id,
    };

    chrome.debugger.sendCommand(debugee, "Overlay.setInspectMode", {
      mode: "searchForNode",
      highlightConfig: defaultHighlightConfig,
    });
  }

  //exit inspect mode
  async function detachInspect() {
    const tab = await getCurrentTab();

    if (!tab && tab !== 0) return;
    const debugee = {
      tabId: tab.id,
    };

    chrome.debugger.sendCommand(debugee, "Overlay.setInspectMode", {
      mode: "none",
      highlightConfig: {
        showInfo: false,
      },
    });
  }

  return (
    <DevToolContext.Provider
      value={{
        injectedStyles,
        injectCSS,
        resetCSS,
        attachInspect,
        detachInspect,
        from,
        setFrom,
        to,
        setTo,
        chosenClasses,
        chosenIDs,
        setChosenClasses,
        injectCSSAnimation,
        injectCSSAnimationClasses,
        injectedAnimations,
      }}
    >
      {props.children}
    </DevToolContext.Provider>
  );
}
