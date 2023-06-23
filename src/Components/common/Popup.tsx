import { useEffect } from "react";
import "../../styles/Components/common/Popup.scss";



interface Props {
    contents: JSX.Element;
}



export default function Popup(props: Props) {
    ///////////////////////////////////////////////////
    // scroll stop
    ///////////////////////////////////////////////////
    function preventScroll(event: WheelEvent | TouchEvent) {
        event.preventDefault();
    }
    useEffect(() => {
        window.addEventListener("wheel", preventScroll, {passive: false});
        window.addEventListener("touchmove", preventScroll, {passive: false});
        return (
            () => {
                window.removeEventListener("wheel", preventScroll);
                window.removeEventListener("touchmove", preventScroll);
            }
        )
    }, [])
    ///////////////////////////////////////////////////
    ///////////////////////////////////////////////////
    ///////////////////////////////////////////////////






    ///////////////////////////////////////////////////
    // render
    ///////////////////////////////////////////////////
    return (
        <div className="popup-wrapper">
            <div className="popup-wrapper__mask"></div>
            <div className="popup-wrapper__contents-box">
                <span className="popup-wrapper__contents-box--border-top"></span>
                <span className="popup-wrapper__contents-box--border-right"></span>
                <span className="popup-wrapper__contents-box--border-bottom"></span>
                <span className="popup-wrapper__contents-box--border-left"></span>
                {props.contents}
            </div>
        </div>
    )
    ///////////////////////////////////////////////////
    ///////////////////////////////////////////////////
    ///////////////////////////////////////////////////
}