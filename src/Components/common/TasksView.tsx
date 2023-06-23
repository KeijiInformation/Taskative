import { Tasks } from "../../Class/data";
import { useState } from "react";
import IconBtn from "./IconBtn";
import "../../styles/Components/common/TasksView.scss";
import { Task } from "../../Class";



interface Props {
    tasks: Tasks;
    needSubmit: boolean;
    settargetTask: (newState: Task) => void;
}



export default function TasksView(props: Props) {
    /////////////////////////////////////////////////////////////////
    // reload flag
    /////////////////////////////////////////////////////////////////
    const [reload, setreload] = useState<boolean>(true);
    /////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////






    /////////////////////////////////////////////////////////////////
    // copy data
    /////////////////////////////////////////////////////////////////
    const tasksData: Tasks = props.tasks;
    tasksData.sortByOrder(true);
    /////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////






    /////////////////////////////////////////////////////////////////
    // set operate flag
    /////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////
    const [editOperate,        seteditOperate]        = useState<boolean>(false);
    const [changeOrderOperate, setchangeOrderOperate] = useState<boolean>(false);
    function setOperation(target: "edit" | "changeOrder"): void {
        if (target === "edit") {
            seteditOperate(prevState => {
                setchangeOrderOperate(false);
                return !prevState;
            })
        } else {
            setchangeOrderOperate(prevState => {
                seteditOperate(false);
                return !prevState;
            })
        }
    }
    /////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////






    /////////////////////////////////////////////////////////////////
    // change order
    /////////////////////////////////////////////////////////////////
    function changeOrder(taskID: number, operate: "up" | "down"): void {
        const targetTask: Task | undefined = tasksData.getTaskByID(taskID);
        if (!targetTask) {
            return;
        }
        if (operate === "up") {
            // tasksの更新
            if (tasksData.upOrder(targetTask)) {
                setreload(prevState => {return !prevState});
            }
        } else {
            // tasksの更新
            if (tasksData.downOrder(targetTask)) {
                setreload(prevState => {return !prevState});
            }
        }
    }
    /////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////






    /////////////////////////////////////////////////////////////////
    // render
    /////////////////////////////////////////////////////////////////
    return (
        <div className="tasks-view-wrapper">
            <div className="tasks-view-wrapper__oparate-btns-box">
                <IconBtn
                    iconName = "add"
                    callback = {() => props.settargetTask(new Task("", -1, "", -1, -1, false, [-1, -1, -1], [false, -1, -1, -1], -1, false))}
                    border   = {false}
                />
                <IconBtn
                    iconName = "edit"
                    callback = {() => setOperation("edit")}
                    border   = {editOperate}
                />
                <IconBtn
                    iconName = "swap_vert"
                    callback = {() => setOperation("changeOrder")}
                    border   = {changeOrderOperate}
                />
            </div>
            {props.tasks.data.length === 0
            ?
                <p className="tasks-view-wrapper__no-task-message">タスクを登録しましょう</p>
            :
                <ul className="tasks-view-wrapper__tasks-list">
                {tasksData.data.map((task, index) => {
                    if (task.id === -1 || task.deleted[0]) {
                        return undefined;
                    }
                    return (
                        <li className="tasks-view-wrapper__tasks-list--task" key={"tasks-view-wrapper__tasks-list--task#"+index}>
                            <div className={`change-order-btns-box ${changeOrderOperate}`}>
                                <div className="change-order-btns-box__up-btn">
                                    <IconBtn
                                        iconName = "arrow_drop_up"
                                        callback = {() => changeOrder(task.id, "up")}
                                        border   = {false}
                                    />
                                </div>
                                <div className="change-order-btns-box__down-btn">
                                    <IconBtn
                                        iconName = "arrow_drop_down"
                                        callback = {() => changeOrder(task.id, "down")}
                                        border   = {false}
                                    />
                                </div>
                            </div>
                            <div className="task-info-box">
                                <div className="task-info-box__title-box">
                                    <p className="task-info-box__title-box--title">{task.title}</p>
                                    {task.isRequired &&
                                    <span className="task-info-box__title-box--required-icon">必</span>
                                    }
                                </div>
                                <div className="task-info-box__time-box">
                                    <div className="task-info-box__time-box--min">
                                        <p>最低</p>
                                        <p>{task.min}</p>
                                        <p>分</p>
                                    </div>
                                    <span className="task-info-box__time-box--separation">/</span>
                                    <div className="task-info-box__time-box--max">
                                        <p>最高</p>
                                        <p>{task.max}</p>
                                        <p>分</p>
                                    </div>
                                </div>
                            </div>
                            <div className={`edit-btn-box ${editOperate}`}>
                                <IconBtn
                                    iconName = "open_in_new"
                                    callback = {() => {props.settargetTask(task)}}
                                    border   = {false}
                                />
                            </div>
                        </li>
                    )
                })}
                </ul>
            }
        </div>
    )
    /////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////
}