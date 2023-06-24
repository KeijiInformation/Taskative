import { UserDataContext } from "../../../App";
import { Task, Time } from "../../../Class";
import { NormalBtn } from "../../common";
import ProgressGauge from "./ProgressGauge";
import ScheduleView from "./ScheduleView";
import { useState, useContext, useEffect } from "react";
import "../../../styles/Components/main/MainRunning.scss";



interface Props {
    setContentsID: (id: number) => void;
    setLeftSideRender: (newData: ["main" | "result" | "settings", number, JSX.Element]) => void;
    allocateData: Array<[[number, number, number, number, number], [number, number, number, number, number], number]>;
    onSection: number;
    setonSection: (callback: (prevState: number) => number) => void;
    initParams: () => void;
}



export default function MainRunning(props: Props) {
    //////////////////////////////////////////////////////////////////
    // global
    //////////////////////////////////////////////////////////////////
    const userData = useContext(UserDataContext);
    //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////






    //////////////////////////////////////////////////////////////////
    // on section
    //////////////////////////////////////////////////////////////////
    const [basis, setbasis] = useState<Time>(new Time(userData.contemporary.basis[0], userData.contemporary.basis[1]));
    const [startTime, setstartTime] = useState<Time>(new Time(props.allocateData[props.onSection][0][3], props.allocateData[props.onSection][0][4], basis));
    const [endTime, setendTime] = useState<Time>(new Time(props.allocateData[props.onSection][1][3], props.allocateData[props.onSection][1][4], basis));
    useEffect(() => {
        setbasis(new Time(props.allocateData[0][0][3], props.allocateData[0][0][4]));
    }, [props.allocateData])
    useEffect(() => {
        setstartTime(new Time(props.allocateData[props.onSection][0][3], props.allocateData[props.onSection][0][4], basis));
        setendTime(new Time(props.allocateData[props.onSection][1][3], props.allocateData[props.onSection][1][4], basis));
    }, [props.onSection])
    //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////






    //////////////////////////////////////////////////////////////////
    // on task
    //////////////////////////////////////////////////////////////////
    const [onTask, setonTask] = useState<Task>(() => {
        return userData.tasks.getTaskByID(props.allocateData[props.onSection][2]) as Task;
    })
    const [nextTask, setnextTask] = useState<Task | undefined>(() => {
        if (props.onSection+1 > props.allocateData.length-1) {
            return undefined;
        }
        return userData.tasks.getTaskByID(props.allocateData[props.onSection+1][2]) as Task;
    })
    //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////






    //////////////////////////////////////////////////////////////////
    // on time
    //////////////////////////////////////////////////////////////////
    const [onTime, setOnTime] = useState<Time>(() => {
        const on: Time = new Time();
        on.setFromNow();
        on.basis = basis;
        return on;
    });
    setInterval(() => {
        const on: Time = new Time();
        on.setFromNow();
        on.basis = basis;
        if (on.minutes !== onTime.minutes) {
            setOnTime(on);
        }
        return on;
    }, 1000)
    //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////






    //////////////////////////////////////////////////////////////////
    // calc gauge value
    //////////////////////////////////////////////////////////////////
    const [achievedVal, setachievedVal] = useState<number>(0);
    const [willAchievedVal, setwillAchievedVal] = useState<number>(0);
    useEffect(() => {
        const lastTime: Time = new Time(props.allocateData[props.allocateData.length-1][1][3], props.allocateData[props.allocateData.length-1][1][4], basis);
        if (lastTime.compareTo(onTime) >= 0) {
            setachievedVal(Math.floor(100 * onTime.getTimeValue().getValueAsMin() / lastTime.getTimeValue().getValueAsMin()));
        } else {
            setachievedVal(100);
        }
    }, [onTime])
    useEffect(() => {
        const lastTime: Time = new Time(props.allocateData[props.allocateData.length-1][1][3], props.allocateData[props.allocateData.length-1][1][4], basis);
        const onSectionEnd: Time = new Time(props.allocateData[props.onSection][1][3], props.allocateData[props.onSection][1][4], basis);
        if (lastTime.compareTo(onTime) >= 0) {
            setwillAchievedVal(Math.floor(100 * onSectionEnd.getTimeValue().getValueAsMin() / lastTime.getTimeValue().getValueAsMin()));
        } else {
            setwillAchievedVal(100);
        }
    }, [props.onSection])
    //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////






    //////////////////////////////////////////////////////////////////
    // reposition progress icon
    //////////////////////////////////////////////////////////////////
    useEffect(() => {
        let position = 0;
        if (onTime.compareTo(startTime) >= 0) {
            if (onTime.compareTo(endTime) < 0) {
                position = Math.floor(100 * onTime.differFrom(startTime).getValueAsMin() / endTime.differFrom(startTime).getValueAsMin());
            } else {
                position = 100;
            }
        }
        const targetIcon = document.querySelector(".step-box__now") as HTMLElement;
        targetIcon.style.left = position + "%";
    }, [onTime])
    //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////






    //////////////////////////////////////////////////////////////////
    // schedule dom
    //////////////////////////////////////////////////////////////////
    useEffect(() => {
        props.setLeftSideRender([
            "main",
            0,
            <ScheduleView
                allocateData   = { props.allocateData }
                onSectionIndex = { props.onSection }
            />
        ]);
    }, [props.onSection])
    //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////






    //////////////////////////////////////////////////////////////////
    // move section
    //////////////////////////////////////////////////////////////////
    function moveSection(): undefined {
        props.setonSection(prevState => {
            let newIndex: number = prevState + 1;
            if (newIndex < props.allocateData.length) {
                setonTask(() => {
                    const newTask: Task = userData.tasks.getTaskByID(props.allocateData[newIndex][2]) as Task;
                    return newTask;
                })
                setnextTask(() => {
                    if (newIndex+1 < props.allocateData.length) {
                        const newTask: Task = userData.tasks.getTaskByID(props.allocateData[newIndex+1][2]) as Task;
                        return newTask;
                    } else {
                        return undefined;
                    }
                })
                return newIndex;
            } else {
                endRunning();
                return newIndex-1;
            }
        });
        return;
    }
    //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////






    //////////////////////////////////////////////////////////////////
    // save, end
    //////////////////////////////////////////////////////////////////
    function saveContemporary(): boolean {
        userData.contemporary.onSection = props.onSection;
        userData.contemporary.upload();
        return true;
    }
    useEffect(() => {
        saveContemporary();
    }, [props.onSection])



    function endRunning(): void {
        userData.contemporary.delete();
        props.setContentsID(0);
        props.initParams();
        props.setLeftSideRender([
            "main",
            -1,
            <></>
        ]);
    }
    //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////






    //////////////////////////////////////////////////////////////////
    // render
    //////////////////////////////////////////////////////////////////
    return (
        <div className="main-running-wrapper">



            <div className="main-running-wrapper__progress-gauge-box">
                <ProgressGauge
                    achievedVal     = {achievedVal}
                    willAchievedVal = {willAchievedVal}
                />
            </div>



            <div className="main-running-wrapper__schedule-view-box">
                <ScheduleView
                    allocateData   = { props.allocateData }
                    onSectionIndex = { props.onSection }
                />
            </div>



            <div className="main-running-wrapper__detail-box">
                <div className="main-running-wrapper__detail-box--time">
                    <span className="start">{startTime.getTimeStr()}</span>
                    <div className="step-box">
                        <span className="step-box__now material-symbols-outlined">directions_run</span>
                        <span className="step-box__line"></span>
                    </div>
                    <span className="end">{endTime.getTimeStr()}</span>
                </div>

                <div className="main-running-wrapper__detail-box--title">
                    {onTask
                    ?
                        <p>{onTask.title}</p>
                    :
                        <p>休憩</p>
                    }
                </div>

                <div className="main-running-wrapper__detail-box--next">
                    <p className="next-text">Next</p>
                    <span className="next-icon material-symbols-outlined">double_arrow</span>
                    {nextTask
                    ?
                        <>
                            <p className="next-title">{nextTask.title}</p>
                            <div className="next-section-btn">
                                <NormalBtn
                                    text = "次へ"
                                    callback = {moveSection}
                                />
                            </div>
                        </>
                    :
                        <>
                            <p className="next-title">終了</p>
                            <div className="next-section-btn">
                                <NormalBtn
                                    text = "終了する"
                                    callback = {moveSection}
                                />
                            </div>
                        </>
                    }
                </div>
            </div>
        </div>
    )
    //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////
}