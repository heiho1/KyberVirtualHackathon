import React from 'react';
import Chart from 'chart.js';
// round corners
// Chart.pluginService.register({
//     afterUpdate: function (chart) {
//         if (chart.config.options.elements.arc.roundedCornersFor !== undefined) {
//             var arc = chart.getDatasetMeta(0).data[chart.config.options.elements.arc.roundedCornersFor];
//             arc.round = {
//                 x: (chart.chartArea.left + chart.chartArea.right) / 2,
//                 y: (chart.chartArea.top + chart.chartArea.bottom) / 2,
//                 radius: (chart.outerRadius + chart.innerRadius) / 2,
//                 thickness: (chart.outerRadius - chart.innerRadius) / 2 - 1,
//                 backgroundColor: arc._model.backgroundColor
//             }
//         }
//     },

//     afterDraw: function (chart) {
//         if (chart.config.options.elements.arc.roundedCornersFor !== undefined) {
//             var ctx = chart.chart.ctx;
//             var arc = chart.getDatasetMeta(0).data[chart.config.options.elements.arc.roundedCornersFor];
//             var startAngle = Math.PI / 2 - arc._view.startAngle;
//             var endAngle = Math.PI / 2 - arc._view.endAngle;

//             ctx.save();
//             ctx.translate(arc.round.x, arc.round.y);
//             console.log(arc.round.startAngle)
//             ctx.fillStyle = arc.round.backgroundColor;
//             ctx.beginPath();
//             ctx.arc(arc.round.radius * Math.sin(startAngle), arc.round.radius * Math.cos(startAngle), arc.round.thickness, 0, 2 * Math.PI);
//             ctx.arc(arc.round.radius * Math.sin(endAngle), arc.round.radius * Math.cos(endAngle), arc.round.thickness, 0, 2 * Math.PI);
//             ctx.closePath();
//             ctx.fill();
//             ctx.restore();
//         }
//     },
// });

// write text plugin
Chart.pluginService.register({
    afterUpdate: function (chart) {
        if (chart.config.options.elements.center) {
            var helpers = Chart.helpers;
            var centerConfig = chart.config.options.elements.center;
            var globalConfig = Chart.defaults.global;
            var ctx = chart.chart.ctx;

            var fontStyle = helpers.getValueOrDefault(centerConfig.fontStyle, globalConfig.defaultFontStyle);
            var fontFamily = helpers.getValueOrDefault(centerConfig.fontFamily, globalConfig.defaultFontFamily);

            if (centerConfig.fontSize)
                var fontSize = centerConfig.fontSize;
            // figure out the best font size, if one is not specified
            else {
                ctx.save();
                var fontSize = helpers.getValueOrDefault(centerConfig.minFontSize, 1);
                var maxFontSize = helpers.getValueOrDefault(centerConfig.maxFontSize, 256);
                var maxText = helpers.getValueOrDefault(centerConfig.maxText, centerConfig.text);

                do {
                    ctx.font = helpers.fontString(fontSize, fontStyle, fontFamily);
                    var textWidth = ctx.measureText(maxText).width;

                    // check if it fits, is within configured limits and that we are not simply toggling back and forth
                    if (textWidth < chart.innerRadius * 2 && fontSize < maxFontSize)
                        fontSize += 1;
                    else {
                        // reverse last step
                        fontSize -= 1;
                        break;
                    }
                } while (true)
                ctx.restore();
            }

            // save properties
            chart.center = {
                font: helpers.fontString(fontSize, fontStyle, fontFamily),
                fillStyle: helpers.getValueOrDefault(centerConfig.fontColor, globalConfig.defaultFontColor)
            };
        }
    },
    afterDraw: function (chart) {
        if (chart.center) {
            var centerConfig = chart.config.options.elements.center;
            var ctx = chart.chart.ctx;

            ctx.save();
            ctx.font = chart.center.font;
            ctx.fillStyle = chart.center.fillStyle;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            var centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
            var centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;
            ctx.fillText(centerConfig.text, centerX, centerY);
            ctx.restore();
        }
    },
})


class DoughtnutChart extends React.Component {
    constructor(props) {
        super(props);
        this.chartRef = React.createRef();
    }

    componentDidMount() {
        console.log(this.props)
        const half = this.props.data.components.length > 1 ? false : true
        const percentages = this.assignPercentages(half)
        const colors = this.assignColors(half)
        const names = this.assignNames(half)
        // const bgColor = this.assignColors(this.props.name) // One possible way to assign colors
        // const bgColor = this.assignRandomColor() // Random colors
        this.myChart = new Chart(this.chartRef.current, {
            type: 'doughnut',
            data: {
                datasets: [
                    {
                        data: percentages, //percent allocation of each asset. Accepts array of numbers [50,50]
                        backgroundColor: colors,
                        weight: 0.05
                    }
                ],
                labels: names, // Assets being allocated. Accepts array of strings ['cSAI', 'dLETH2x]
            },
            options: {
                tooltips: {
                    callbacks: {
                        title: (items, data) => data.labels[items[0].index] ? data.labels[items[0].index] : data.labels[items[0].index-1],
                        label: (items, data) => data.labels[items.index] ? data.datasets[0].data[items.index] + '%':data.datasets[0].data[items.index-1] + '%'
                      },
                
                    bodyFontSize: 14,
                    displayColors: false

                },
                legend: {
                    display: false
                },
                cutoutPercentage: 75,
                elements: {
                    arc: {
                        roundedCornersFor: 0
                    },
                    center: {
                        // the longest text that could appear in the center
                        maxText: '100%',
                        text: '',
                        fontColor: '#FFFFF',
                        fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                        fontStyle: 'normal',
                        fontSize: 12,
                        // if a fontSize is NOT specified, it will scale (within the below limits) maxText to take up the maximum space in the center
                        // if these are not specified either, we default to 1 and 256
                        minFontSize: 1,
                        maxFontSize: 256,
                    }
                }
            },

        });
    }

    //Accepts string argument of zap. Returns colors for doughnut chart for that zap
    assignColors(zap) {
        const colors = {
            'Lender': ['#7CCEFF', '#2023A8'],
            'EthMaximalist': ['#5540BF', '#a726f2']
        }
        return colors[zap]
    }

    // For each of the assets provided, assign a random color and remove that color from
    // the possible assignable colors (to prevent duplicates)
    // Returns array of colors [''#7CCEFF', '#2023A8',...,'#A726F2']
    assignRandomColor() {
        let possibleColors = ['#7CCEFF', '#2023A8', '#5540BF', '#A726F2', '#e80ba5', '#0ef448', '#eaa207']
        const colors = this.props.assets.map(color =>
            possibleColors.splice(Math.floor(Math.random() * possibleColors.length), 1)[0]
        )
        return colors
    }

    assignPercentages(half) {
        const percentages = this.props.data.components.map(component => {
            return component.percent
        })
        if (half) percentages.push(100 - this.props.data.components[0].percent)
        return percentages
    }

    assignColors(half) {
        const colors = this.props.data.components.map(component => {
            return component.color
        })
        return colors
    }
    assignNames(half) {
        const names = this.props.data.components.map(component => {
            return component.name
        })
        if (half) names.push(null)

        return names
    }


    render() {
        return  <canvas ref={this.chartRef} height="45" />
    }
}

export default DoughtnutChart;
