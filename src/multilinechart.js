/************************************************************
 *
 * GTUG Girls Tokyo #14
 *
 * 4. 複数の折線グラフ
 *
 */
(function(){
  "use strict";
  // setting
  var margin = 50,
      WIDTH = 600, HEIGHT = 600,
      width = WIDTH - 2 * margin, height = HEIGHT - 2 * margin;

  // データ生成ユーティリティ
  var dataGenerator = function(len, gen){
    var array = [], i = 0;
    for(i = 0; i < len; i++){
      array.push(gen ? gen(i) : i);
    }
    return array;
  };

  // データ生成
  var series = dataGenerator(3, function(i){
    return {
      name: "series " + i,
      data: dataGenerator(10, function(j){
        var now = Date.now();
        return {
          id: j,
          name: "name "+ j,
          x: new Date(now + 60000 * j), // 一分おき
          y: 0|Math.random() * 1000
        };
      })
    };
  });

  var maxY = d3.max(series, function(serie){ return d3.max(serie.data, function(d){ return d.y;}); });
  var minX = d3.min(series, function(serie){ return d3.min(serie.data, function(d){ return d.x;}); }),
      maxX = d3.max(series, function(serie){ return d3.max(serie.data, function(d){ return d.x;}); });
  // スケールの生成
  var x = d3.time.scale().domain([minX, maxX]).range([0, width]),
      y = d3.scale.linear().domain([0, maxY]).range([height, 0]);

  //
  var svg = d3.select("body").append("svg").attr({width: WIDTH, height: HEIGHT});
  var main = svg.append("g")
        .attr({width: width, height: height, transform: "translate("+margin+","+margin+")"});

  var color = d3.scale.category20();
  var line = d3.svg.line().x(function(d){ return x(d.x); }).y(function(d){ return y(d.y); });

  var serie =
        // 現状の取得
        main.selectAll("g.serie")
        // データのヒモ付
        .data(series)
        .enter()
        .append("g").attr({
          "class": "serie",
          fill: function(d){ return color(d.name); }
        });

  serie.append("path").attr({
    d: function(d){ return line(d.data); },
    fill: "none",
    stroke: function(d){ return color(d.name); }
  });

  var point = serie.selectAll("g.point").data(function(d){ return d.data;}).enter()
        .append("g").attr({
          "class": "point",
          transform: function(d){ return "translate("+x(d.x)+","+y(d.y)+")"; }
        });
  point.append("circle").attr({
    r: 5
  });
  point.append("text").text(function(d){ return d.y; }).attr({dy: -8});

  var axis = main.append("g").call(d3.svg.axis().scale(x)).attr({
    "class": "axis",
    transform: "translate(0,"+height+")"
  });

  var yaxis = main.append("g").call(d3.svg.axis().scale(y).orient("left")).attr({
    "class": "axis"
  });
}());
