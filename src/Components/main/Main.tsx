import { CSSTransition } from "react-transition-group";
import { useState, useEffect, useContext } from 'react';
import { MainInput, MainTop, MainRunning } from "./Components";
import { Time, TimeAllocater } from "../../Class";
import "../../styles/Components/main/Main.scss";
import { UserDataContext } from "../../App";
import { Tasks } from "../../Class/data";


interface Props {
    setLeftSideRender: (newState: ["main" | "result" | "settings", number, JSX.Element]) => void;
}



export default function Main(props: Props) {
    /////////////////////////////////////////////////////////////////////
    // global
    /////////////////////////////////////////////////////////////////////
    const userData = useContext(UserDataContext);
    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////






    /////////////////////////////////////////////////////////////////////
    // contents transition state
    /////////////////////////////////////////////////////////////////////
    const [contentsID, setContentsID] = useState<number>(0);
    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////






    /////////////////////////////////////////////////////////////////////
    // input data
    /////////////////////////////////////////////////////////////////////
    const [startTime, setStartTime] = useState<Time>(() => {
        const now: Time = new Time();
        now.setFromNow();
        now.ceilToJustTime(userData.config.timeStep);
        now.basis = now.copy();
        return now;
    })
    useEffect(() => {
        if (!startTime.isSet()) {
            setStartTime(() => {
                const now: Time = new Time();
                now.setFromNow();
                now.ceilToJustTime(userData.config.timeStep);
                now.basis = now.copy();
                return now;
            })
        }
    }, [startTime])
    const [endTime, setEndTime] = useState<Time>(new Time());
    const [breakTime, setBreakTime] = useState<Array<[Time, Time]>>([]);
    const [tasks, setTasks] = useState<Tasks>(userData.tasks.copy());
    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////






    /////////////////////////////////////////////////////////////////////
    // allocate data
    /////////////////////////////////////////////////////////////////////
    const [onSection, setonSection] = useState<number>(() => {
        if (userData.contemporary.onSection < 0) {
            return 0;
        } else {
            return userData.contemporary.onSection;
        }
    })
    const [allocateData, setAllocateData] = useState< Array<[[number, number, number, number, number], [number, number, number, number, number], number]> >(() => {
        if (userData.contemporary.onSection < 0) {
            return [];
        } else {
            return userData.contemporary.data;
        }
    });
    useEffect(() => {
        if (allocateData.length !== 0) {
            setContentsID(3);
        }
    }, [allocateData])
    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////






    /////////////////////////////////////////////////////////////////////
    // errors
    /////////////////////////////////////////////////////////////////////
    const [tasksInputError, setTasksInputError] = useState<[boolean, string]>([true, ""]);
    function validateTasksInput(): boolean {
        // num of tasks is 0
        if (tasks.data.length === 0) {
            setTasksInputError([false, "タスクを1つ以上選択してください。"]);
            return false;
        }
        return true;
    }
    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////






    /////////////////////////////////////////////////////////////////////
    // スケジューリングの開始
    /////////////////////////////////////////////////////////////////////
    useEffect(() => {
        if (contentsID === 2) {
            const timeAllocater: TimeAllocater = new TimeAllocater(startTime, endTime, breakTime, tasks, userData.config.timeStep);
            const allocateResult: Array< [Time, Time, number] > = timeAllocater.allocate(false);
            console.log(allocateResult);
            // データの作成
            let onDate = new Date();
            const createdData: Array<[[number, number, number, number, number], [number, number, number, number, number], number]> = [];
            allocateResult.forEach(elem => {
                // 日付の検出
                let dateDifference = 0;
                if (elem[1].getValueAsMin() - elem[0].getValueAsMin() < 0) {
                    dateDifference = 1;
                }
                // データ生成
                const newData: [[number, number, number, number, number], [number, number, number, number, number], number] = [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], 0];
                newData[0] = [onDate.getFullYear(), onDate.getMonth()+1, onDate.getDate(), elem[0].hours, elem[0].minutes];
                onDate.setDate( onDate.getDate() + dateDifference );
                newData[1] = [onDate.getFullYear(), onDate.getMonth()+1, onDate.getDate(), elem[1].hours, elem[1].minutes];
                if (elem[2] !== -1) {
                    newData[2] = elem[2];
                } else {
                    newData[2] = -1;
                }
                // 格納
                createdData.push(newData);
            })
            // allocateDataへの格納
            setAllocateData(createdData);
            // Contemporaryへの提出
            createdData.forEach((section, index) => {
                userData.contemporary.add(section, index);
            })
            const basis: Time = new Time();
            basis.setFromNow();
            basis.basis = basis.copy();
            userData.contemporary.onSection = 0;
            userData.contemporary.basis     = [basis.hours, basis.minutes];
            userData.contemporary.upload();
        }
    }, [contentsID])
    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////






    /////////////////////////////////////////////////////////////////////
    // init Params
    /////////////////////////////////////////////////////////////////////
    function initParams(): void {
        setStartTime(new Time());
        setEndTime(new Time());
        setBreakTime([]);
        setonSection(0);
        setTasks(userData.tasks.copy());
    }
    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////






    /////////////////////////////////////////////////////////////////////
    // render
    /////////////////////////////////////////////////////////////////////
    return (
        <div className="main-page-wrapper">

            {/* top */}
            <CSSTransition
                in      = { contentsID === 0 }
                timeout = {600}
                unmountOnExit
            >
                <MainTop
                    setContentsID      = { setContentsID }
                    tasks              = { tasks }
                    setTasks           = { setTasks }
                    validateTasksInput = { validateTasksInput }
                    tasksInputError    = { tasksInputError }
                />
            </CSSTransition>



            {/* input */}
            <CSSTransition
                in      = { contentsID === 1 }
                timeout = {600}
                unmountOnExit
            >
                <MainInput
                    setContentsID = { setContentsID }
                    setStartTime  = { setStartTime  }
                    setEndTime    = { setEndTime    }
                    setBreakTime  = { setBreakTime  }
                    setonSection  = { setonSection }
                    startTime     = { startTime     }
                    endTime       = { endTime       }
                    breakTime     = { breakTime     }
                />
            </CSSTransition>



            {/* running */}
            <CSSTransition
                in      = { contentsID === 3 }
                timeout = {600}
                unmountOnExit
            >
                <MainRunning
                    setContentsID     = { setContentsID }
                    allocateData      = { allocateData  }
                    setLeftSideRender = { props.setLeftSideRender }
                    onSection         = { onSection }
                    setonSection      = { setonSection }
                    initParams        = { initParams }
                />
            </CSSTransition>
        </div>
    )
    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////
}