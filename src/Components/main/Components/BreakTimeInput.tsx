import TimeInput from "./TimeInput";
import { DeleteBtn } from "../../common";
import { Time } from "../../../Class";
import "../../../styles/Components/main/BreakTimeInput.scss";



interface Props {
    handleSetTime: (event: React.ChangeEvent<HTMLInputElement>, whichInput: "start" | "end") => void;
    breakTime: [Time, Time];
    handleDelete: () => void;
    index: number;
}



export default function BreakTimeInput(props: Props) {
    ///////////////////////////////////////////////////
    // handleSetTime
    ///////////////////////////////////////////////////
    function handleSetTime(event: React.ChangeEvent<HTMLInputElement>, whichInput: "start" | "end"): void {
        props.handleSetTime(event, whichInput);
    }
    ///////////////////////////////////////////////////
    ///////////////////////////////////////////////////
    ///////////////////////////////////////////////////






    ///////////////////////////////////////////////////
    // render
    ///////////////////////////////////////////////////
    return (
        <div className="break-time-input-wrapper">
            <div className="break-time-input-wrapper__start-time-input-wrapper">
                <TimeInput
                    handleSetTime = { (event: React.ChangeEvent<HTMLInputElement>) => handleSetTime(event, "start") }
                    timeData      =  {props.breakTime[0] }
                />
            </div>
            <p className="break-time-input-wrapper__middle-text">～</p>
            <div className="break-time-input-wrapper__start-time-input-wrapper">
                <TimeInput
                    handleSetTime = { (event: React.ChangeEvent<HTMLInputElement>) => handleSetTime(event, "end") }
                    timeData      = { props.breakTime[1] }
                />
            </div>
            <div className="break-time-input-wrapper__delete-btn-wrapper">
                <DeleteBtn
                    callback = { props.handleDelete }
                />
            </div>
        </div>
    )
    ///////////////////////////////////////////////////
    ///////////////////////////////////////////////////
    ///////////////////////////////////////////////////
}