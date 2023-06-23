import { useState } from "react";
import "../../styles/Components/common/NormalBtn.scss";



interface Props {
    text: string;
    callback: () => boolean | Promise<boolean> | undefined;
    canClick?: boolean;
}



export default function NormalBtn(props: Props) {
    props = {
        canClick: true,
        ...props
    }
    /////////////////////////////////////////////////////
    // click event
    /////////////////////////////////////////////////////
    const [isClicked, setIsClicked] = useState<boolean>(false);
    function handleClick(): void {
        if (isClicked) {
            return;
        }
        let callbackCalled = props.callback();
        if (callbackCalled) {
            setIsClicked(true);
        }
    }
    /////////////////////////////////////////////////////
    /////////////////////////////////////////////////////
    /////////////////////////////////////////////////////






    /////////////////////////////////////////////////////
    // render
    /////////////////////////////////////////////////////
    return (
        <div className={`normal-btn-wrapper ${isClicked ? "clicked" : ""} ${props.canClick ? "canClick" : "cantClick"}`}>
            <button className="normal-btn-wrapper__btn" onClick={handleClick}>{props.text}</button>
        </div>
    )
    /////////////////////////////////////////////////////
    /////////////////////////////////////////////////////
    /////////////////////////////////////////////////////
}