import { UserDataContext } from "../../../App";
import { Time } from "../../../Class";
import { useContext } from "react";
import "../../../styles/Components/main/ScheduleView.scss";

interface Props {
    allocateData:   Array<[[number, number, number, number, number], [number, number, number, number, number], number]>;
    onSectionIndex: number;
}



export default function ScheduleView(props: Props) {
    ///////////////////////////////////////////////////////////////
    // global
    ///////////////////////////////////////////////////////////////
    const userData = useContext(UserDataContext);
    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////






    ///////////////////////////////////////////////////////////////
    // render
    ///////////////////////////////////////////////////////////////
    return (
        <div className="schedule-view-wrapper">
            <ul className="schedule-view-wrapper__tasks-list">
                {props.allocateData.map((data, index) => {
                    const start: Time = new Time(data[0][3], data[0][4]);
                    const end:   Time = new Time(data[1][3], data[1][4]);
                    return (
                        <>
                        {index === props.onSectionIndex
                        ?
                            <li className="schedule-view-wrapper__tasks-list--li onsection" key={"schedule-view-wrapper__tasks-list--li$key=" + index}>
                                <div className="time-box">
                                    <span className="start">{start.getTimeStr()}</span>
                                    <span className="middle">～</span>
                                    <span className="end">{end.getTimeStr()}</span>
                                    <span className="delimiter">:</span>
                                </div>
                                {data[2] !== -1
                                ?
                                    <p className="title">{userData.tasks.getTaskByID(data[2])?.title}</p>
                                :
                                    <p className="title">休憩</p>
                                }
                            </li>
                        :
                            <li className="schedule-view-wrapper__tasks-list--li" key={"schedule-view-wrapper__tasks-list--li$key=" + index}>
                                <div className="time-box">
                                    <span className="start">{start.getTimeStr()}</span>
                                    <span className="middle">～</span>
                                    <span className="end">{end.getTimeStr()}</span>
                                    <span className="delimiter">:</span>
                                </div>
                                {data[2] !== -1
                                ?
                                    <p className="title">{userData.tasks.getTaskByID(data[2])?.title}</p>
                                :
                                    <p className="title">休憩</p>
                                }
                            </li>
                        }
                        </>
                    )
                })}
            </ul>
        </div>
    )
    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////
}