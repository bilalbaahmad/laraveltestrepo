import React, { Component } from "react";

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Loading from 'react-loading-spinkit';

require ('highcharts/modules/exporting.js')(Highcharts);


class HighCharts extends Component
{
    constructor()
    {
        super();

        this.state = {
            // To avoid unnecessary update keep all options in the state.
            chartOptions: {
                xAxis: {
                    categories: ['A', 'B', 'C'],
                },
                series: [
                    { data: [1, 2, 3] }
                ],
                plotOptions: {
                    series: {
                        point: {
                            events: {
                                mouseOver: this.setHoverData.bind(this)
                            }
                        }
                    }
                }
            },
            hoverData: null,
            loading: true,
        };
    }


    componentDidMount()
    {
        this.setState({loading: false});
    }

    setHoverData = (e) => {
        // The chart is not updated because `chartOptions` has not changed.
        this.setState({ hoverData: e.target.category })
    };

    updateSeries = () => {
        // The chart is updated only with new options.
        this.setState({
            chartOptions: {
                series: [
                    { data: [Math.random() * 5, 2, 3]}
                ]
            }
        });
    };

    downloadPdf = () => {
        var element = $("#wid")[0];

        html2canvas(element).then(function (canvas) {
            var myImage = canvas.toDataURL();

            var margin_right = 20;
            var margin_top = 20;

            var divHeight = $('#wid').height();
            var divWidth = $('#wid').width();
            var ratio = divHeight / divWidth;

            var doc = new jsPDF('p', 'pt', 'a4');

            var width = doc.internal.pageSize.getWidth();
            var height = ratio * width;

            doc.addImage(myImage, 'JPEG', margin_right, margin_top, width - 50, height - 10);
            doc.save('sample-file.pdf');
        });
    };


    render()
    {
        const { chartOptions, hoverData } = this.state;

        var link_styling = {
            //color: 'red'
        };

        return (
            this.state.loading ? <div style={{ height: '45vh', width: '60vw' }}><Loading show={true} /> </div> :
               <div id="wid">
                   <div >
                        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
                   </div>

                   <h3 style={link_styling}>Hovering over {hoverData}</h3>
                   <button onClick={this.updateSeries.bind(this)}>Update Series</button> {'  '}
                   <button onClick={this.downloadPdf}>Download</button>
                </div>
        )
    }
}

export default HighCharts;