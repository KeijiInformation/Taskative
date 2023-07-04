import { UserDataContext } from "../../../App";
import { useContext, useEffect } from "react";
import { Task } from "../../../Class";
import "../../../styles/Components/result/TimeGraph.scss";

interface Props {
    idsArr: number[];
    actualMinutesArr: number[],
    idealMinutesArr: number[],
}


export default function TimeGraph(props: Props) {
    //////////////////////////////////////////////////////////////////////////////////////
    // global
    //////////////////////////////////////////////////////////////////////////////////////
    const userData = useContext(UserDataContext);
    //////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////






    //////////////////////////////////////////////////////////////////////////////////////
    // view graph
    //////////////////////////////////////////////////////////////////////////////////////
    useEffect(() => {
        // 目標値の設定
        let maxVal: number = 0;
        props.actualMinutesArr.forEach(min => {
            if (maxVal < min) {
                maxVal = min;
            }
        })
        let aimVal = 60;
        while (aimVal < maxVal) {
            aimVal *= 10;
        }
        // 描画
        props.idsArr.forEach((id, index) => {
            // 目標値の設定
            // let aimVal = props.idealMinutesArr[index];
            // while (aimVal <= props.actualMinutesArr[index]) {
            //     aimVal += props.idealMinutesArr[index];
            // }
            const gaugeValue: HTMLSpanElement = document.querySelector(`.time-graph-wrapper__tasks-list--task.task-id${id} .gauge__box--value`) as HTMLSpanElement;
            gaugeValue.style.width = (100 * props.actualMinutesArr[index] / aimVal) + "%";
        })
    }, [props.actualMinutesArr, props.idealMinutesArr, props.idsArr])
    //////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////






    //////////////////////////////////////////////////////////////////////////////////////
    // render
    //////////////////////////////////////////////////////////////////////////////////////
    return (
        <div className="time-graph-wrapper">
            <ul className="time-graph-wrapper__tasks-list">
                {props.idsArr.map((taskID, index) => {
                    const task: Task | undefined = userData.tasks.getTaskByID(taskID);
                    if (task) {
                        return (
                            <li className={`time-graph-wrapper__tasks-list--task task-id${task.id}`} key={"time-graph-wrapper__tasks-list--task#" + index}>
                                <div className="gauge">
                                    <div className="gauge__box">
                                        <span className="gauge__box--title">{task.title}</span>
                                        <span className="gauge__box--value"></span>
                                    </div>
                                </div>
                                <div className="time">
                                    <span className="time__value">{props.actualMinutesArr[index]}</span>
                                    <span className="time__unit">分</span>
                                </div>
                            </li>
                        )
                    }
                    return undefined;
                })}
            </ul>
        </div>
    )
    //////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////
}