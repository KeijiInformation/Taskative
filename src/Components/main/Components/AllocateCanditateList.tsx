import ScheduleView from "./ScheduleView";
import "../../../styles/Components/main/AllocateCanditateList.scss";
import { NormalBtn } from "../../common";

interface Props {
    descideAllocate: (index: number) => void;
    canditateList: Array<Array<[[number, number, number, number, number], [number, number, number, number, number], number]>>;
}



export default function allocateCanditateList(props: Props) {
    return(
        <div className="allocate-canditate-list-wrapper">
            {props.canditateList.map((canditate, index) => {
                return (
                    <div className="allocate-canditate-list-wrapper__canditate" key={"allocate-canditate-list-wrapper__canditate#" + index}>
                        <ScheduleView
                            allocateData={canditate}
                            onSectionIndex={-1}
                        />
                        <NormalBtn
                            text = "決定"
                            callback = {() => {props.descideAllocate(index); return true;}}
                        />
                    </div>
                )
            })}
        </div>
    )
}