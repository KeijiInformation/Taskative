import "../../../styles/Components/main/ProgressGauge.scss";
import { useEffect } from "react";



interface Props {
    achievedVal: number;
    willAchievedVal: number;
}



export default function ProgressGauge(props: Props) {
    //////////////////////////////////////////////////////////////////////
    // gauge style
    //////////////////////////////////////////////////////////////////////
    useEffect(() => {
        const achievedDOM = document.querySelector<HTMLElement>(".progress-gauge-wrapper__achieved");
        if (achievedDOM) {
            achievedDOM.style.width = props.achievedVal + "%";
        }
    }, [props.achievedVal])
    useEffect(() => {
        const willAchievedDOM = document.querySelector<HTMLElement>(".progress-gauge-wrapper__will-achieved");
        if (willAchievedDOM) {
            willAchievedDOM.style.width = props.willAchievedVal + "%"
        }

    }, [props.willAchievedVal])
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////






    //////////////////////////////////////////////////////////////////////
    // render
    //////////////////////////////////////////////////////////////////////
    return (
        <div className="progress-gauge-wrapper">
            <p className="progress-gauge-wrapper__text">{props.achievedVal + "%"}</p>
            <span className="progress-gauge-wrapper__achieved"></span>
            <span className="progress-gauge-wrapper__will-achieved"></span>
        </div>
    )
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////
}