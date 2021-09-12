import React, {useState} from "react";
import IconButton from '@material-ui/core/IconButton'
import FileCopyIcon from '@material-ui/icons/FileCopy';

function ExportWindow() {
    const [text, setText] = useState('The quick brown fox jumped over the lazy dog.')

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
    }

    return (
        <div className="EWWrapper">
            <div className = "EWTop" onClick={handleCopy}>
                Copy to clipboard
            <IconButton>
                <FileCopyIcon
                style={{ color: "#F1FFF3" }}
                    />
            </IconButton>
            </div>
            <div className="EWCode">
                {text}
            </div>
        </div>
    );
}

export default ExportWindow;