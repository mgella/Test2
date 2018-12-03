$(document).ready(function () {
                  var timeData = [],
                  heartRateData = [],
                   humidityData = [],
                  threshold = 0,
                  defaultThreshold = 250,
                  initialValues = [],
                  tempData = [],
                  repCount = 0,
                  smokeData = [],
                  maxHeartRate = -100000,
                  minHeartRate = 100000,
                  maxTemp = -100000,
                  minTemp = 100000,
                  maxSPO2 = -100000,
                  minSPO2 = 100000;

                  var data = {
                  labels: timeData,
                  datasets: [
                             {
                             fill: false,
                             label: 'Heart Rate',
                             yAxisID: 'Peaks',
                             borderColor: "rgba(255, 204, 0, 1)",
                             pointBoarderColor: "rgba(255, 204, 0, 1)",
                             backgroundColor: "rgba(255, 204, 0, 0.4)",
                             pointHoverBackgroundColor: "rgba(255, 204, 0, 1)",
                             pointHoverBorderColor: "rgba(255, 204, 0, 1)",
                             data: heartRateData
                             }
                             ]
                  }
                  
                  var data2 = {
                  labels: timeData,
                  datasets: [
                             {
                             fill: false,
                             label: 'smoke',
                             yAxisID: 'smoke',
                             borderColor: "rgba(255, 204, 0, 1)",
                             pointBoarderColor: "rgba(255, 204, 0, 1)",
                             backgroundColor: "rgba(255, 204, 0, 0.4)",
                             pointHoverBackgroundColor: "rgba(255, 204, 0, 1)",
                             pointHoverBorderColor: "rgba(255, 204, 0, 1)",
                             data: smokeData
                             }
                             ]
                  }
                  
                  var data3 = {
                  labels: timeData,
                  datasets: [
                             {
                             fill: false,
                             label: 'temperature',
                             yAxisID: 'temperature',
                             borderColor: "rgba(255, 204, 0, 1)",
                             pointBoarderColor: "rgba(255, 204, 0, 1)",
                             backgroundColor: "rgba(255, 204, 0, 0.4)",
                             pointHoverBackgroundColor: "rgba(255, 204, 0, 1)",
                             pointHoverBorderColor: "rgba(255, 204, 0, 1)",
                             data: tempData
                             },
                             {
        fill: false,
        label: 'Humidity',
        yAxisID: 'Humidity',
        borderColor: "rgba(24, 120, 240, 1)",
        pointBoarderColor: "rgba(24, 120, 240, 1)",
        backgroundColor: "rgba(24, 120, 240, 0.4)",
        pointHoverBackgroundColor: "rgba(24, 120, 240, 1)",
        pointHoverBorderColor: "rgba(24, 120, 240, 1)",
        data: humidityData
      }
                             ]
                  }
                  
                  var basicOption3 = {
                  title: {
                  display: true,
                  text: 'Temperature and Humidity Real-time Data',
                  fontSize: 36
                  },
                  scales: {
                  yAxes: [{
                          id: 'temperature',
                          type: 'linear',
                          scaleLabel: {
                          labelString: 'temperature',
                          display: true
                          },
                          position: 'left',
                          }, {
          id: 'Humidity',
          type: 'linear',
          scaleLabel: {
            labelString: 'Humidity(%)',
            display: true
          },
          position: 'right'
        }]
                  }
                  }
                  
                  var basicOption2 = {
                  title: {
                  display: true,
                  text: 'Smoke Detection',
                  fontSize: 36
                  },
                  scales: {
                  yAxes: [{
                          id: 'smoke',
                          type: 'linear',
                          scaleLabel: {
                          labelString: 'smoke',
                          display: true
                          },
                          position: 'left',
                          }]
                  }
                  }
                  
                  var basicOption = {
                  title: {
                  display: true,
                  text: 'Heart Rate Real-time Data',
                  fontSize: 36
                  },
                  scales: {
                  yAxes: [{
                          id: 'Peaks',
                          type: 'linear',
                          scaleLabel: {
                          labelString: 'Heart Rate',
                          display: true
                          },
                          position: 'left',
                          }]
                  }
                  }
                  
                  //Get the context of the canvas element we want to select
                  var ctx = document.getElementById("myChart").getContext("2d");
                  var ctx2 = document.getElementById("myChart2").getContext("2d");
                  var ctx3 = document.getElementById("myChart3").getContext("2d");
                  var alertit = 1;
                  var optionsNoAnimation = { animation: false }
                  var myLineChart = new Chart(ctx, {
                                              type: 'line',
                                              data: data,
                                              options: basicOption
                                              });
                  
                  var myLineChart2 = new Chart(ctx2, {
                                              type: 'line',
                                              data: data2,
                                              options: basicOption2
                                              });
                  
                  var myLineChart3 = new Chart(ctx3, {
                                               type: 'line',
                                               data: data3,
                                               options: basicOption3
                                               });
                  
                  var ws = new WebSocket('wss://' + location.host);

                  ws.onopen = function () {
                    console.log('Successfully connect WebSocket');
                  }

                  ws.onmessage = function (message) {
                    console.log('receive message' + message.data);
                    try {
                        var obj = JSON.parse(message.data);
                       alert("hi");
                        
                        timeData.push(obj.time);

                        heartRateData.push(obj.HeartRate);
                       
                        
                        smokeData.push(obj.SmokeRate);
                        tempData.push(obj.temperature);
                        // only keep no more than 50 points in the line chart
                        const maxLen = 50;
                        var len = timeData.length;
                        if (len > maxLen) {
                            timeData.shift();
                            heartRateData.shift();
                            smokeData.shift();
                            tempData.shift();
                        }
                         if (obj.humidity) {
        humidityData.push(obj.humidity);
      }
      if (humidityData.length > maxLen) {
        humidityData.shift();
      }

                        myLineChart.update();
                        myLineChart2.update();
                        myLineChart3.update();

                        if (maxHeartRate<obj.HeartRate){
                            maxHeartRate = obj.HeartRate
                        }
                        if (minHeartRate>obj.HeartRate){
                            minHeartRate = obj.HeartRate
                        }

                        if (maxSPO2<obj.IR){
                            maxSPO2 = obj.IR
                        }
                        if (minSPO2>obj.IR){
                            minSPO2 = obj.IR
                        }

                       
                        var message = "Stop Smoking for today";
                        if(alertit==1)
                        $("#label11").html(message);
                        $("#label1").html(maxHeartRate);
                $("#label2").html(minHeartRate);
                        $("#label3").html(maxSPO2);
                        $("#label4").html(minSPO2);
                $("#label5").html(maxTemp);
                        $("#label6").html(minTemp);
                        
                        var x = document.getElementById("label1");
                        if (maxHeartRate>100){
                            x.style.backgroundColor = "red";
                        }
                        else{
                            x.style.backgroundColor = "white";
                        }
                         
                
                    } catch (err) {
                        console.error(err);
                    }
                  }
});