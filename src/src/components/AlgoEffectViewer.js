import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
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
  algoEffs,
  selectedAlgoEff,
  selectedUser,
  users,
  setAlgoEff,
  colorScales
}) => {
  let refs = Array(3).fill(0);
  
  refs[0] = useRef(null);
  refs[1] = useRef(null);
  refs[2] = useRef(null);

  const layout = {
    w: 500,
    h: 35,
    p: 50,
    circle: {
      r: 3
    }
  };

  useEffect(() => {
    const padding = 9;
    const width = 320;
    const innerWidth = width - (padding * 2);
    const barHeight = 8;
    const height = 28;

    d3.selectAll('.g_scale_bar').remove();

    const renderScaleBar = (currentAlgoEff, selectedUser, selectedAlgoEff, currentAlgoEffColorScale, ref, idx) => {
      const dataAlgoEff = currentAlgoEff.data,
        userAlgoEff = selectedUser[currentAlgoEff.name], 
        isSelected = selectedAlgoEff==currentAlgoEff.name || selectedAlgoEff=='all'; 

      const svg = d3.select(ref.current);
      svg.selectAll('defs').remove();

      const dataDomain = [d3.min(dataAlgoEff), 0, d3.max(dataAlgoEff)];
      const xAlgoEffScale = d3.scaleLinear()
        .domain(d3.extent(dataAlgoEff))
        .range([0, innerWidth]);

      const xAxis = d3.axisBottom(xAlgoEffScale)
          .tickSize(barHeight * 2)
          .tickValues(dataDomain);

      const g = svg.append("g")
          .attr('class', 'g_scale_bar')
          .attr("transform", "translate(" + (padding) + ", 0)")
          .style('opacity', isSelected ? 1 : 0.2);

      const linearGradient = svg.append("defs").append("linearGradient").attr("id", "scale_bar_gradient_" + currentAlgoEff.name);
      linearGradient.selectAll("stop")
          .data(dataDomain)
          .enter().append("stop")
          .attr("offset", d => ((xAlgoEffScale(d)-xAlgoEffScale(dataDomain[0]))/(xAlgoEffScale(dataDomain[2])-xAlgoEffScale(dataDomain[0])) * 100) + '%')
          .attr("stop-color", d => currentAlgoEffColorScale(d));

      g.append("rect")
          .attr("width", innerWidth)
          .attr("height", barHeight)
          .style("fill", "url(#scale_bar_gradient_" + currentAlgoEff.name + ")")
          .style('stroke', 'None')
          .style('stroke-width', 1);

      g.append("g")
          .call(xAxis)
        .select(".domain").remove();

      g.append('path')
        .attr('class', 'user_algo_eff')
        .attr('d', d3.symbol().type(d3.symbolTriangle))
        .attr('transform', function(d) {
          return 'translate(' + xAlgoEffScale(userAlgoEff) + ',' + (barHeight * 2) + ')';
        });
    }
    
    algoEffs.forEach((currentAlgoEff, i) => {
      renderScaleBar(
        currentAlgoEff, 
        selectedUser, 
        selectedAlgoEff, 
        colorScales[currentAlgoEff.name], 
        refs[i], 
        i
      );
    });
  }, [refs[0].current, refs[1].current, refs[2].current, selectedAlgoEff])

  return (
    <AlgoEffectViewerWrapper>
      {algoEffs.map((algoEff, i) => 
        (<ScaleBarWrapper key={algoEff.name}>
          <div 
            style={{ width: '90px', opacity: (selectedAlgoEff==algoEff.name || selectedAlgoEff=='all') ? 1 : 0.2 }}
            onClick={() => setAlgoEff(algoEff.name)}
          >{algoEff.label}</div>&emsp;
          <svg 
            width={layout.w} 
            height={layout.h} 
            ref={refs[i]} 
          />
        </ScaleBarWrapper>)
      )}
      <FormGroup>
        <FormControlLabel 
          sx={{ 
            '& .MuiFormControlLabel-label': { fontSize: '0.9rem' },
            marginTop: '-7px'
          }}
          control={
            <Checkbox 
              defaultChecked 
              size="small" 
              sx={{ '& .MuiSvgIcon-root': { fontSize: 15 } }}/>
          } 
          checked={(selectedAlgoEff == 'all' ? true : false)}
          // onChange={(event) => (selectedAlgoEff == 'all' ? true : false)}
          label="All" 
        />
      </FormGroup>
    </AlgoEffectViewerWrapper>
  );
};

export default AlgoEffectViewer;
