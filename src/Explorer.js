import React, { useEffect, useRef, useMemo, useState } from "react";
import * as d3 from "d3";
import styled from "styled-components";
import CustomTooltip from "./CustomTooltip";

const ExplorerWrapper = styled.div.attrs({
  className: "explorer_wrapper",
})`
  width: 30vw;
  height: 100vh;
  overflow: hidden;
  justify-content: right;
  align-items: right;
  position: relative;
`;

const Explorer = ({ users, selectedUserId, setSelectedUserId, algoEff }) => {
  const [group, setGroup] = useState("gender");
  const [tooltipData, setTooltipData] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const tooltipTimeoutRef = useRef(null);
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

  const { xScale, yScale } = useMemo(() => {
    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(users, (d) => d.x0_pred))
      .range([0, layout.w]);

    const yScale = d3
      .scaleLinear()
      .domain(d3.extent(users, (d) => d.x1_pred))
      .range([layout.h, 0]);

    return { xScale, yScale };
  }, [users, layout.w, layout.h]);

  const genderColorScale = useMemo(
    () => d3.scaleOrdinal().domain(["M", "F"]).range(["#4676f4", "#ce4e6c"]),
    []
  );

  const stereotypingLengthScale = useMemo(() => {
    const maxStereotypingAbs = d3.max(users, (d) => Math.abs(d.stereotyping));
    return d3.scaleLinear().domain([0, maxStereotypingAbs]).range([2, 10]); // Example range from 2 to 10 units
  }, [users]);

  const miscalibrationColorScale = useMemo(
    () =>
      d3
        .scaleLinear()
        .domain([0, d3.max(users, (d) => d.error)])
        .range(["#111111", "#eeeeee"]), // Black to White
    //.range(["#ffff00", "#008000"]), // Yellow to Green
    //.range(["#ff8c00", "#800080"]), // Orange to Purple
    //.range(["#00ffff", "#ff00ff"]), // Cyan to Magenta
    //.range(["#00ff00", "#ee82ee"]), // Lime to Violet
    [users]
  );

  const filterBubbleRadiusScale = useMemo(() => {
    return d3
      .scaleLinear()
      .domain([0, d3.max(users.map((d) => d.filter_bubble))])
      .range([layout.circle.r - 1, layout.circle.r + 1]);
  }, [users, layout.circle.r]);

  const filterBubbleBorderScale = useMemo(
    () =>
      d3
        .scaleLinear()
        .domain([0, d3.max(users.map((d) => Math.abs(d.filter_bubble)))])
        .range([0.5, 1]),
    [users]
  );

  const getTooltipData = (d) => {
    return [
      `User ID: ${d.userID}`,
      `Gender: ${d.gender}`,
      `Miscalibration: ${Number(d.error).toFixed(2)}`,
      `Stereotyping: ${Number(d.stereotyping).toFixed(2)}`,
      `Filter Bubble: ${Number(d.filter_bubble).toFixed(2)}`,
      "Occupation: Placeholder",
      "Location: Placeholder",
      "Age: Placeholder",
      "Top Genre: Placeholder",
    ];
  };

  const handleMouseMove = (event) => {
    if (tooltipData) {
      // Only update position if there is tooltip data to display
      setTooltipPosition({ x: event.clientX, y: event.clientY });
    }
  };

  const showTooltip = (data, position) => {
    setTooltipData(data);
    setTooltipPosition(position);
    setIsTooltipVisible(true);
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current); // Clear any pending timeout to hide the tooltip
    }
  };

  const hideTooltip = () => {
    tooltipTimeoutRef.current = setTimeout(() => {
      setIsTooltipVisible(false);
      setTooltipData(null);
    }, 100); // Delay the hiding to allow re-hovering over the tooltip itself or other elements
  };

  const cancelHideTooltip = () => {
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }
  };

  useEffect(() => {
    console.log("Explorer sees selectedUserId as:", selectedUserId);
  }, [selectedUserId]);

  // Handling user clicks, log the new selection
  const handleUserClick = (userId) => {
    console.log("User clicked in Explorer:", userId);
    setSelectedUserId((prev) => (prev === userId ? null : userId));
  };

  useEffect(() => {
    const svgElement = svgRef.current;
    svgElement.addEventListener("mousemove", handleMouseMove);

    return () => {
      svgElement.removeEventListener("mousemove", handleMouseMove);
    };
  }, [tooltipData]); // Re-bind event listener if tooltipData changes

  useEffect(() => {
    const handleKeyPress = (event) => {
      switch (event.key) {
        case "g": // 'g' for gender
          setGroup("gender");
          break;
        case "s": // 's' for stereotyping
          setGroup("stereotyping");
          break;
        case "m": // 'm' for miscalibration
          setGroup("miscalibration");
          break;
        case "f": // 'f' for filter bubble
          setGroup("filterBubble");
          break;
        default:
          break;
      }
      console.log(group);
    };

    window.addEventListener("keypress", handleKeyPress);
    return () => {
      window.removeEventListener("keypress", handleKeyPress);
    };
  }, []);

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
    svg.call(
      zoomBehavior.transform,
      d3.zoomIdentity.translate(200, 200).scale(0.75)
    );
  }, [layout]);

  useEffect(() => {
    const g = d3.select(gRef.current);
    const hasSelection = selectedUserId != null;

    // Utility to apply mouse events and handle clicks
    const applyMouseEvents = (selection) => {
      selection
        .on("mouseover", (event, d) => {
          const tooltipData = getTooltipData(d);
          showTooltip(tooltipData, { x: event.clientX, y: event.clientY });
        })
        .on("mouseout", hideTooltip)
        .on("click", (event, d) => handleUserClick(d.userID));
    };

    const gUsers = g
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
              const userGroup = d3.select(this);
              userGroup
                .append("circle")
                .attr("class", "selection_indicator")
                .attr("r", layout.circle.r * 2)
                .attr("cx", 0)
                .attr("cy", 0)
                .style("fill", "none")
                .style("stroke", "red")
                .style("stroke-width", 2)
                .style("visibility", "hidden");
            }),
        (update) =>
          update
            .transition()
            .duration(500)
            .attr(
              "transform",
              (d) => `translate(${xScale(d.x0_pred)}, ${yScale(d.x1_pred)})`
            ),
        (exit) => exit.remove()
      );

    // Update visibility and opacity based on selection state
    gUsers
      .selectAll(".selection_indicator")
      .style("visibility", (d) =>
        d.userID === selectedUserId ? "visible" : "hidden"
      );

    gUsers.style("opacity", (d) =>
      selectedUserId == null || d.userID === selectedUserId ? 1 : 0.2
    );

    // Append and style user circles
    gUsers.selectAll(".user_circle").remove();
    gUsers
      .append("circle")
      .attr("class", "user_circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", layout.circle.r)
      .style("fill", (d) => genderColorScale(d.gender));

    // Handle user rings
    gUsers.selectAll(".user_circle_bubble").remove();
    gUsers
      .append("circle")
      .attr("class", "user_circle_bubble")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", (d) => filterBubbleRadiusScale(d.filter_bubble))
      .style("fill", "none")
      .style("stroke", (d) => miscalibrationColorScale(d.error))
      .style("stroke-width", (d) => filterBubbleBorderScale(d.filter_bubble));

    // User stereotype path
    gUsers.selectAll("path.link").remove();
    gUsers
      .append("path")
      .attr("class", "link")
      .style("stroke", (d) => miscalibrationColorScale(d.error))
      .style("stroke-width", 0.6)
      .attr("d", (d) => {
        const theta = Math.atan2(
          d.x1_actual - d.x1_pred,
          d.x0_actual - d.x0_pred
        );
        const length = stereotypingLengthScale(Math.abs(d.stereotyping));
        return `M 0,0 L ${length * Math.cos(theta)},${
          length * Math.sin(theta)
        }`;
      });

    gUsers.classed("selected", (d) => d.userID === selectedUserId);

    gUsers.exit().remove();

    /*
    // Update color and stroke based on group
    gUsers
      .select(".user_circle")
      .style("fill", (d) => {
        switch (group) {
          case "gender":
            return genderColorScale(d.gender);
          case "stereotyping":
            return stereotypingColorScale(d.stereotyping);
          case "miscalibration":
            return miscalibrationColorScale(d.error);
          case "filterBubble":
            return filterBubbleColorScale(d.filter_bubble);
          default:
            return "grey";
        }
      })
      .style("stroke", (d) => {
        switch (group) {
          case "gender":
            return genderColorScale(d.gender);
          case "stereotyping":
            return stereotypingColorScale(d.stereotyping);
          case "miscalibration":
            return miscalibrationColorScale(d.error);
          case "filterBubble":
            return filterBubbleColorScale(d.filter_bubble);
          default:
            return "none";
        }
      })
      .style("stroke-width", (d) => (group === "gender" ? 2 : 0));*/

    // Reapply events to the entire group, including new circles
    gUsers.call(applyMouseEvents);
  }, [users, selectedUserId, group, xScale, yScale, layout]);

  return (
    <ExplorerWrapper>
      <svg width="100%" height="100%" ref={svgRef}></svg>
      {isTooltipVisible && (
        <CustomTooltip
          open={isTooltipVisible}
          position={tooltipPosition}
          content={tooltipData}
          onMouseLeave={hideTooltip}
          cancelHideTooltip={cancelHideTooltip}
        />
      )}
    </ExplorerWrapper>
  );
};

export default Explorer;
