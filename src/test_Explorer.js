import React, { useEffect, useRef, useMemo } from "react";
import * as d3 from "d3";
import styled from "styled-components";

const ExplorerWrapper = styled.div.attrs({
  className: "explorer_wrapper",
})`
  width: 100%;
  height: 500px;
`;

const Explorer = ({ selectedUserId, users, group, algoEff }) => {
  const ref = useRef(null);
  const layout = useMemo(
    () => ({
      w: 500,
      h: 500,
      circle: { r: 3 },
    }),
    []
  );

  const xScale = useMemo(
    () =>
      d3
        .scaleLinear()
        .domain(d3.extent(users, (d) => d.x0_pred))
        .range([0, layout.w]),
    [users, layout.w]
  );

  const yScale = useMemo(
    () =>
      d3
        .scaleLinear()
        .domain(d3.extent(users, (d) => d.x1_pred))
        .range([layout.h, 0]),
    [users, layout.h]
  );

  const colorScales = useMemo(
    () => ({
      gender: d3.scaleOrdinal().domain(["M", "F"]).range(["blue", "red"]),
      stereotyping: d3
        .scaleLinear()
        .domain([
          d3.min(users, (d) => d.stereotyping),
          0,
          d3.max(users, (d) => d.stereotyping),
        ])
        .range(["blue", "gray", "red"]),
      error: d3
        .scaleLinear()
        .domain([0, d3.max(users, (d) => d.error)])
        .range(["lightgray", "red"]),
    }),
    [users]
  );

  useEffect(() => {
    if (!ref.current) return;
    const svgElement = d3.select(ref.current);
    const svg = svgElement.append("g").attr("class", "zoom-layer");

    const zoom = d3
      .zoom()
      .scaleExtent([0.5, 5])
      .translateExtent([
        [0, 0],
        [layout.w, layout.h],
      ])
      .on("zoom", (event) => {
        svg.attr("transform", event.transform); // Apply the transformation
      });

    svgElement.call(zoom);

    const determineFillColor = (d) => {
      if (group === "") return "gray";
      if (group === "gender") return colorScales.gender(d.gender);
      if (group === "stereotyping")
        return colorScales.stereotyping(d.stereotyping);
      if (group === "error") return colorScales.error(d.error);
    };

    const handleMouseOver = (event, d) => {
      // Log details about the user to the console
      console.log(`UserID: ${d.userID}`);
      console.log(`Stereotyping Index: ${d.stereotyping}`);
      console.log(`Actual Deviation: ${d.actual_dev}`);
      // You can add more data fields as needed
    };

    const gUsers = svg.selectAll(".g_user").data(users, (d) => d.userID);

    gUsers
      .enter()
      .append("g")
      .attr("class", "g_user")
      .merge(gUsers)
      .attr(
        "transform",
        (d) => `translate(${xScale(d.x0_pred)}, ${yScale(d.x1_pred)})`
      )
      .selectAll("circle")
      .data((d) => [d])
      .join("circle")
      .attr("class", "user_circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", layout.circle.r)
      .style("fill", determineFillColor)
      .on("mouseover", handleMouseOver);

    gUsers.exit().remove();
  }, [users, group, layout, xScale, yScale, colorScales]);

  return (
    <ExplorerWrapper>
      <svg width={layout.w} height={layout.h} ref={ref} />
    </ExplorerWrapper>
  );
};

export default Explorer;
