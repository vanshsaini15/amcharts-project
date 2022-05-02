import React, { useEffect, useRef, useState } from "react";
import { TwitterPicker } from "react-color";

import * as am5 from "@amcharts/amcharts5";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

//chart type
import * as am5percent from "@amcharts/amcharts5/percent";
import "./index.css";
import data from "./data";

const radArr = [25, 50, 75, 90, 100];
const innerRadArr = [0, 25, 50, 75, 100];

const Chart = () => {
  let rootChart = useRef();
  let firstRender = useRef(true);

  const [value, setValue] = useState("set1");

  const [config, setConfig] = useState({
    radius: 90,
    innerRadius: "0",
    fillOpacity: 1,
    strokeColor: "#000000",
    strokeWidth: 0.2,
    legend: true,
    tooltip: true,
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

    let chart = rootChart.current.container.children.push(
      am5percent.PieChart.new(rootChart.current, {
        endAngle: 270,
        centerY: am5.percent(0),
        centerX: am5.percent(0),
        y: am5.percent(0),
        x: am5.percent(0),
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

    series.slices.template.setAll({
      fillOpacity: config.fillOpacity,
      stroke: config.strokeColor,
      strokeWidth: config.strokeWidth,
    });

    series.slices.template.set(
      "tooltipText",
      "{category}: [bold]{valuePercentTotal.formatNumber('0.00')}%[/] ({value})"
    );

    if (config.legend) {
      var legend = chart.children.push(
        am5.Legend.new(rootChart.current, {
          centerY: am5.percent(0),
          centerX: am5.percent(0),
          y: am5.percent(95),
          x: am5.percent(10),
          layout: rootChart.current.horizontalLayout,
        })
      );

      legend.data.setAll(series.dataItems);
    }

    if (config.tooltip) {
      series.slices.template.set(
        "tooltipText",
        "{category}: [bold]{valuePercentTotal.formatNumber('0.00')}%[/] ({value})"
      );
    } else {
      series.slices.template.set("tooltipText", "");
    }
    // series.appear(1000, 100);

    return chart;
  }

  function selectDataset(e) {
    setValue(e.target.value);
  }

  const handleStrokeColor = (color) => {
    setConfig((prevState) => ({ ...prevState, strokeColor: color.hex }));
  };

  const handleHideLegend = (e) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setConfig((prevState) => ({ ...prevState, legend: false }));
    } else {
      setConfig((prevState) => ({ ...prevState, legend: true }));
    }
  };

  const handleHideTooltip = (e) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setConfig((prevState) => ({ ...prevState, tooltip: false }));
    } else {
      setConfig((prevState) => ({ ...prevState, tooltip: true }));
    }
  };

  return (
    <>
      <hr></hr>

      <div className="config-box">
        <div className="dropdown d-flex flex-column align-items-center float-start">
          Select Data Set{" "}
          <select
            onChange={selectDataset}
            className="btn btn-secondary dropdown-toggle mt-2"
            type="button"
            id="dropdownMenuButton1"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <option value="set1">Data Set 1</option>
            <option value="set2">Data Set 2</option>
            <option value="set3">Data Set 3</option>
          </select>
        </div>

        <div className="dropdown d-flex flex-column align-items-center float-end ">
          Select Radius{" "}
          <button
            className="btn btn-secondary dropdown-toggle mt-2"
            type="button"
            id="dropdownMenuButton1"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Outer Radius: {config.radius ? config.radius : ""}%
          </button>
          <ul
            className="dropdown-menu overflow-auto"
            aria-labelledby="dropdownMenuButton1"
            style={{ height: "auto" }}
          >
            {radArr.map((rad, idx) => (
              <li key={idx}>
                <button
                  className="dropdown-item"
                  onClick={() =>
                    setConfig((prevState) => ({ ...prevState, radius: rad }))
                  }
                >
                  {rad}
                </button>
              </li>
            ))}
          </ul>
          <button
            className="btn btn-secondary dropdown-toggle mt-2"
            type="button"
            id="dropdownMenuButton1"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Inner Radius: {config.innerRadius ? config.innerRadius : ""}%
          </button>
          <ul
            className="dropdown-menu overflow-auto"
            aria-labelledby="dropdownMenuButton1"
            style={{ height: "auto" }}
          >
            {innerRadArr.map((rad, idx) => (
              <li key={idx}>
                <button
                  className="dropdown-item"
                  onClick={() =>
                    setConfig((prevState) => ({
                      ...prevState,
                      innerRadius: rad,
                    }))
                  }
                >
                  {rad}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="dropdown d-flex flex-column align-items-center">
          <p className="text-style">Fill Opacity</p>

          <span>
            <button
              disabled={config.fillOpacity == 0}
              onClick={() =>
                setConfig((prevState) => ({
                  ...prevState,
                  fillOpacity: Number(config.fillOpacity - 0.1).toFixed(1),
                }))
              }
            >
              -
            </button>

            <input
              value={config.fillOpacity}
              onChange={(e) =>
                setConfig((prevState) => ({
                  ...prevState,
                  fillOpacity: e.target.value,
                }))
              }
              style={{ width: "128px", textAlign: "center" }}
            />
            <button
              disabled={config.fillOpacity == 1}
              onClick={() =>
                setConfig((prevState) => ({
                  ...prevState,
                  fillOpacity: Number(config.fillOpacity) + 0.1,
                }))
              }
            >
              +
            </button>
          </span>
        </div>

        <div className="dropdown d-flex flex-column align-items-center">
          <br></br>
          <p className="text-style">Stroke Width</p>

          <span>
            <button
              disabled={config.strokeWidth == 0.1}
              onClick={() =>
                setConfig((prevState) => ({
                  ...prevState,
                  strokeWidth: Number(config.strokeWidth - 0.1).toFixed(1),
                }))
              }
            >
              -
            </button>

            <input
              value={config.strokeWidth}
              onChange={(e) =>
                setConfig((prevState) => ({
                  ...prevState,
                  strokeWidth: e.target.value,
                }))
              }
              style={{ width: "128px", textAlign: "center" }}
            />
            <button
              onClick={() =>
                setConfig((prevState) => ({
                  ...prevState,
                  strokeWidth: Number(config.strokeWidth + 0.1),
                }))
              }
            >
              +
            </button>
          </span>
        </div>

        <div className="dropdown d-flex flex-column align-items-center">
          <br></br>
          <p className="text-style2">Stroke Color</p>
          <TwitterPicker
            color={config.strokeColor}
            onChange={handleStrokeColor}
          />
        </div>

        <hr></hr>
        <div
          className="chart"
          id="chartID"
          style={{ width: "100%", height: "500px", paddingBottom: "40px" }}
        ></div>
        <div
          className="d-flex flex-row align-items-center justify-content-center"
          style={{ height: "100px" }}
        >
          <input
            type="checkbox"
            className="legend"
            onClick={handleHideLegend}
          />
          <p className="">Hide Legend</p>

          <input
            type="checkbox"
            className="legend"
            onClick={handleHideTooltip}
          />
          <p className="">Hide Tooltip</p>
        </div>
        <hr></hr>
      </div>
    </>
  );
};
export default Chart;
