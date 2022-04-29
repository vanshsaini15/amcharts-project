import React, { useEffect, useRef, useState } from "react";
// import { HuePicker } from 'react-color';

import * as am5 from "@amcharts/amcharts5";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

//chart type
import * as am5percent from "@amcharts/amcharts5/percent";
import "./index.css";
import data from "./data";


let chart;
const radArr = [25, 50, 75, 100];
const innerRadArr = [0, 25,50,75,100]


const Chart = () => {
  let rootChart = useRef();
  let firstRender = useRef(true);

  const [value, setValue] = useState('set1')

  const [config, setConfig] = useState({
    fillColor: "#00ffff",
    radius: 90,
    innerRadius : '0',

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
  }, [config, value]);



  function createPieChart(config) {
    rootChart.current.setThemes([am5themes_Animated.new(rootChart.current)]);

    chart = rootChart.current.container.children.push(
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

    series.data.setAll(data[value]);

    series.setAll({
      radius: am5.percent(config.radius),
      innerRadius: am5.percent(config.innerRadius),
      
    });





    // series.appear(1000, 100);



    return chart;
  }


  function selectDataset(e) {

    setValue(e.target.value);

  }



  return (
    <div>
      <div className="dropdown d-flex flex-column align-items-center">
      <select onChange={selectDataset}className="btn btn-secondary dropdown-toggle mt-2" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
      <option value="set1">Data Set 1</option>
      <option value="set2">Data Set 2</option>
      <option value="set3">Data Set 3</option>
    </select>
      
      
      </div>
     

      
      <div className="dropdown d-flex flex-column align-items-center">
      <button className="btn btn-secondary dropdown-toggle mt-2" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
          Radius: {config.radius ? config.radius : ''}
      </button>
      <ul className="dropdown-menu overflow-auto" aria-labelledby="dropdownMenuButton1" style={{ height: 'auto' }}>
          {radArr.map((r, i) => <li key={i}><button className="dropdown-item" onClick={() => setConfig(prevState => ({ ...prevState, radius: r }))}>{r}</button></li>)}
      </ul>

      
      <button className="btn btn-secondary dropdown-toggle mt-2" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
          Inner Radius: {config.innerRadius ? config.innerRadius : ''}
      </button>
      <ul className="dropdown-menu overflow-auto" aria-labelledby="dropdownMenuButton1" style={{ height: 'auto' }}>
          {innerRadArr.map((r, i) => <li key={i}><button className="dropdown-item" onClick={() => setConfig(prevState => ({ ...prevState, innerRadius: r }))}>{r}</button></li>)}
      </ul>
      
      
  </div>





      <div
        id="chartID"
        style={{ width: "100%", height: "500px", alignSelf: "end" }}
      ></div>
    </div>
  );
};
export default Chart;
