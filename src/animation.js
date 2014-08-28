/************************************************************
 *
 * GTUG Girls Tokyo #14
 *
 * 5. イベントでデータを追加して、アニメーションさせよう
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
  var data = dataGenerator(10, function(i){
    var now = Date.now();
    return {
      id: i,
      name: "name "+ i,
      x: new Date(now + 60000 * i), // 一分おき
      y: 0|Math.random() * 1000
    };
  });

  var max = d3.max(data, function(d){ return d.y;});
  // スケールの生成
  var x = d3.time.scale().domain(d3.extent(data, function(d){ return d.x; })).range([0, width]),
      y = d3.scale.linear().domain([0, max]).range([height, 0]);

  //
  var svg = d3.select("body").append("svg").attr({width: WIDTH, height: HEIGHT});
  var main = svg.append("g")
        .attr({width: width, height: height, transform: "translate("+margin+","+margin+")"});

  var color = d3.scale.category20();
  var line = d3.svg.line().x(function(d){ return x(d.x); }).y(function(d){ return y(d.y); });

  var serie =
        // 現状の取得
        main.append("path")
        // データのヒモ付
        .datum(data)
        .attr({
          d: line,
          fill: "none",
          stroke: color(0)
        });

  var point = main.selectAll("g.point")
        .data(data).enter()
        .append("g").attr({
          "class": "point",
          transform: function(d){ return "translate("+x(d.x)+","+y(d.y)+")"; },
          fill: color(0)
        });
  point.append("circle").attr({ r: 5 });
  point.append("text").text(function(d){ return d.y; }).attr({dy: -8});

  var xaxis = main.append("g").call(d3.svg.axis().scale(x)).attr({
    "class": "axis",
    transform: "translate(0,"+height+")"
  });

  var yaxis = main.append("g").call(d3.svg.axis().scale(y).orient("left")).attr({
    "class": "axis"
  });


  var updateLine = function(){
    // スケールのドメイン更新
    x.domain(d3.extent(data, function(d){ return d.x; }));
    var max = d3.max(data, function(d){ return d.y;});
    y.domain([0, max]);

    // 折線の変形アニメーション
    serie.transition()
      .attr({
        d: line
      });

    // 新たにデータが増えたのでselection撮り直し
    var point = main.selectAll("g.point").data(data);
    // データ追加分の処理
    var newpoint = point.enter()
      .append("g").attr({
        "class": "point",
        transform: function(d){ return "translate("+x(d.x)+","+y(d.y)+")"; },
        fill: color(0)
      });
    newpoint.append("circle").attr({ r: 5 });
    newpoint.append("text").text(function(d){ return d.y; }).attr({dy: -8});

    // 既存データのアニメーション
    point.transition().attr({
      transform: function(d){ return "translate("+x(d.x)+","+y(d.y)+")"; }
    });

    // 軸の更新
    xaxis.call(d3.svg.axis().scale(x));
    yaxis.call(d3.svg.axis().scale(y).orient("left"));
  };

  setInterval(function(){
    var i = data.length;
    data.push({
      id: i,
      name: "name "+ i,
      x: new Date(data[i - 1].x.getTime() + 60000), // 一分おき
      y: 0|Math.random() * 1000
    });
    updateLine();
  }, 1000);


}());
