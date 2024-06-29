import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

import styled from 'styled-components';

const AlgoEffectViewerWrapper = styled.div.attrs({
    className: 'explorer_wrapper'
  })`
    // grid-area: e;
  `;

const ScaleBarWrapper = styled.div.attrs({
    className: 'slider_wrapper'
  })`
    width: 100%;
    display: flex;
  `;

const AlgoEffectViewer = ({
  selectedAlgoEff,
  selectedUser,
  users,
}) => {
  const ref0 = useRef(null),
    ref1 = useRef(null),
    ref2 = useRef(null);
  const layout = {
    w: 500,
    h: 35,
    p: 50,
    circle: {
      r: 3
    }
  };

  const stereotypes = users.map(d => d.stereotyping),
      miscalibrations = users.map(d => d.error),
      filterBubbles = users.map(d => d.filter_bubble);

  useEffect(() => {
    // d3-legend module: https://d3-legend.susielu.com/
    // gradient legend bar: https://gist.github.com/HarryStevens/6eb89487fc99ad016723b901cbd57fde
    // gradient generator tool: https://www.learnui.design/tools/gradient-generator.html
    
    const padding = 9;
    const width = 320;
    const innerWidth = width - (padding * 2);
    const barHeight = 8;
    const height = 28;

    d3.selectAll('.g_scale_bar').remove();

    const renderScaleBar = (dataAlgoEff, userAlgoEff, isSelected, ref, idx) => {
      const svg = d3.select(ref.current);
      const dataDomain = [d3.min(dataAlgoEff), 0, d3.max(dataAlgoEff)];
      const xAlgoEffScale = d3.scaleLinear()
        .domain(d3.extent(dataAlgoEff))
        .range([0, innerWidth]);

      const colorScale = d3.scaleLinear()
          .domain(dataDomain)
          .range(['blue', 'whitesmoke', 'red']);

      const xAxis = d3.axisBottom(xAlgoEffScale)
          .tickSize(barHeight * 2)
          .tickValues(dataDomain);

      const g = svg.append("g")
          .attr('class', 'g_scale_bar')
          .attr("transform", "translate(" + (padding) + ", 0)");

      const defs = svg.append("defs");
      const linearGradient = defs.append("linearGradient").attr("id", "scale_bar_gradient");
      linearGradient.selectAll("stop")
          .data(dataDomain)
        .enter().append("stop")
          .attr("offset", d => ((xAlgoEffScale(d)-xAlgoEffScale(dataDomain[0]))/(xAlgoEffScale(dataDomain[2])-xAlgoEffScale(dataDomain[0])) * 100) + '%')
          .attr("stop-color", d => colorScale(d));

      g.append("rect")
          .attr("width", innerWidth)
          .attr("height", barHeight)
          .style("fill", "url(#scale_bar_gradient)")
          .style('stroke', 'black')
          .style('stroke-width', 1);

      g.append("g")
          .call(xAxis)
        .select(".domain").remove();

      g.append('path')
        .attr('class', 'user_algo_eff')
        .attr('d', d3.symbol().type(d3.symbolTriangle))
        .attr('transform', function(d) {
          return 'translate(' + xAlgoEffScale(userAlgoEff) + ',' + (barHeight * 2) + ')';
        })
        // .attr('x', xAlgoEffScale(userAlgoEff))
        // .attr('y', 0);
    }
    
    renderScaleBar(stereotypes, selectedUser.stereotyping, selectedAlgoEff=='stereotyping', ref0, 1);
    renderScaleBar(miscalibrations, selectedUser.error, selectedAlgoEff=='error', ref1, 2);
    renderScaleBar(filterBubbles, selectedUser.filter_bubble, selectedAlgoEff=='filter_bubble', ref2, 3);
  }, [ref0.current, ref1.current, ref2.current])

  return (
    <AlgoEffectViewerWrapper>
      <h2>Algorithmic effects</h2>
      <ScaleBarWrapper>
        <div style={{ width: '90px' }}>{'Miscalibration'}</div>&emsp;
        <svg 
          width={layout.w} 
          height={layout.h} 
          // preserveAspectRatio="xMinYMin"
          ref={ref0} 
        />
      </ScaleBarWrapper>
      <ScaleBarWrapper>
        <div style={{ width: '90px' }}>{'Stereotype'}</div>&emsp;
        <svg 
          width={layout.w} 
          height={layout.h} 
          // preserveAspectRatio="xMinYMin"
          ref={ref1} 
        />
      </ScaleBarWrapper>
      <ScaleBarWrapper>
        <div style={{ width: '90px' }}>{'Filter Bubble'}</div>&emsp;
        <svg 
          width={layout.w} 
          height={layout.h} 
          // preserveAspectRatio="xMinYMin"
          ref={ref2} 
        />
      </ScaleBarWrapper>
      
      
    </AlgoEffectViewerWrapper>
  );
};

export default AlgoEffectViewer;
  