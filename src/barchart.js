/************************************************************
 *
 * GTUG Girls Tokyo #14
 *
 * 2. 棒グラフを作成してみよう
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
    return {
      id: i,
      name: "name "+ i,
      // height よりも大きい!
      y: 0|Math.random() * 1000
    };
  });

  // データの調査
  var min = d3.min(data, function(d){ return d.y;}),
      max = d3.max(data, function(d){ return d.y;}),
      extent = d3.extent(data, function(d){ return d.y;});

  var x = d3.scale.ordinal().domain(data.map(function(d){ return d.id; })).rangeBands([0, width], 0.2),
      y = d3.scale.linear().domain([0, max]).range([height, 0]);

  //
  var svg = d3.select("body").append("svg").attr({width: WIDTH, height: HEIGHT});
  var main = svg.append("g")
        .attr({width: width, height: height, transform: "translate("+margin+","+margin+")"});

  var color = d3.scale.category20();

  var bar =
        // 現状の取得
        main.selectAll("g.bar")
        // データのヒモ付
        .data(data)
        // データ > 現状(DOM)の部分を取得
        .enter()
        // "g"要素を追加し、classをセット
        .append("g")
        .attr({
          "class": "bar",
          transform: function(d){ return "translate("+x(d.id)+","+height+")";}
        });

  bar.append("rect").attr({
    width: x.rangeBand(),
    height: function(d){ return height - y(d.y); },
    y: function(d){ return y(d.y) - height; },
    fill: "red"
  });
  bar.append("text").text(function(d){ return d.y;});

  main.append("g").call(d3.svg.axis().scale(x)).attr({
    "class": "axis",
    transform: "translate(0,"+height+")"
  });

  main.append("g").call(d3.svg.axis().scale(y).orient("left")).attr({
    "class": "axis"
  });
}());
