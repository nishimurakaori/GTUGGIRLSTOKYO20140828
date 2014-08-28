/************************************************************
 *
 * GTUG Girls Tokyo #14
 *
 * 1. 散布図を書いてみよう
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
  var data = dataGenerator(100, function(i){
    return {
      id: i,
      name: "name "+ i,
      x: 0|Math.random() * width,
      y: 0|Math.random() * height
    };
  });

  //
  var svg = d3.select("body").append("svg").attr({width: WIDTH, height: HEIGHT});
  var main = svg.append("g")
        .attr({width: width, height: height, transform: "translate("+margin+","+margin+")"});

  var color = d3.scale.category20();

  var circle =
        // 現状の取得
        main.selectAll("g.circle")
        // データのヒモ付
        .data(data)
        // データ > 現状(DOM)の部分を取得
        .enter()
        // "g"要素を追加し、classをセット
        .append("g").attr({"class": "circle"});

  circle.append("circle").attr({
    r: 10,
    cx: function(d){ return d.x; },
    cy: function(d){ return d.y; },
    fill: "red"
  });

}());
