import React, {useState} from "react";
import IconButton from '@material-ui/core/IconButton'
import FileCopyIcon from '@material-ui/icons/FileCopy';

function ExportWindow() {
    const [text, setText] = useState('The quick brown fox jumped over the lazy dog.')

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
    }

    return (
        <div>
            <div>
            Copy to clipboard
            <IconButton onClick={handleCopy}>
                <FileCopyIcon />
            </IconButton>
            </div>
            {text}
        </div>
    );
}

export default ExportWindow;