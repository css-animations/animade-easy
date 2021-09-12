import React, { useContext, useState } from "react";
import IconButton from '@material-ui/core/IconButton'
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { DevToolContext } from "../DevToolContext";

function ExportWindow() {
  const { exportedCSS } = useContext(DevToolContext);
  const [text, setText] = useState('Your css will appear here!')

  // if (exportedCSS !== '') {
  //   setText(exportedCSS)
  // }

    const handleCopy = () => {
        navigator.clipboard.writeText(exportedCSS);
    }

    return (
        <div>
            <div>
            Copy to clipboard
            <IconButton onClick={handleCopy}>
                <FileCopyIcon />
            </IconButton>
            </div>
            {exportedCSS}
        </div>
    );
}

export default ExportWindow;
