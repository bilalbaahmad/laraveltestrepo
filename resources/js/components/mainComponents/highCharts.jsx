import React, { Component } from "react";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Loading from 'react-loading-spinkit';
import DatePicker from "react-datepicker";
import ColorPicker from 'rc-color-picker';
import "react-datepicker/dist/react-datepicker.css";
import 'rc-color-picker/assets/index.css';

require ('highcharts/modules/exporting.js')(Highcharts);

class HighCharts extends Component
{
    constructor()
    {
        super();

        this.state = {
            // To avoid unnecessary update keep all options in the state.
            chartOptions: {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'My chart'
                },
                subtitle: {
                    text: 'Source: WorldClimate.com'
                },
                xAxis: {
                    categories: [
                        'Jan',
                        'Feb',
                        'Mar',
                        'Apr',
                        'May',
                        'Jun',
                        'Jul',
                        'Aug',
                        'Sep',
                        'Oct',
                        'Nov',
                        'Dec'
                    ],
                    crosshair: true
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Rainfall (mm)'
                    }
                },
                series: [],
                plotOptions: {
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                    },
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
            startDate: '',
            endDate: '',
            loading: true,
        };

        this.handleChangeStart = this.handleChangeStart.bind(this);
        this.handleChangeEnd = this.handleChangeEnd.bind(this);
        this.updateChartData = this.updateChartData.bind(this);
        this.handlecolorChange = this.handlecolorChange.bind(this);
    }

    componentDidMount()
    {
        this.updateChartData();
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
                    { data: [Math.random() * 15, Math.random() * 22, Math.random() * 33,Math.random() * 25, Math.random() * 32, Math.random() * 43, Math.random() * 15, Math.random() * 22, Math.random() * 33,Math.random() * 25, Math.random() * 32, Math.random() * 43]},
                    { data: [Math.random() * 5, Math.random() * 42, Math.random() * 13,Math.random() * 35, Math.random() * 22, Math.random() * 13, Math.random() * 5, Math.random() * 42, Math.random() * 13,Math.random() * 35, Math.random() * 22, Math.random() * 13,]},
                    { data: [Math.random() * 25, Math.random() * 52, Math.random() * 23,Math.random() * 45, Math.random() * 12, Math.random() * 13, Math.random() * 25, Math.random() * 52, Math.random() * 23,Math.random() * 45, Math.random() * 12, Math.random() * 13,]}
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

    handleChangeStart(date)
    {
        this.setState({ startDate: date }, () =>  this.updateChartData());
    }

    handleChangeEnd(date)
    {
        this.setState({ endDate: date }, () =>  this.updateChartData());
    }

    updateChartData()
    {
        if((this.state.startDate == '' && this.state.endDate != '') || (this.state.startDate != '' && this.state.endDate == ''))
        {
            return;
        }
        else
        {
            var token = '';
            if(localStorage.hasOwnProperty('access_token'))
            {
                token = localStorage.getItem('access_token');
            }

            if(token == '')
            {
                toast.error("You are not logged in !", {  autoClose: 3000 });
            }
            else
            {
                const startDate =this.state.startDate;
                const endDate = this.state.endDate;

                const FD = new FormData();
                FD.append('startDate', startDate);
                FD.append('endDate', endDate);

                var header = {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                    'Cache-Control': 'no-cache'
                };

                axios({
                    method: 'post',
                    url:'/api/forecastdata',
                    headers: header,
                    data:FD,

                }).then(response => {
                    const resp = response.data.message;
                    if (response.data.status === 'error')
                    {
                        toast.warning('Something went wrong !', {autoClose: 3000});
                        this.setState({loading: false});
                    }
                    else
                    {
                        if (resp == 'Access Denied')
                        {
                            toast.warning(resp, {autoClose: 3000});
                            this.setState({loading: false});
                        }
                        else
                        {
                            console.log( response.data);
                            let seriesDummy = { ...this.state.chartOptions };
                            seriesDummy.series = response.data;
                            this.setState({ chartOptions:seriesDummy, loading: false});
                        }
                    }
                });
            }
        }
    }

    handlecolorChange(colors, id)
    {
        const seriesDummy = { ...this.state.chartOptions };
        seriesDummy.series[id].color = colors.color;
        this.setState({ chartOptions:seriesDummy });
    }

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

                    <br />

                    <span>Start Date: </span>
                    <DatePicker
                        selected={this.state.startDate}
                        selectsStart
                        startDate={this.state.startDate}
                        endDate={this.state.endDate}
                        onChange={this.handleChangeStart}
                        dateFormat="yyyy/MM/dd"
                    />

                    {' '}

                    <span>End Date: </span>
                    <DatePicker
                        selected={this.state.endDate}
                        selectsEnd
                        startDate={this.state.startDate}
                        endDate={this.state.endDate}
                        onChange={this.handleChangeEnd}
                        dateFormat="yyyy/MM/dd"
                    />

                    <br /> <br />

                    {
                        chartOptions.series.map((series, index) => {
                        return(
                                <ColorPicker
                                    key={index}
                                    animation="slide-up"
                                    color={series.color}
                                    onClose={(color) => {this.handlecolorChange(color,index)}}
                                />
                            )
                        })
                    }
                </div>

                <br /> <br />

                <h3 style={link_styling}>Hovering over {hoverData}</h3>
                <button onClick={this.updateSeries.bind(this)}>Update Series</button> {'  '}
                <button onClick={this.downloadPdf}>Download</button>
             </div>
        )
    }
}

export default HighCharts;