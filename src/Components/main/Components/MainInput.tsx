import TimeInput from "./TimeInput";
import BreakTimeInput from "./BreakTimeInput";
import { AddBtn, NormalBtn } from "../../common";
import { Time } from "../../../Class";
import "../../../styles/Components/main/MainInput.scss";
import { useState, useContext } from "react";
import { UserDataContext } from "../../../App";



interface Props {
    setContentsID: (id: number) => void;
    setStartTime:  (data: Time) => void;
    setEndTime:    (data: Time) => void;
    setBreakTime:  (callback: (prevState: Array<[Time, Time]> ) => Array<[Time, Time]>) => void;
    setonSection:  (React.Dispatch<React.SetStateAction<number>>)
    startTime:     Time;
    endTime:       Time;
    breakTime:     Array<[Time, Time]>;
}



export default function MainInput(props: Props) {
    ////////////////////////////////////////////////////////////
    // global
    ////////////////////////////////////////////////////////////
    const userData = useContext(UserDataContext);
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////






    ////////////////////////////////////////////////////////////
    // errorStates
    ////////////////////////////////////////////////////////////
    const [addBreakTimeError, setAddBreakTimeError] = useState<[boolean, string]>([true, ""]);
    const [breakTimeInputError, setBreakTimeInputError] = useState<[boolean, string]>([true, ""]);
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////






    ////////////////////////////////////////////////////////////
    // validate input time
    ////////////////////////////////////////////////////////////
    function validateBreakStart(time: Time, targetIndex: number): boolean {
        // out of range
        if (time.compareTo(props.endTime) >= 0) {
            setBreakTimeInputError([false, `終了時間${props.endTime.getHoursStr()}:${props.endTime.getMinStr()}を超えています。`]);
            return false;
        }
        // start is learger than end
        if (props.breakTime[targetIndex][1].isSet() && time.compareTo(props.breakTime[targetIndex][1]) >= 0) {
            setBreakTimeInputError([false, `休憩終了時間${props.breakTime[targetIndex][1].getTimeStr()}よりも前の時間を入力してください。`]);
            return false;
        }
        // start is near scheduleStart time
        const minLimit: Time = new Time(props.startTime.hours, props.startTime.minutes, props.startTime);
        minLimit.add(userData.config.timeStep + 5);
        if (time.differFrom(minLimit).getValueAsMin() <= 0) {
            setBreakTimeInputError([false, `開始時間${props.startTime.getTimeStr()}に近すぎます。${minLimit.getTimeStr()}以降の時間を入力してください。`]);
            return false;
        }
        // start is near other break
        let result = true;
        props.breakTime.forEach((breaktime, index) => {
            if (Math.abs(time.differFrom(breaktime[1]).getValueAsMin()) <= userData.config.timeStep + 5 && index !== targetIndex) {
                setBreakTimeInputError([false, `他の休憩時間${breaktime[1].getTimeStr()}から5分以上間隔を空けてください。`]);
                result = false;
            }
        })
        if (!result) {
            return false;
        }
        setBreakTimeInputError([true, ""]);
        return true;
    }

    function validateBreakEnd(starbreak: Time, endbreak: Time, targetIndex: number): boolean {
        // do not set break start
        if (!starbreak.isSet()) {
            setBreakTimeInputError([false, "休憩を開始する時間を入力して下さい。"]);
            return false;
        }
        // smaller than start
        if (starbreak.compareTo(endbreak) >= 0) {
            setBreakTimeInputError([false, `休憩開始${starbreak.getHoursStr()}:${starbreak.getMinStr()}よりも後の時間を入力して下さい。`]);
            return false;
        }
        // out of range
        if (endbreak.compareTo(props.endTime) > 0) {
            setBreakTimeInputError([false, `終了時間${props.endTime.getHoursStr()}:${props.endTime.getMinStr()}を超えています。`]);
            return false;
        }
        // duplication breaktime range
        let result: boolean = true;
        props.breakTime.forEach((breaktime, index) => {
            if (breaktime[0].isSet() && breaktime[1].isSet() && index !== targetIndex) {
                if (!(endbreak.compareTo(breaktime[0]) < 0 || starbreak.compareTo(breaktime[1]) > 0)) {
                    // console.log(`${starbreak.getTimeStr()}~${endbreak.getTimeStr()}, ${breaktime[0].getTimeStr()}~${breaktime[1].getTimeStr()}`);
                    setBreakTimeInputError([false, "他の休憩時間と重複しています。"]);
                    result = false;
                }
            }
        })
        if (!result) {
            return false;
        }
        // end is near shceduleEnd
        const maxLimit: Time = new Time(props.endTime.hours, props.endTime.minutes, props.startTime);
        maxLimit.add(-(userData.config.timeStep + 5));
        if (endbreak.differFrom(maxLimit).getValueAsMin() >= 0) {
            setBreakTimeInputError([false, `終了時間${props.endTime.getTimeStr()}に近すぎます。${maxLimit.getTimeStr()}より前の時間を入力してください。`])
            return false;
        }
        // end is near other break
        result = true;
        props.breakTime.forEach((breaktime, index) => {
            if (Math.abs(endbreak.differFrom(breaktime[0]).getValueAsMin()) <= userData.config.timeStep + 5 && index !== targetIndex) {
                setBreakTimeInputError([false, `他の休憩時間${breaktime[0].getTimeStr()}から5分以上間隔を空けてください。`]);
                result = false;
            }
        })
        if (!result) {
            return false;
        }
        setBreakTimeInputError([true, ""]);
        return true;
    }
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////






    ////////////////////////////////////////////////////////////
    // handleSetTime
    ////////////////////////////////////////////////////////////
    function handleSetTime(event: React.ChangeEvent<HTMLInputElement>, identifier: "endtime" | "breaktime", index?: number, whichInput?: "start" | "end"): void {
        const strData: string[] = event.target.value.split(":");
        const newTime: Time     = new Time(Number(strData[0]), Number(strData[1]), props.startTime);
        if (newTime.minutes % 10 < 3) {
            newTime.floorToJustTime(userData.config.timeStep);
        } else {
            newTime.ceilToJustTime(userData.config.timeStep);
        }
        let validateResult: boolean = true;

        // 終了時間の入力
        if (identifier === "endtime") {
            props.setEndTime( newTime );


        // 休憩時間の入力
        } else if (identifier === "breaktime" && index !== undefined) {

            // 休憩開始時間の入力
            if (whichInput === "start") {
                // バリデーション
                validateResult = validateBreakStart(newTime, index);
                if (!validateResult) {
                    return;
                }
                // 登録
                props.setBreakTime(prevState => {
                    prevState[index][0] = newTime;
                    return [...prevState];
                })

            // 休憩終了時間の入力
            } else if (whichInput === "end") {
                // バリデーション
                validateResult = validateBreakEnd(props.breakTime[index][0], newTime, index);
                if (!validateResult) {
                    return;
                }
                // 登録
                props.setBreakTime(prevState => {
                    prevState[index][1] = newTime;
                    return [...prevState];
                })
            }
        }
    }
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////






    ////////////////////////////////////////////////////////////
    // breaktime input list
    ////////////////////////////////////////////////////////////
    function addBreakTime(): void {
        props.setBreakTime(prevState => {
            if (props.endTime.isSet()) {
                if (prevState.length === 0 || (prevState[prevState.length-1][0].isSet() && prevState[prevState.length-1][1].isSet())) {
                    prevState.push([new Time(), new Time()]);
                    setAddBreakTimeError([true, ""]);
                    return [...prevState];
                } else {
                    // setAddBreakTimeError([false, "上の欄の入力が完了していません。"]);
                }
            } else {
                setAddBreakTimeError([false, "終了時間を入力してください。"]);
            }
            return prevState;
        })
    }

    function deleteBreakTime(index: number): void {
        props.setBreakTime(prevState => {
            prevState.splice(index, 1);
            return [...prevState];
        })
    }
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////






    ////////////////////////////////////////////////////////////
    // start scheduling
    ////////////////////////////////////////////////////////////
    function startScheduling(): boolean {
        if (props.endTime.isSet()) {
            // 未入力のbreaktimeの削除
            const deleteTargets: number[] = [];
            props.breakTime.forEach((time, index) => {
                if (!(time[0].isSet() && time[1].isSet())) {
                    deleteTargets.push(index);
                }
            })
            props.setBreakTime((prevState) => {
                for (let i:number = deleteTargets.length-1; i >= 0; i--) {
                    prevState.splice(deleteTargets[i], 1);
                }
                prevState.sort((a, b) => {
                    return a[0].compareTo(b[0]);
                })
                return [...prevState];
            })
            props.setonSection(0);
            // contentsIDの更新
            props.setContentsID(2);
            return true;
        }
        return false;
    }
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////






    ////////////////////////////////////////////////////////////
    // render
    ////////////////////////////////////////////////////////////
    return (
        <div className="main-input-wrapper">
            <div className="main-input-wrapper__end-time-input-box">
                <p className="main-input-wrapper__end-time-input-box--message">終了時間を設定してください</p>
                <div className="main-input-wrapper__end-time-input-box--input">
                    <TimeInput
                        timeData      = { props.endTime }
                        handleSetTime = { (event: React.ChangeEvent<HTMLInputElement>) => handleSetTime(event, "endtime") }
                    />
                </div>
            </div>
            <div className="main-input-wrapper__break-time-input-box">
                <ul className="main-input-wrapper__break-time-input-box--input-list">
                    {props.breakTime.map((breaktime, index) => {
                        return (
                            <li className="break-time-input" key={"break-time-input$key=" + index}>
                                <BreakTimeInput
                                    handleSetTime = { (event: React.ChangeEvent<HTMLInputElement>, whichInput: "start" | "end") => handleSetTime(event, "breaktime", index, whichInput) }
                                    index         = { index }
                                    breakTime     = { breaktime }
                                    handleDelete  = { () => deleteBreakTime(index) }
                                />
                                {(!breakTimeInputError[0] && index === props.breakTime.length-1) && <p className="break-time-input-message error-message">{breakTimeInputError[1]}</p>}
                            </li>
                        )
                    })}
                </ul>
                <div className="main-input-wrapper__break-time-input-box--add-breaktime-btn-wrapper">
                    <AddBtn
                        text     = "休憩時間を追加"
                        callback = { addBreakTime }
                    />
                    {!addBreakTimeError[0] && <p className="add-break-time-error-message error-message">{addBreakTimeError[1]}</p>}
                </div>
            </div>
            <NormalBtn
                text     = "開始"
                callback = { startScheduling }
            />
        </div>
    )
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
}