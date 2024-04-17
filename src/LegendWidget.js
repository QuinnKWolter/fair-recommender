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
`;

const Legend = styled.div`
  margin-top: 10px;
`;

const ColorSwatch = styled.span`
  display: inline-block;
  width: 20px;
  height: 20px;
  background: ${(props) => props.color};
  border: 1px solid #ccc;
  margin-right: 5px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
`;

const Description = styled.span`
  margin-left: 5px;
`;

const SVGIcon = styled.svg`
  width: 20px;
  height: 20px;
  margin-right: 5px;
`;

export default function LegendWidget() {
  return (
    <WidgetContainer>
      <Title>Project Contributors</Title>
      <List>
        <ListItem>Dr. Yu-Ru Lin</ListItem>
        <ListItem>Yongsu Ahn</ListItem>
        <ListItem>Quinn K Wolter</ListItem>
        <ListItem>Jonilyn Dick</ListItem>
        <ListItem>Janet Dick</ListItem>
      </List>
      <Legend>
        <Title>Legend</Title>
        <LegendItem>
          <ColorSwatch color="#4676f4" />
          <ColorSwatch color="#ce4e6c" />
          <Description>Gender: Male (Blue), Female (Red)</Description>
        </LegendItem>
        <LegendItem>
          <ColorSwatch
            style={{ background: "linear-gradient(to right, #111, #eee)" }}
          />
          <Description>Miscalibration: Scale (Black to White)</Description>
        </LegendItem>
        <LegendItem>
          <SVGIcon viewBox="0 0 20 20">
            <circle
              cx="10"
              cy="10"
              r="7"
              fill="none"
              stroke="black"
              strokeWidth="2"
            />
          </SVGIcon>
          <Description>
            Filter Bubble Effect: Visualized by ring size
          </Description>
        </LegendItem>
        <LegendItem>
          <SVGIcon viewBox="0 0 20 20">
            <rect x="3" y="9" width="14" height="2" fill="black" />
          </SVGIcon>
          <Description>
            Stereotyping Strength: Visualized by path length
          </Description>
        </LegendItem>
      </Legend>
    </WidgetContainer>
  );
}
