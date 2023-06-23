import { UserDataContext } from "../../../App";
import { Task } from "../../../Class";
import { Tasks } from "../../../Class/data";
import { useContext } from "react";
import "../../../styles/Components/main/TasksInput.scss";



interface Props {
    tasks: Tasks;
    setTasks: (callback: (tasks: Tasks) => Tasks) => void;
}



export default function TasksInput(props: Props) {
    ///////////////////////////////////////////////////////////////////
    // global
    ///////////////////////////////////////////////////////////////////
    const userData = useContext(UserDataContext);
    ///////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////






    ///////////////////////////////////////////////////////////////////
    // handle on change
    ///////////////////////////////////////////////////////////////////
    function handleOnchange(event: React.ChangeEvent<HTMLInputElement>): void {
        const targetTaskID: number = Number(event.target.name);
        const targetTask: Task | undefined = props.tasks.getTaskByID(targetTaskID);
        if (targetTask !== undefined) {
            if (event.target.checked) {
                props.setTasks(prevState => {
                    let isExist: boolean = false;
                    prevState.data.forEach(task => {
                        if (task.id === targetTaskID) {
                            isExist = true;
                        }
                    })
                    if (isExist) {
                        return prevState;
                    } else {
                        prevState.add(targetTask);
                        return prevState;
                    }
                })


            } else {
                props.setTasks(prevState => {
                    prevState.filterByID(targetTaskID);
                    return prevState;
                })
            }
        }
    }
    ///////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////






    ///////////////////////////////////////////////////////////////////
    // render
    ///////////////////////////////////////////////////////////////////
    return (
        <div className="tasks-input-wrapper">
            <ul className="tasks-input-wrapper__checkbox-list">
                {userData.tasks.data.map((task, index) => {
                    if (task.id === -1) {
                        return undefined;
                    }
                    return (
                        <li className="tasks-input-wrapper__checkbox-list--task-checkbox" key={"task-check-box#" + index}>
                            <label className="input-label">
                                <input type="checkbox" className="input-label__input" name={String(task.id)} onChange={(event) => handleOnchange(event)} defaultChecked={true}/>
                                <p className="input-label__title">{task.title}</p>
                            </label>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
    ///////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////
}