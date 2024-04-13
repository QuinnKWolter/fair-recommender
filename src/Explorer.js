import React, { useEffect, useRef, useMemo } from "react";
import * as d3 from "d3";
import styled from "styled-components";

const ExplorerWrapper = styled.div.attrs({
  className: "explorer_wrapper",
})`
  width: 100vw;
  height: 100vh;
  overflow: hidden; // Ensure no overflow from this container
  display: flex;
  justify-content: center;
  align-items: center;
  //grid-area: e;
`;

const Explorer = ({ selectedUserId, users, group, algoEff }) => {
  const svgRef = useRef(null);
  const gRef = useRef(null);
  const layout = useMemo(
    () => ({
      w: window.innerWidth,
      h: window.innerHeight,
      circle: {
        r: 3,
      },
    }),
    []
  );

  const xScale = useMemo(
    () =>
      d3
        .scaleLinear()
        .domain(d3.extent(users.map((d) => d.x0_pred)))
        .range([0, layout.w]),
    [users, layout.w]
  );

  const yScale = useMemo(
    () =>
      d3
        .scaleLinear()
        .domain(d3.extent(users.map((d) => d.x1_pred)))
        .range([layout.h, 0]),
    [users, layout.h]
  );

  const genderColorScale = d3
    .scaleOrdinal()
    .domain(["M", "F"])
    .range(["blue", "red"]);

  const stereotypingColorScale = d3
    .scaleLinear()
    .domain([
      d3.min(users.map((d) => d.stereotyping)),
      0,
      d3.max(users.map((d) => d.stereotyping)),
    ])
    .range(["blue", "gray", "red"]);

  const miscalibrationColorScale = d3
    .scaleLinear()
    .domain([0, d3.max(users.map((d) => d.error))])
    .range(["lightgray", "red"]);

  const filterBubbleRadiusScale = d3
    .scaleLinear()
    .domain([0, d3.max(users.map((d) => d.filter_bubble))])
    .range([layout.circle.r - 1, layout.circle.r + 1]);

  const filterBubbleColorScale = d3
    .scaleLinear()
    .domain([
      d3.min(users.map((d) => d.filter_bubble)),
      0,
      d3.max(users.map((d) => d.filter_bubble)),
    ])
    .range(["blue", "lightgray", "red"]);

  const filterBubbleBorderScale = d3
    .scaleLinear()
    .domain([0, d3.max(users.map((d) => Math.abs(d.filter_bubble)))])
    .range([0.5, 1]);

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    if (!gRef.current) {
      gRef.current = svg.append("g").attr("class", "everything").node();
    }

    const g = d3.select(gRef.current);

    // Define zoom behavior
    const zoomBehavior = d3
      .zoom()
      .scaleExtent([0.5, 8])
      .translateExtent([
        [-layout.w * 0.2, -layout.h * 0.2],
        [1.15 * layout.w, 1.1 * layout.h],
      ])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoomBehavior);

    // Set initial zoom level
    // svg.call(zoomBehavior.transform, d3.zoomIdentity.translate(0, 0).scale(0.75));

    const usersGroup = g
      .selectAll(".g_user")
      .data(users, (d) => d.userID)
      .join(
        (enter) =>
          enter
            .append("g")
            .attr("class", "g_user")
            .attr(
              "transform",
              (d) => `translate(${xScale(d.x0_pred)}, ${yScale(d.x1_pred)})`
            )
            .each(function (d) {
              const user = d3.select(this);
              user
                .append("circle")
                .attr("class", "user_circle")
                .attr("r", layout.circle.r);
            }),
        (update) =>
          update.call((update) =>
            update
              .transition()
              .duration(500)
              .attr(
                "transform",
                (d) => `translate(${xScale(d.x0_pred)}, ${yScale(d.x1_pred)})`
              )
          ),
        (exit) => exit.remove()
      );

    g.selectAll(".user_circle")
      .attr("r", layout.circle.r)
      .attr("fill", (d) =>
        group === "gender" ? genderColorScale(d.gender) : "gray"
      );

    // All users
    const gUsers = svg.selectAll(".g_user").data(users);

    gUsers.selectAll("circle").remove();
    gUsers.selectAll("path").remove();

    gUsers
      .enter()
      .append("g")
      .attr("class", "g_user")
      .attr("transform", function (d) {
        return "translate(" + xScale(d.x0_pred) + "," + yScale(d.x1_pred) + ")";
      });

    const gUserCircles = gUsers
      .append("circle")
      .attr("class", "user_circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", layout.circle.r)
      .style("fill-opacity", 0.4)
      .on("mouseover", function (d) {
        const data = d3.select(this).data()[0];
        console.log(
          "stereotype/pred_dev: ",
          data.stereotyping,
          data.actual_dev
        );
      });

    gUsers
      .append("circle")
      .attr("class", "user_circle_bubble")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", (d) => filterBubbleRadiusScale(d.filter_bubble))
      .style("fill", "none")
      .style("stroke", (d) => filterBubbleColorScale(d.filter_bubble))
      // .style('stroke-dasharray', '2,1')
      .style("stroke-width", (d) => filterBubbleBorderScale(d.filter_bubble))
      // .style('fill-opacity', 0.4)
      .on("mouseover", function (d) {
        const data = d3.select(this).data()[0];
        console.log(
          "stereotype/pred_dev: ",
          data.stereotyping,
          data.actual_dev
        );
      });

    gUsers
      .append("path") //append path
      .attr("class", "link")
      .style("stroke", "#000")
      .style("opacity", 0.4)
      // .attr('marker-start', (d) => "url(#arrow)")//attach the arrow from defs
      .style("stroke-width", 0.5)
      .attr("d", (d) => {
        const theta = Math.atan2(
          d.x0_actual - d.x0_pred,
          d.x1_actual - d.x1_pred
        );
        const length = 5;
        return (
          "M" +
          0 +
          "," +
          0 +
          "," +
          length * Math.cos(theta) +
          "," +
          length * Math.sin(theta)
        );
      });

    gUserCircles.style("fill", (d) => {
      let circleColor = "";
      // console.log("circleColor: ", circleColor);
      if (group == "") circleColor = "gray";
      else if (group == "gender") circleColor = genderColorScale(d.gender);
      else if (group == "stereotyping")
        circleColor = stereotypingColorScale(d.stereotyping);
      else if (group == "error")
        circleColor = miscalibrationColorScale(d.error);

      return circleColor;
    });

    gUsers.exit().remove();

    // Selected users
    const gSelectedUsers = d3
      .select(svgRef.current)
      .selectAll(".g_selected_user")
      .data(users.filter((d) => d.userID == selectedUserId));

    gSelectedUsers.selectAll("circle").remove();

    gSelectedUsers
      .enter()
      .append("g")
      .attr("class", "g_selected_user")
      .attr("transform", function (d) {
        return "translate(" + xScale(d.x0_pred) + "," + yScale(d.x1_pred) + ")";
      });

    gSelectedUsers.selectAll("circle").remove();

    gSelectedUsers
      .append("circle")
      .attr("class", "selected_user_circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", 5)
      .style("stroke", "black")
      .style("stroke-width", 2)
      .style("fill-opacity", 0.85)
      .on("mouseover", function (d) {
        const data = d3.select(this).data()[0];
        console.log(
          "stereotype/pred_dev: ",
          data.stereotyping,
          data.actual_dev
        );
      });

    gSelectedUsers.style("fill", (d) => {
      let circleColor = "";
      console.log("circleColor: ", circleColor);
      if (group == "") circleColor = "gray";
      else if (group == "gender") circleColor = genderColorScale(d.gender);
      else if (group == "stereotyping")
        circleColor = stereotypingColorScale(d.stereotyping);
      else if (group == "error")
        circleColor = miscalibrationColorScale(d.error);

      return circleColor;
    });

    gSelectedUsers.exit().remove();
  }, [users, group, selectedUserId, xScale, yScale]);

  return (
    <ExplorerWrapper>
      <svg width={layout.w} height={layout.h} ref={svgRef} />
    </ExplorerWrapper>
  );
};

export default Explorer;
