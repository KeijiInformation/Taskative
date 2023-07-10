import "../../../styles/Components/result/DateView.scss";



interface Props {
    onYear: string;
    onMonth: string;
    onWeek: [string, string];
    selectedTab: "year" | "month" | "week";
}



interface DateData {
    "year":      number | undefined;
    "month":     number | undefined;
    "weekStart": [number, number, number] | undefined;
    "weekEnd":   [number, number, number] | undefined;
}



export default function DateView(props: Props) {
    /////////////////////////////////////////////////////////////////////////
    // dateDataの作成
    /////////////////////////////////////////////////////////////////////////
    let dateData: DateData = {
        "year":      undefined,
        "month":     undefined,
        "weekStart": undefined,
        "weekEnd":   undefined,
    }
    if (props.selectedTab === "year") {
        dateData["year"] = Number(props.onYear);
    } else if (props.selectedTab === "month") {
        const dateList: [string, string] = props.onMonth.split("/") as [string, string];
        dateData["year"]  = Number(dateList[0]);
        dateData["month"] = Number(dateList[1]);
    } else {
        let dateList: [string, string, string];
        dateList = props.onWeek[0].split("/") as [string, string, string];
        dateData["weekStart"] = dateList.map(elem => Number(elem)) as [number, number, number];
        dateList = props.onWeek[1].split("/") as [string, string, string];
        dateData["weekEnd"]   = dateList.map(elem => Number(elem)) as [number, number, number];
    }
    /////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////






    /////////////////////////////////////////////////////////////////////////
    // render
    /////////////////////////////////////////////////////////////////////////
    return (
        <div className="date-view-wrapper">
            <div className="date-view-wrapper__date-box">






                {/* 年 */}
                {props.selectedTab === "year" &&
                    <p className="date-view-wrapper__date-box--year">{dateData["year"]}年</p>
                }






                {/* 月 */}
                {props.selectedTab === "month" &&
                    <div className="date-view-wrapper__date-box--month">
                        <p className="year">{dateData["year"]}年</p>
                        <p className="month">{dateData["month"]}月</p>
                    </div>
                }






                {/* 週 */}
                {props.selectedTab === "week" &&
                    <>
                        <div className="date-view-wrapper__date-box--date">
                            <p className="year">{dateData["weekStart"] && dateData["weekStart"][0]}年</p>
                            <p className="date">{`${dateData["weekStart"] && dateData["weekStart"][1]}/${dateData["weekStart"] && dateData["weekStart"][2]}`}</p>
                        </div>
                        <p className="date-view-wrapper__date-box--delimiter">-</p>
                        <div className="date-view-wrapper__date-box--date">
                            <p className="year">{dateData["weekEnd"] && dateData["weekEnd"][0]}年</p>
                            <p className="date">{`${dateData["weekEnd"] && dateData["weekEnd"][1]}/${dateData["weekEnd"] && dateData["weekEnd"][2]}`}</p>
                        </div>
                    </>
                }






            </div>
        </div>
    )
    /////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////
}