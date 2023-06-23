// import components
import MovePageBtn from "./MovePageBtn";
// import functions
import { useState } from "react";
// import styles
import "../../styles/Components/common/ButtonList.scss";


interface Props {
    setPageState: (targetPage: "main" | "result" | "settings") => void;
}



export default function ButtonList(props: Props) {
    ///////////////////////////////////////////////////////
    // clicked state admin
    ///////////////////////////////////////////////////////
    interface clickedStateType {
        main:     boolean;
        result:   boolean;
        settings: boolean;
    }
    const [clickedState, setClickedState] = useState<clickedStateType>(
        {
            "main": true,
            "result": false,
            "settings": false,
        }
    )
    ///////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////






    ///////////////////////////////////////////////////////
    // clicked class admin
    ///////////////////////////////////////////////////////
    function clickedEvent(targetPage: "main" | "result" | "settings"): void {
        // すでにclickされているかどうかの判定
        if (clickedState[targetPage]) {
            return;
        }
        // clickedStateの更新
        setClickedState(() => {
            const newState: clickedStateType = {
                "main": false,
                "result": false,
                "settings": false,
            }
            newState[targetPage] = true;
            return newState;
        })
        // ページの変更
        props.setPageState(targetPage);
    }
    ///////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////






    ///////////////////////////////////////////////////////
    // render
    ///////////////////////////////////////////////////////
    return (
        <ul className="button-list-wrapper">
            <li className="button-list-wrapper__move-page-btn main">
                <MovePageBtn
                    icon     = { "schedule" }
                    title    = { "main"   }
                    clicked  = {clickedState["main"]}
                    callback = { () => clickedEvent("main") }
                />
            </li>
            <li className="button-list-wrapper__move-page-btn result">
                <MovePageBtn
                    icon     = { "bar_chart" }
                    title    = { "result"   }
                    clicked  = {clickedState["result"]}
                    callback = { () => clickedEvent("result") }
                />
            </li>
            <li className="button-list-wrapper__move-page-btn settings">
                <MovePageBtn
                    icon     = { "settings" }
                    title    = { "settings"   }
                    clicked  = {clickedState["settings"]}
                    callback = { () => clickedEvent("settings") }
                />
            </li>
        </ul>
    )
    ///////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////
}