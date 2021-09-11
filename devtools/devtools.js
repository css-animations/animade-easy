/**
 This script is run whenever the devtools are open.
 In here, we can create our panel.
 */

function handleShown() {
  console.log("panel is being shown");
}

function handleHidden() {
  console.log("panel is being hidden");
}

/**
 Create a panel, and add listeners for panel show/hide events.
 */
chrome.devtools.panels
  .create("My Panel", "/public/logo192.png", "/build/index.html", panel => {
      panel.onShown.addListener(handleShown);
      panel.onHidden.addListener(handleHidden);
    }
  )
