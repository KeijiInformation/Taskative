import { CSSTransition } from "react-transition-group";
import { useState, useEffect, useContext } from 'react';
import { MainInput, MainTop, MainRunning, AllocateCanditateList } from "./Components";
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
    const [allocateDataCanditate, setallocateDataCanditate] = useState< Array<Array<[[number, number, number, number, number], [number, number, number, number, number], number]>> >([]);
    const [allocateData, setAllocateData] = useState< Array<[[number, number, number, number, number], [number, number, number, number, number], number]> >(() => {
        if (userData.contemporary.onSection < 0) {
            return [];
        } else {
            return userData.contemporary.data;
        }
    });
    function descideAllocate(index: number) {
        const target: Array<[[number, number, number, number, number], [number, number, number, number, number], number]> = allocateDataCanditate[index];
        setAllocateData(target);
        // Contemporaryへの提出
        target.forEach((section, index) => {
            userData.contemporary.add(section, index);
        })
        const basis: Time = new Time();
        basis.setFromNow();
        userData.contemporary.onSection = 0;
        userData.contemporary.basis     = [basis.hours, basis.minutes];
        userData.contemporary.upload();
    }
    useEffect(() => {
        if (allocateData.length !== 0) {
            const today: Date = new Date();
            const onTime: Time = new Time();
            onTime.setFromNow();
            onTime.basis = new Time(userData.contemporary.basis[0], userData.contemporary.basis[1]);
            userData.result.setStartTime(today, allocateData[onSection][2], onTime);
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
            const allocateResult: Array<Array<[[number, number, number, number, number], [number, number, number, number, number], number]>> = timeAllocater.allocate(userData.config.schedulingByOrder);
            // allocateDataへの格納
            setallocateDataCanditate(allocateResult);
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
                    setonSection  = { setonSection  }
                    startTime     = { startTime     }
                    endTime       = { endTime       }
                    breakTime     = { breakTime     }
                />
            </CSSTransition>



            {/* selectAllocate */}
            <CSSTransition
                in      = { contentsID === 2 }
                timeout = {600}
                unmountOnExit
            >
                <AllocateCanditateList
                    descideAllocate = {descideAllocate}
                    canditateList   = {allocateDataCanditate}
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