import React, { Component } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import Loading from 'react-loading-spinkit';

class Chart extends Component
{
    constructor()
    {
        super();

        this.state = {
            chartData: {},
            location: "",
            legendPosition: "",
            loading: true,
        };
    }

    static defaultProps = {

        displayTitle: true,
        displayLegend: true,
        legendPosition: "right",
        location: "City"
    };

    componentWillMount()
    {
        this.getChartData();
        this.setState({loading: false});
    }

    getChartData()
    {
        // Ajax calls here
        this.setState({
            chartData: {
                labels: [
                    "Karachi",
                    "Lahore",
                    "Faisalabad",
                    "Islamabad",
                    "Peshawar",
                    "Multan"
                ],
                datasets: [
                    {
                        label: "Population",
                        data: [617594, 381045, 283060, 156519, 325162, 195072],
                        backgroundColor: [
                          "rgba(255, 99, 132, 0.6)",
                          "rgba(54, 162, 235, 0.6)",
                          "rgba(255, 206, 86, 0.6)",
                          "rgba(75, 192, 192, 0.6)",
                          "rgba(153, 102, 255, 0.6)",
                          "rgba(255, 159, 64, 0.6)",
                          "rgba(255, 99, 132, 0.6)"
                        ]
                    }
                ]
            },
            location: "Pakistan",
            legendPosition: "bottom"
        });
    }

    render()
    {
        return (
            this.state.loading ? <div style={{ height: '45vh', width: '60vw' }}><Loading show={true} /> </div> :
            <div className="chart">
                <Bar
                    data={this.state.chartData}
                    options={{
                        title: {
                          display: this.props.displayTitle,
                          text: "Largest Cities In " + this.state.location,
                          fontSize: 25
                        },
                        legend: {
                          display: this.props.displayLegend,
                          position: this.state.legendPosition
                        }
                    }}
                />

                <Line
                    data={this.state.chartData}
                    options={{
                        title: {
                          display: this.props.displayTitle,
                          text: "Largest Cities In " + this.state.location,
                          fontSize: 25
                        },
                        legend: {
                          display: this.props.displayLegend,
                          position: this.state.legendPosition
                        }
                    }}
                />

                <Pie
                    data={this.state.chartData}
                    options={{
                        title: {
                          display: this.props.displayTitle,
                          text: "Largest Cities In " + this.state.location,
                          fontSize: 25
                        },
                        legend: {
                          display: this.props.displayLegend,
                          position: this.state.legendPosition
                        }
                    }}
                />
            </div>
        );
    }
}

export default Chart;
