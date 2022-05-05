import React, { useEffect, useRef, useState } from "react";
import { CompactPicker } from "react-color";

import * as am5 from "@amcharts/amcharts5";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

//chart type
import * as am5percent from "@amcharts/amcharts5/percent";
import "./index.css";
import data from "./data";

const radArr = [25, 50, 75, 90, 100];
const innerRadArr = [0, 25, 50, 75, 100];
const textTypeArr = ["circular", "radial"];

const Chart = () => {
  let rootChart = useRef();
  let firstRender = useRef(true);

  const [value, setValue] = useState("set1");

  //States

  const [config, setConfig] = useState({
    radius: 90,
    innerRadius: "0",
    fillOpacity: 1,
    strokeColor: "#000000",
    strokeWidth: 0.2,
    legend: true,
    tooltip: true,
    fontSize: 18,
    fontColor: "#000000",
    alignLabels: false,
    textType: "circular",
    hideLabels: false,
  });

  const [toolTip, setToolTip] = useState({
    fillColor: "red",
    strokeColor: "black",
    textColor: "#fff",
    // fillOpacity: 1,
    fontSize: 17,
    strokeWidth: 0.2,
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
  }, [config, value, toolTip]);

  function createPieChart(config) {
    rootChart.current.setThemes([am5themes_Animated.new(rootChart.current)]);

    //Create Chart

    let chart = rootChart.current.container.children.push(
      am5percent.PieChart.new(rootChart.current, {
        endAngle: 270,
        centerY: am5.percent(0),
        centerX: am5.percent(0),
        y: am5.percent(0),
        x: am5.percent(0),
      })
    );

    //Create Series

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
      alignLabels: config.alignLabels,
    });

    //Slices Config

    series.slices.template.setAll({
      fillOpacity: config.fillOpacity,
      stroke: config.strokeColor,
      strokeWidth: config.strokeWidth,
    });

    //Labels
    series.labels.template.setAll({
      fontSize: config.fontSize,
      fill: config.fontColor,
      text: "{category}",
      textType: config.textType,
      forceHidden: config.hideLabels,
    });

    series.get("colors").set("colors", {});

    let tooltip = am5.Tooltip.new(rootChart.current, {
      getFillFromSprite: false,
      getStrokeFromSprite: false,
      autoTextColor: false,
      getLabelFillFromSprite: false,
    });

    tooltip.get("background").setAll({
      fill: toolTip.fillColor,
      stroke: toolTip.strokeColor,
      strokeWidth: toolTip.strokeWidth,
    });

    tooltip.label.setAll({
      fill: toolTip.textColor,
      fontSize: toolTip.fontSize,
    });

    series.set("tooltip", tooltip);

    if (config.legend) {
      var legend = chart.children.push(
        am5.Legend.new(rootChart.current, {
          centerY: am5.percent(0),
          centerX: am5.percent(0),
          y: am5.percent(96),
          x: am5.percent(10),
          layout: rootChart.current.horizontalLayout,
        })
      );

      legend.data.setAll(series.dataItems);
    }

    if (config.tooltip) {
      series.slices.template.setAll({
        tooltipText:
          "{category}: [bold]{valuePercentTotal.formatNumber('0.00')}%[/] ({value})",
        getLabelFillFromSprite: true,
        // tooltipX: am5.percent(50),
        // tooltipY: am5.percent(-5),
      });
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

  const tooltipStrokeColor = (color) => {
    setToolTip((prevState) => ({ ...prevState, strokeColor: color.hex }));
  };

  const tooltipBgColor = (color) => {
    setToolTip((prevState) => ({ ...prevState, fillColor: color.hex }));
  };
  const tooltipTextColor = (color) => {
    setToolTip((prevState) => ({ ...prevState, textColor: color.hex }));
  };

  const handleFontColor = (color) => {
    setConfig((prevState) => ({ ...prevState, fontColor: color.hex }));
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

  const handleAlignLabels = (e) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setConfig((prevState) => ({ ...prevState, alignLabels: true }));
    } else {
      setConfig((prevState) => ({ ...prevState, alignLabels: false }));
    }
  };

  const handleHideLabels = (e) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setConfig((prevState) => ({ ...prevState, hideLabels: true }));
    } else {
      setConfig((prevState) => ({ ...prevState, hideLabels: false }));
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
          <br></br>
          Select Text Type{" "}
          <button
            className="btn btn-secondary dropdown-toggle mt-2"
            type="button"
            id="dropdownMenuButton1"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {config.textType ? config.textType : ""}
          </button>
          <ul
            className="dropdown-menu overflow-auto"
            aria-labelledby="dropdownMenuButton1"
            style={{ height: "auto" }}
          >
            {textTypeArr.map((txt, idx) => (
              <li key={idx}>
                <button
                  className="dropdown-item"
                  onClick={() =>
                    setConfig((prevState) => ({
                      ...prevState,
                      textType: txt,
                    }))
                  }
                >
                  {txt}
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
                  strokeWidth: Number(config.strokeWidth) + 0.1,
                }))
              }
            >
              +
            </button>
          </span>

          <br></br>
          <p className="text-style">Font Size</p>
          <span>
            <button
              disabled={config.fontSize == 0.1}
              onClick={() =>
                setConfig((prevState) => ({
                  ...prevState,
                  fontSize: Number(config.fontSize - 1),
                }))
              }
            >
              -
            </button>

            <input
              value={config.fontSize}
              onChange={(e) =>
                setConfig((prevState) => ({
                  ...prevState,
                  fontSize: e.target.value,
                }))
              }
              style={{ width: "128px", textAlign: "center" }}
            />
            <button
              onClick={() =>
                setConfig((prevState) => ({
                  ...prevState,
                  fontSize: Number(config.fontSize) + 1,
                }))
              }
            >
              +
            </button>
          </span>

          <br></br>
          <p className="text-style">Tooltip Stroke Width</p>

          <span>
            <button
              disabled={toolTip.strokeWidth == 0.1}
              onClick={() =>
                setToolTip((prevState) => ({
                  ...prevState,
                  strokeWidth: Number(toolTip.strokeWidth - 0.1).toFixed(1),
                }))
              }
            >
              -
            </button>

            <input
              value={toolTip.strokeWidth}
              onChange={(e) =>
                setToolTip((prevState) => ({
                  ...prevState,
                  strokeWidth: e.target.value,
                }))
              }
              style={{ width: "128px", textAlign: "center" }}
            />
            <button
              onClick={() =>
                setToolTip((prevState) => ({
                  ...prevState,
                  strokeWidth: Number(toolTip.strokeWidth) + 0.1,
                }))
              }
            >
              +
            </button>
          </span>

          <br></br>
          <p className="text-style">Tooltip Text Size</p>
          <span>
            <button
              disabled={toolTip.fontSize == 0.1}
              onClick={() =>
                setToolTip((prevState) => ({
                  ...prevState,
                  fontSize: Number(toolTip.fontSize - 1),
                }))
              }
            >
              -
            </button>

            <input
              value={toolTip.fontSize}
              onChange={(e) =>
                setToolTip((prevState) => ({
                  ...prevState,
                  fontSize: e.target.value,
                }))
              }
              style={{ width: "128px", textAlign: "center" }}
            />
            <button
              onClick={() =>
                setToolTip((prevState) => ({
                  ...prevState,
                  fontSize: Number(toolTip.fontSize) + 1,
                }))
              }
            >
              +
            </button>
          </span>

          <br></br>
        </div>

        <br></br>

        <div className="dropdown d-flex flex-row justify-content-between align-content-between">
          <div className="d-flex flex-column">
            <p className="text-style2">Stroke Color</p>
            <CompactPicker
              color={config.strokeColor}
              onChange={handleStrokeColor}
            />
            <br></br>
            <p className="text-style2">Tooltip Stroke Color</p>
            <CompactPicker
              color={toolTip.strokeColor}
              onChange={tooltipStrokeColor}
            />
            <br></br>

            <p className="text-style2">Tooltip BG Color</p>
            <CompactPicker
              color={toolTip.fillColor}
              onChange={tooltipBgColor}
            />
          </div>
          <div className="d-flex flex-column">
            <p className="text-style2">Font Color</p>
            <CompactPicker
              color={config.fontColor}
              onChange={handleFontColor}
            />
            <br></br>

            <p className="text-style2">Tooltip Text Color</p>
            <CompactPicker
              color={toolTip.textColor}
              onChange={tooltipTextColor}
            />
          </div>
        </div>

        <div className="dropdown d-flex flex-column">
          <br></br>
        </div>

        <hr></hr>
        <div className="chart" id="chartID" style={{ height: "650px" }}></div>
        <div
          className="d-flex flex-row align-items-center justify-content-center"
          style={{ height: "100px" }}
        >
          <input
            type="checkbox"
            className="legend"
            onClick={handleHideLegend}
          />
          <p className="">Hide legend</p>

          <input
            type="checkbox"
            className="legend"
            onClick={handleHideTooltip}
          />
          <p className="">Hide tooltip</p>

          <input
            type="checkbox"
            className="legend"
            onClick={handleAlignLabels}
          />
          <p className="">Align labels</p>

          <input
            type="checkbox"
            className="legend"
            onClick={handleHideLabels}
          />
          <p className="">Hide labels</p>
        </div>
        <hr></hr>
      </div>
    </>
  );
};
export default Chart;
