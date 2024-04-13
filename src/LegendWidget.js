import React from "react";
import styled from "styled-components";

const WidgetContainer = styled.div`
  position: fixed;
  bottom: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.7);
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: auto;
  z-index: 10;
`;

const Title = styled.h3`
  margin-top: 0;
  color: #333;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
`;

const ListItem = styled.li`
  margin-bottom: 5px;
  font-size: 14px;
  color: #666;
`;

const Legend = styled.div`
  margin-top: 10px;
`;

const ColorSwatch = styled.span`
  display: inline-block;
  width: 20px;
  height: 20px;
  background-color: ${(props) => props.color};
  border: 1px solid #ccc;
  margin-right: 5px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
`;

export default function LegendWidget() {
  return (
    <WidgetContainer>
      <Title>Project Contributors</Title>
      <List>
        <ListItem>Dr. Yu-Ru Lin</ListItem>
        <ListItem>Yongsu Ahn</ListItem>
        <ListItem>Jonilyn Dick</ListItem>
        <ListItem>Janet Dick</ListItem>
        <ListItem>Quinn K Wolter</ListItem>
      </List>
      <Legend>
        <Title>Legend</Title>
        <LegendItem>
          <ColorSwatch color="blue" /> Male (Blue)
        </LegendItem>
        <LegendItem>
          <ColorSwatch color="red" /> Female (Red)
        </LegendItem>
        <LegendItem>
          <ColorSwatch color="gray" /> Default/No Data (Gray)
        </LegendItem>
        <LegendItem>
          <ColorSwatch color="lightgray" /> Miscalibration (Light Gray to Red)
        </LegendItem>
        <LegendItem>
          <ColorSwatch
            color="blue"
            style={{
              background: "linear-gradient(to right, blue, lightgray, red)",
            }}
          />{" "}
          Stereotyping (Blue to Red)
        </LegendItem>
        <LegendItem>
          <ColorSwatch
            color="blue"
            style={{
              background: "linear-gradient(to right, blue, lightgray, red)",
            }}
          />{" "}
          Filter Bubble (Blue to Red)
        </LegendItem>
      </Legend>
    </WidgetContainer>
  );
}
