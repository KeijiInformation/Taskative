import { CSSTransition } from "react-transition-group"
import { useState, useContext, useEffect } from "react";
import { TasksView, Popup } from "../common";
import { UserDataContext } from "../../App";
import TaskPop from "../common/TaskPop";
import { Task } from "../../Class";
import "../../styles/Components/settings/Settings.scss";



export default function Settings() {
    //////////////////////////////////////////////////////////////////////
    // global
    //////////////////////////////////////////////////////////////////////
    const userData   = useContext(UserDataContext);
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////






    //////////////////////////////////////////////////////////////////////
    // popup
    //////////////////////////////////////////////////////////////////////
    const [isEditPop,   setisEditPop]   = useState<boolean>(false);
    const [isAddPop,    setisAddPop]    = useState<boolean>(false);
    const [isDeletePop, setisDeletePop] = useState<boolean>(false);
    useEffect(() => {
        if (!isEditPop && !isAddPop && !isDeletePop) {
            setTimeout(() => {
                settargetTask(undefined);
            }, 1000)
        }
    }, [isEditPop, isAddPop, isDeletePop])
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////






    //////////////////////////////////////////////////////////////////////
    // target task
    //////////////////////////////////////////////////////////////////////
    const [targetTask, settargetTask] = useState<Task | undefined>(undefined);
    useEffect(() => {
        if (targetTask) {
            if (targetTask.id >= 0) {
                setisEditPop(true);
            } else {
                setisAddPop(true);
            }
        }
    }, [targetTask])
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////






    //////////////////////////////////////////////////////////////////////
    // render
    //////////////////////////////////////////////////////////////////////
    return (
        <div className="settings-page-wrapper">

            {/* add popup */}
            <CSSTransition
                in = {isAddPop}
                timeout = {500}
                unmountOnExit
            >
                <Popup
                    contents = {<TaskPop task={targetTask as Task} tasks={userData.tasks} setisPop={setisAddPop}/>}
                />
            </CSSTransition>

            {/* edit popup */}
            <CSSTransition
                in = {isEditPop}
                timeout = {500}
                unmountOnExit
            >
                <Popup
                    contents = {<TaskPop task={targetTask as Task} tasks={userData.tasks} setisPop={setisEditPop}/>}
                />
            </CSSTransition>

            {/* delete popup */}
            <CSSTransition
                in = {isDeletePop}
                timeout = {1000}
                unmountOnExit
            >
                <></>
            </CSSTransition>



            <div className="settings-page-wrapper__tasks-view-box">
                <TasksView
                    tasks         = {userData.tasks}
                    needSubmit    = {true}
                    settargetTask = {settargetTask}
                />
            </div>
        </div>
    )
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////
}