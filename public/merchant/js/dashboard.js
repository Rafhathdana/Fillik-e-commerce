(function ($) {
  "use strict";
  $(function () {
    Chart.defaults.global.legend.labels.usePointStyle = true;

    var monthData = JSON.parse($("#visit-sale-chart").attr("data-month-data"));
    var totalData = JSON.parse($("#traffic-chart").attr("data-total-data"));
    if ($("#visit-sale-chart").length) {
      var monthData = JSON.parse(
        $("#visit-sale-chart").attr("data-month-data")
      );
      Chart.defaults.global.legend.labels.usePointStyle = true;
      var ctx = document.getElementById("visit-sale-chart").getContext("2d");

      var gradientStrokeViolet = ctx.createLinearGradient(0, 0, 0, 181);
      gradientStrokeViolet.addColorStop(0, "rgba(218, 140, 255, 1)");
      gradientStrokeViolet.addColorStop(1, "rgba(154, 85, 255, 1)");
      var gradientLegendViolet =
        "linear-gradient(to right, rgba(218, 140, 255, 1), rgba(154, 85, 255, 1))";

      var gradientStrokeBlue = ctx.createLinearGradient(0, 0, 0, 360);
      gradientStrokeBlue.addColorStop(0, "rgba(54, 215, 232, 1)");
      gradientStrokeBlue.addColorStop(1, "rgba(177, 148, 250, 1)");
      var gradientLegendBlue =
        "linear-gradient(to right, rgba(54, 215, 232, 1), rgba(177, 148, 250, 1))";

      var gradientStrokeRed = ctx.createLinearGradient(0, 0, 0, 300);
      gradientStrokeRed.addColorStop(0, "rgba(255, 191, 150, 1)");
      gradientStrokeRed.addColorStop(1, "rgba(254, 112, 150, 1)");
      var gradientLegendRed =
        "linear-gradient(to right, rgba(255, 191, 150, 1), rgba(254, 112, 150, 1))";
      var gradientStrokeGreen = ctx.createLinearGradient(0, 0, 0, 200);
      gradientStrokeGreen.addColorStop(0, "rgba(73, 255, 163, 1)");
      gradientStrokeGreen.addColorStop(1, "rgba(11, 153, 227, 1)");
      var gradientLegendGreen =
        "linear-gradient(to right, rgba(73, 255, 163, 1), rgba(11, 153, 227, 1))";

      var myChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: [
            "JAN",
            "FEB",
            "MAR",
            "APR",
            "MAY",
            "JUN",
            "JUL",
            "AUG",
            "SEP",
            "OCT",
            "NOV",
            "DEC",
          ],
          datasets: [
            {
              label: "CANCEL",
              borderColor: gradientStrokeViolet,
              backgroundColor: gradientStrokeViolet,
              hoverBackgroundColor: gradientStrokeViolet,
              legendColor: gradientLegendViolet,
              pointRadius: 0,
              fill: false,
              borderWidth: 1,
              fill: "origin",
              data: [
                monthData[1] ? monthData[1].totalCancelledAmount : 0,
                monthData[2] ? monthData[2].totalCancelledAmount : 0,
                monthData[3] ? monthData[3].totalCancelledAmount : 0,
                monthData[4] ? monthData[4].totalCancelledAmount : 0,
                monthData[5] ? monthData[5].totalCancelledAmount : 0,
                monthData[6] ? monthData[6].totalCancelledAmount : 0,
                monthData[7] ? monthData[7].totalCancelledAmount : 0,
                monthData[8] ? monthData[8].totalCancelledAmount : 0,
                monthData[9] ? monthData[9].totalCancelledAmount : 0,
                monthData[10] ? monthData[10].totalCancelledAmount : 0,
                monthData[11] ? monthData[11].totalCancelledAmount : 0,
                monthData[12] ? monthData[12].totalCancelledAmount : 0,
              ],
            },
            {
              label: "RETERN",
              borderColor: gradientStrokeRed,
              backgroundColor: gradientStrokeRed,
              hoverBackgroundColor: gradientStrokeRed,
              legendColor: gradientLegendRed,
              pointRadius: 0,
              fill: false,
              borderWidth: 1,
              fill: "origin",
              data: [
                monthData[1] ? monthData[1].totalReturnedAmount : 0,
                monthData[2] ? monthData[2].totalReturnedAmount : 0,
                monthData[3] ? monthData[3].totalReturnedAmount : 0,
                monthData[4] ? monthData[4].totalReturnedAmount : 0,
                monthData[5] ? monthData[5].totalReturnedAmount : 0,
                monthData[6] ? monthData[6].totalReturnedAmount : 0,
                monthData[7] ? monthData[7].totalReturnedAmount : 0,
                monthData[8] ? monthData[8].totalReturnedAmount : 0,
                monthData[9] ? monthData[9].totalReturnedAmount : 0,
                monthData[10] ? monthData[10].totalReturnedAmount : 0,
                monthData[11] ? monthData[11].totalReturnedAmount : 0,
                monthData[12] ? monthData[12].totalReturnedAmount : 0,
              ],
            },
            {
              label: "SUCCESS",
              borderColor: gradientStrokeBlue,
              backgroundColor: gradientStrokeBlue,
              hoverBackgroundColor: gradientStrokeBlue,
              legendColor: gradientLegendBlue,
              pointRadius: 0,
              fill: false,
              borderWidth: 1,
              fill: "origin",
              data: [
                monthData[1] ? monthData[1].totalCompleteAmount : 0,
                monthData[2] ? monthData[2].totalCompleteAmount : 0,
                monthData[3] ? monthData[3].totalCompleteAmount : 0,
                monthData[4] ? monthData[4].totalCompleteAmount : 0,
                monthData[5] ? monthData[5].totalCompleteAmount : 0,
                monthData[6] ? monthData[6].totalCompleteAmount : 0,
                monthData[7] ? monthData[7].totalCompleteAmount : 0,
                monthData[8] ? monthData[8].totalCompleteAmount : 0,
                monthData[9] ? monthData[9].totalCompleteAmount : 0,
                monthData[10] ? monthData[10].totalCompleteAmount : 0,
                monthData[11] ? monthData[11].totalCompleteAmount : 0,
                monthData[12] ? monthData[12].totalCompleteAmount : 0,
              ],
            },
            {
              label: "PENDING",
              borderColor: gradientStrokeGreen,
              backgroundColor: gradientStrokeGreen,
              hoverBackgroundColor: gradientStrokeGreen,
              legendColor: gradientLegendGreen,
              pointRadius: 0,
              fill: false,
              borderWidth: 1,
              fill: "origin",
              data: [
                monthData[1] ? monthData[1].pendingAmount : 0,
                monthData[2] ? monthData[2].pendingAmount : 0,
                monthData[3] ? monthData[3].pendingAmount : 0,
                monthData[4] ? monthData[4].pendingAmount : 0,
                monthData[5] ? monthData[5].pendingAmount : 0,
                monthData[6] ? monthData[6].pendingAmount : 0,
                monthData[7] ? monthData[7].pendingAmount : 0,
                monthData[8] ? monthData[8].pendingAmount : 0,
                monthData[9] ? monthData[9].pendingAmount : 0,
                monthData[10] ? monthData[10].pendingAmount : 0,
                monthData[11] ? monthData[11].pendingAmount : 0,
                monthData[12] ? monthData[12].pendingAmount : 0,
              ],
            },
          ],
        },
        options: {
          responsive: true,
          legend: false,
          legendCallback: function (chart) {
            var text = [];
            text.push("<ul>");
            for (var i = 0; i < chart.data.datasets.length; i++) {
              text.push(
                '<li><span class="legend-dots" style="background:' +
                  chart.data.datasets[i].legendColor +
                  '"></span>'
              );
              if (chart.data.datasets[i].label) {
                text.push(chart.data.datasets[i].label);
              }
              text.push("</li>");
            }
            text.push("</ul>");
            return text.join("");
          },
          scales: {
            yAxes: [
              {
                ticks: {
                  display: false,
                  min: 0,
                  stepSize: 200,
                },
                gridLines: {
                  drawBorder: false,
                  color: "rgba(235,237,242,1)",
                  zeroLineColor: "rgba(235,237,242,1)",
                },
              },
            ],
            xAxes: [
              {
                gridLines: {
                  display: false,
                  drawBorder: false,
                  color: "rgba(0,0,0,1)",
                  zeroLineColor: "rgba(235,237,242,1)",
                },
                ticks: {
                  padding: 20,
                  fontColor: "#9c9fa6",
                  autoSkip: true,
                },
                categoryPercentage: 0.5,
                barPercentage: 0.5,
              },
            ],
          },
        },
        elements: {
          point: {
            radius: 0,
          },
        },
      });
      $("#visit-sale-chart-legend").html(myChart.generateLegend());
    }

    if ($("#traffic-chart").length) {
      var gradientStrokeBlue = ctx.createLinearGradient(0, 0, 0, 181);
      gradientStrokeBlue.addColorStop(0, "rgba(54, 215, 232, 1)");
      gradientStrokeBlue.addColorStop(1, "rgba(177, 148, 250, 1)");
      var gradientLegendBlue =
        "linear-gradient(to right, rgba(54, 215, 232, 1), rgba(177, 148, 250, 1))";

      var gradientStrokeRed = ctx.createLinearGradient(0, 0, 0, 50);
      gradientStrokeRed.addColorStop(0, "rgba(255, 191, 150, 1)");
      gradientStrokeRed.addColorStop(1, "rgba(254, 112, 150, 1)");
      var gradientLegendRed =
        "linear-gradient(to right, rgba(255, 191, 150, 1), rgba(254, 112, 150, 1))";

      var gradientStrokeGreen = ctx.createLinearGradient(0, 0, 0, 300);
      gradientStrokeGreen.addColorStop(0, "rgba(6, 185, 157, 1)");
      gradientStrokeGreen.addColorStop(1, "rgba(132, 217, 210, 1)");
      var gradientLegendGreen =
        "linear-gradient(to right, rgba(6, 185, 157, 1), rgba(132, 217, 210, 1))";

      var trafficChartData = {
        datasets: [
          {
            data: [
              totalData.totalCompleteAmount,
              totalData.totalCancelledAmount,
              totalData.pendingAmount,
            ],
            backgroundColor: [
              gradientStrokeBlue,
              gradientStrokeGreen,
              gradientStrokeRed,
            ],
            hoverBackgroundColor: [
              gradientStrokeBlue,
              gradientStrokeGreen,
              gradientStrokeRed,
            ],
            borderColor: [
              gradientStrokeBlue,
              gradientStrokeGreen,
              gradientStrokeRed,
            ],
            legendColor: [
              gradientLegendBlue,
              gradientLegendGreen,
              gradientLegendRed,
            ],
          },
        ],

        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: [
          "Total Complete Amount ",
          "Total Cancelled Amount ",
          "Total Pending Amount ",
        ],
      };
      var trafficChartOptions = {
        responsive: true,
        animation: {
          animateScale: true,
          animateRotate: true,
        },
        legend: false,
        legendCallback: function (chart) {
          var text = [];
          text.push("<ul>");
          for (var i = 0; i < trafficChartData.datasets[0].data.length; i++) {
            text.push(
              '<li><span class="legend-dots" style="background:' +
                trafficChartData.datasets[0].legendColor[i] +
                '"></span>'
            );
            if (trafficChartData.labels[i]) {
              text.push(trafficChartData.labels[i]);
            }
            text.push(
              '<span class="float-right">' +
                trafficChartData.datasets[0].data[i] +
                "%" +
                "</span>"
            );
            text.push("</li>");
          }
          text.push("</ul>");
          return text.join("");
        },
      };
      var trafficChartCanvas = $("#traffic-chart").get(0).getContext("2d");
      var trafficChart = new Chart(trafficChartCanvas, {
        type: "doughnut",
        data: trafficChartData,
        options: trafficChartOptions,
      });
      $("#traffic-chart-legend").html(trafficChart.generateLegend());
    }
    if ($("#inline-datepicker").length) {
      $("#inline-datepicker").datepicker({
        enableOnReadonly: true,
        todayHighlight: true,
      });
    }
    var doughnutPieData = {
      datasets: [
        {
          data: [
            totalData.totalCompleteOrder,
            totalData.totalCancelledOrder,
            totalData.pendingOrder,
          ],
          backgroundColor: [
            "rgba(255, 99, 132, 0.5)",
            "rgba(54, 162, 235, 0.5)",
            "rgba(255, 206, 86, 0.5)",
            "rgba(75, 192, 192, 0.5)",
            "rgba(153, 102, 255, 0.5)",
            "rgba(255, 159, 64, 0.5)",
          ],
          borderColor: [
            "rgba(255,99,132,1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
        },
      ],

      // These labels appear in the legend and in the tooltips when hovering different arcs
      labels: [
        "total Complete Order",
        "total Cancelled Order",
        "Pending Order",
      ],
    };
    var doughnutPieOptions = {
      responsive: true,
      animation: {
        animateScale: true,
        animateRotate: true,
      },
    };

    var multiAreaData = {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      datasets: [
        {
          label: "total Complete Order",
          data: [
            monthData[1] ? monthData[1].totalCompleteOrder : 0,
            monthData[2] ? monthData[2].totalCompleteOrder : 0,
            monthData[3] ? monthData[3].totalCompleteOrder : 0,
            monthData[4] ? monthData[4].totalCompleteOrder : 0,
            monthData[5] ? monthData[5].totalCompleteOrder : 0,
            monthData[6] ? monthData[6].totalCompleteOrder : 0,
            monthData[7] ? monthData[7].totalCompleteOrder : 0,
            monthData[8] ? monthData[8].totalCompleteOrder : 0,
            monthData[9] ? monthData[9].totalCompleteOrder : 0,
            monthData[10] ? monthData[10].totalCompleteOrder : 0,
            monthData[11] ? monthData[11].totalCompleteOrder : 0,
            monthData[12] ? monthData[12].totalCompleteOrder : 0,
          ],
          borderColor: ["rgba(255, 99, 132, 0.5)"],
          backgroundColor: ["rgba(255, 99, 132, 0.5)"],
          borderWidth: 1,
          fill: true,
        },
        {
          label: "Total Cancelled Order",
          data: [
            monthData[1] ? monthData[1].totalCancelledOrder : 0,
            monthData[2] ? monthData[2].totalCancelledOrder : 0,
            monthData[3] ? monthData[3].totalCancelledOrder : 0,
            monthData[4] ? monthData[4].totalCancelledOrder : 0,
            monthData[5] ? monthData[5].totalCancelledOrder : 0,
            monthData[6] ? monthData[6].totalCancelledOrder : 0,
            monthData[7] ? monthData[7].totalCancelledOrder : 0,
            monthData[8] ? monthData[8].totalCancelledOrder : 0,
            monthData[9] ? monthData[9].totalCancelledOrder : 0,
            monthData[10] ? monthData[10].totalCancelledOrder : 0,
            monthData[11] ? monthData[11].totalCancelledOrder : 0,
            monthData[12] ? monthData[12].totalCancelledOrder : 0,
          ],
          borderColor: ["rgba(54, 162, 235, 0.5)"],
          backgroundColor: ["rgba(54, 162, 235, 0.5)"],
          borderWidth: 1,
          fill: true,
        },
        {
          label: "Pending Order",
          data: [
            monthData[1] ? monthData[1].pendingOrder : 0,
            monthData[2] ? monthData[2].pendingOrder : 0,
            monthData[3] ? monthData[3].pendingOrder : 0,
            monthData[4] ? monthData[4].pendingOrder : 0,
            monthData[5] ? monthData[5].pendingOrder : 0,
            monthData[6] ? monthData[6].pendingOrder : 0,
            monthData[7] ? monthData[7].pendingOrder : 0,
            monthData[8] ? monthData[8].pendingOrder : 0,
            monthData[9] ? monthData[9].pendingOrder : 0,
            monthData[10] ? monthData[10].pendingOrder : 0,
            monthData[11] ? monthData[11].pendingOrder : 0,
            monthData[12] ? monthData[12].pendingOrder : 0,
          ],
          borderColor: ["rgba(255, 206, 86, 0.5)"],
          backgroundColor: ["rgba(255, 206, 86, 0.5)"],
          borderWidth: 1,
          fill: true,
        },
      ],
    };

    var multiAreaOptions = {
      plugins: {
        filler: {
          propagate: true,
        },
      },
      elements: {
        point: {
          radius: 0,
        },
      },
      scales: {
        xAxes: [
          {
            gridLines: {
              display: false,
            },
          },
        ],
        yAxes: [
          {
            gridLines: {
              display: false,
            },
          },
        ],
      },
    };

    // Get context with jQuery - using jQuery's .get() method.

    if ($("#areachart-multi").length) {
      var multiAreaCanvas = $("#areachart-multi").get(0).getContext("2d");
      var multiAreaChart = new Chart(multiAreaCanvas, {
        type: "line",
        data: multiAreaData,
        options: multiAreaOptions,
      });
    }

    if ($("#doughnutChart").length) {
      var doughnutChartCanvas = $("#doughnutChart").get(0).getContext("2d");
      var doughnutChart = new Chart(doughnutChartCanvas, {
        type: "doughnut",
        data: doughnutPieData,
        options: doughnutPieOptions,
      });
    }
  });
})(jQuery);
