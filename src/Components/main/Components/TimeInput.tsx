import { Time } from "../../../Class";
import "../../../styles/Components/main/TimeInput.scss";



interface Props {
    handleSetTime: (event: React.ChangeEvent<HTMLInputElement>) => void;
    timeData: Time;
}


export default function TimeInput(props: Props) {
    return (
        <div className="time-input-wrapper">
            {props.timeData.isSet()
            ?
                <input className="time-input-wrapper__input" type="time" value={`${props.timeData.getHoursStr()}:${props.timeData.getMinStr()}`} onChange={(event) => props.handleSetTime(event)}/>
            :
                <input className="time-input-wrapper__input" type="time" onChange={(event) => props.handleSetTime(event)}/>
            }
        </div>
    )
}