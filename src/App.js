import React, { useEffect, useRef, useState } from "react";
// import { HuePicker } from 'react-color';

import * as am5 from "@amcharts/amcharts5";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

//chart type
import * as am5percent from "@amcharts/amcharts5/percent";
import "./index.css";
import data from "./data";

const Chart = () => {
  let rootChart = useRef();
  let firstRender = useRef(true);

  const [config, setConfig] = useState({
    strokeColor: "#000000",
    fillColor: "#00ffff",
  });

  useEffect(() => {
    if (firstRender.current) {
      let root = am5.Root.new("chartID");
      rootChart.current = root;
      firstRender.current = false;
      let pieChart = createPieChart(config);
      return () => {
        pieChart.dispose();
      };
    } else {
      let pieChart = createPieChart(config);
      return () => {
        pieChart.dispose();
      };
    }
  }, [config]);

  function createPieChart(config) {
    rootChart.current.setThemes([am5themes_Animated.new(rootChart.current)]);

    let chart = rootChart.current.container.children.push(
      am5percent.PieChart.new(rootChart.current, {
        endAngle: 270,
      })
    );

    let series = chart.series.push(
      am5percent.PieSeries.new(rootChart.current, {
        valueField: "value",
        categoryField: "category",
        colorField: "color",
        endAngle: 270,
      })
    );

    series.states.create("hidden", {
      endAngle: -90,
    });

    series.data.setAll(data.set1, {
      // fill: config.fillColor,
    });

    series.appear(1000, 100);

    return chart;
  }

  // function selectDataset(set) {
  //     series.data = data[set];
  // }

  //  const handleFillColor = (color) => {
  //   setConfig(prevState => ({ ...prevState, fillColor: color.hex }))
  //  }
  const handleSelectData = (color) => {
    setConfig((prevState) => ({ ...prevState, fillColor: color.hex }));
  };

  return (
    <div>
      <select className="dropdown">
        <option value="set1">Data Set 1</option>
        <option value="set2">Data Set 2</option>
        <option value="set3">Data Set 3</option>
      </select>

      <div
        id="chartID"
        style={{ width: "100%", height: "500px", alignSelf: "end" }}
      ></div>
    </div>
  );
};
export default Chart;
