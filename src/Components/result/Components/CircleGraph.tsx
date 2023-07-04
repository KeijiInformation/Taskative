import { useEffect } from "react";
import { Pie } from "react-chartjs-2";



interface Props {
    idsArr: number[];
    actualMinutesArr: number[],
    idealMinutesArr: number[],
}


export default function CircleGraph(props: Props) {
    ///////////////////////////////////////////////////////////////////////////////////
    // graph setting
    ///////////////////////////////////////////////////////////////////////////////////
    useEffect(() => {
        
        // const graphDOM = document.querySelector("#circle-graph-wrapper__graph") as HTMLCanvasElement;
        // new Chart(graphDOM, {
        //     data: {
        //         datasets: [{
        //             data: props.actualMinutesArr,
        //             // backgroundColor: []
        //         }],

        //     }
        // });
    }, [props.idsArr, props.actualMinutesArr, props.idealMinutesArr])
    ///////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////






    ///////////////////////////////////////////////////////////////////////////////////
    // render
    ///////////////////////////////////////////////////////////////////////////////////
    return (
        <div className="circle-graph-wrapper">
            <Pie
                data = {{
                    datasets: [
                        {
                            data: props.actualMinutesArr,
                            // backgroundColor: [
                            //     'rgba(255, 99, 132, 0.2)',
                            //     'rgba(255, 159, 64, 0.2)',
                            //     'rgba(255, 205, 86, 0.2)',
                            //     'rgba(75, 192, 192, 0.2)',
                            // ],
                            // borderColor: [
                            //     'rgb(255, 99, 132)',
                            //     'rgb(255, 159, 64)',
                            //     'rgb(255, 205, 86)',
                            //     'rgb(75, 192, 192)',
                            // ],
                            // borderWidth: 1,
                        }
                    ]
                }}
            />
        </div>
    )
    ///////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////
}