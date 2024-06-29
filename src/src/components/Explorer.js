import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

import styled from 'styled-components';

import AlgoEffectViewer from './AlgoEffectViewer';

const ExplorerWrapper = styled.div.attrs({
    className: 'explorer_wrapper'
  })`
    // grid-area: e;
  `;

const Explorer = ({
  selectedUserId,
  users,
  group,
  protos,
  selectedAlgoEff,
  meanPref
}) => {
  const ref = useRef(null);
  const layout = {
    w: 500,
    h: 500,
    p: 50,
    circle: {
      r: 3
    },
    concentricCircles: {
      r: [0, 60, 120, 170, 210]
    }
  };

  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(users.map(d => d.x0_pred)))
    .range([layout.p, layout.w-layout.p]);
  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(users.map(d => d.x1_pred)))
    .range([layout.h-layout.p, layout.p]);

  const genderColorScale = d3
    .scaleOrdinal()
    .domain(['M', 'F'])
    .range(['blue', 'red']);

  const stereotypingColorScale = d3
    .scaleLinear()
    .domain([d3.min(users.map(d => d.stereotyping)), 0, d3.max(users.map(d => d.stereotyping))])
    .range(['blue', 'whitesmoke', 'red']);

  const miscalibrationColorScale = d3
    .scaleLinear()
    .domain([0, d3.max(users.map(d => d.error))])
    .range(['white', 'red']);

  const filterBubbleRadiusScale = d3
    .scaleLinear()
    .domain([0, d3.max(users.map(d => d.filter_bubble))])
    .range([layout.circle.r-1, layout.circle.r+1]);

  const filterBubbleColorScale = d3
    .scaleLinear()
    .domain([d3.min(users.map(d => d.filter_bubble)), 0, d3.max(users.map(d => d.filter_bubble))])
    .range(['blue', 'lightgray', 'red']);

  const typicalityColorScale = d3
    .scaleLinear()
    .domain([d3.min(users.map(d => d.pred_dev)), d3.max(users.map(d => d.pred_dev))])
    .range(['lightgray', 'red']);

  const filterBubbleBorderScale = d3
    .scaleLinear()
    .domain([0, d3.max(users.map(d => Math.abs(d.filter_bubble)))])
    .range([0.5, 1]);

  useEffect(() => {
    const svg = d3.select(ref.current);
    // users = users.filter(d => (d.is_cf === 1) || (d.is_focal === 1));

    console.log('users: ', users)
    console.log('users_cf; ', users.filter(d => d.is_cf === 1))
    console.log('users_focal; ', users.filter(d => d.is_focal === 1));

    svg.select('.g_layout').remove();
    svg.select('.g_users').remove();
    // svg.select('.g_selected_user_actual').remove();
    // svg.select('.g_selected_user_pred').remove();

    const gLayout = svg.append('g').attr('class', 'g_layout'),
      gUsers = svg.selectAll('.g_users').data(users);
    let gSelectedUsersActual = svg.selectAll('.g_selected_user_actual'),
      gSelectedUsersPred = svg.selectAll('.g_selected_user_pred');

    // gUsers.selectAll('circle').remove();
    // gUsers.selectAll('path').remove();
    gSelectedUsersActual.selectAll('circle').remove();
    gSelectedUsersActual.selectAll('path').remove();
    gUsers.exit().remove();
    gProtoUsers.exit().remove();
    // gProtoUsers.selectAll('circle').remove();
    // gProtoUsers.selectAll('path').remove();

    gUsers
      .enter()
      .append('g')
      .attr('class', 'g_users')
      .attr('transform', function(d) {
        return 'translate(' + xScale(d.x0_pred) + ',' + yScale(d.x1_pred) + ')';
      })
      .style('opacity', d => {
        let circleStroke = '';
        
        circleStroke = 0.4
        if (d.is_cf === 1) circleStroke = 1
        if (d.is_focal === 1) circleStroke = 1
        // return circleStroke
        return 1
      })

    const gUserCircles = gUsers
      .append('circle')
      .attr('class', 'user_circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', layout.circle.r)
      .style('opacity', d => {
        let circleOpacity = '';
        
        circleOpacity = 0.2
        if (d.is_cf === 1) circleOpacity = 1
        if (d.is_focal === 1) circleOpacity = 1
        // return circleOpacity
        return 0.05
      })
      .style('stroke', d => {
        let circleStroke = '';
        
        circleStroke = 'none';
        if (d.is_cf === 1) circleStroke = 'red';
        if (d.is_focal === 1) circleStroke = 'blue';
        return circleStroke
      })
      .on('mouseover', function(d) {
        const data = d3.select(this).data()[0];
        console.log('stereotype/pred_dev: ', data.stereotyping, data.pred_dev)
      });

    // gUsers
    //   .append('circle')
    //   .attr('class', 'user_circle_bubble')
    //   .attr('cx', 0)
    //   .attr('cy', 0)
    //   .attr('opacity', 0)
    //   .attr('r', d => filterBubbleRadiusScale(d.filter_bubble))
    //   .style('fill', 'none')
    //   .style('stroke', d => {
    //     let circleStroke = '';
        
    //     circleStroke = filterBubbleColorScale(d.filter_bubble)
    //     if (d.is_cf === 1) circleStroke = 'green';
    //     if (d.is_focal === 1) circleStroke = 'blue';
    //     return circleStroke
    //   })
    //   // .style('stroke-dasharray', '2,1')
    //   .style('stroke-width', d => {
    //     let strokeWidth = 1;
        
    //     strokeWidth = filterBubbleBorderScale(d.filter_bubble)
    //     if (d.is_cf === 1) strokeWidth = 4
    //     if (d.is_focal === 1) strokeWidth = 4
    //     return strokeWidth
    //   })
    //   // .style('fill-opacity', 0.4)
    //   .on('mouseover', function(d) {
    //     const data = d3.select(this).data()[0];
    //     console.log('stereotype/pred_dev: ', data.stereotyping, data.actual_dev, data.is_cf, data.is_focal)
    //   })

    // gUsers
    //   .append("path")
    //   .attr( "class", "link")
    //   .style( "stroke", "#000")
    //   .style('opacity', 1)
    //   // .attr('marker-start', (d) => "url(#arrow)")//attach the arrow from defs
    //   .style( "stroke-width", 0.5)
    //   .attr("d", (d) => {
    //     const theta = Math.atan2((d.x0_actual-d.x0_pred), (d.x1_actual-d.x1_pred));
    //     const length = 5
    //     return "M" + 0 + "," + 0 + "," + (length*Math.cos(theta)) + "," + (length*Math.sin(theta))
    //   });

    gUserCircles
      .style('fill', d => {
        let circleColor = '';
        
        if (group === '') circleColor ='gray';
        else if (group === 'gender') circleColor = genderColorScale(d.gender);
        else if (group === 'stereotyping') circleColor = stereotypingColorScale(d.stereotyping);
        else if (group === 'error') circleColor = miscalibrationColorScale(d.error)
        else if (group === 'filter_bubble') circleColor = filterBubbleColorScale(d.filter_bubble);
        else if (group === 'atypicality') circleColor = typicalityColorScale(d.pred_dev);

        return circleColor;
      });
    
    //***** Prototypes
    const gProtoUsers = svg
      .selectAll('.g_protos')
      .data(protos);

    gProtoUsers
      .enter()
      .append('g')
      .attr('class', 'g_protos')
      .attr('transform', function(d) {
        return 'translate(' + xScale(d.x0_pred) + ',' + yScale(d.x1_pred) + ')';
      })
      .style('opacity', d => {
        let circleStroke = '';
        
        circleStroke = 0.4
        if (d.is_cf === 1) circleStroke = 1
        if (d.is_focal === 1) circleStroke = 1
        // return circleStroke
        return 1
      });
      

    const gProtoUserCircles = gProtoUsers
      .append('path')
      .attr('class', 'proto_circle')
      .attr('d', d3.symbol().type(d3.symbolSquare))
      .attr('x', 0)
      .attr('y', 0)
      .attr('transform', 'rotate(45)')
      // .attr('r', layout.circle.r+10)
      .style('fill-opacity', d => {
        let circleOpacity = '';
        
        circleOpacity = 0.2
        if (d.is_cf === 1) circleOpacity = 1
        if (d.is_focal === 1) circleOpacity = 1
        // return circleOpacity
        return 0.7
      })
      .style('stroke', d => {
        let circleStroke = '';
        
        circleStroke = 'none';
        if (d.is_cf === 1) circleStroke = 'red';
        if (d.is_focal === 1) circleStroke = 'blue';
        return 'black'
      })
      .on('mouseover', function(d) {
        const data = d3.select(this).data()[0];
        console.log('stereotype/pred_dev: ', data.stereotyping, data.pred_dev)
      });

    gProtoUserCircles
      .style('fill', d => {
        let circleColor = '';
        
        if (group === '') circleColor ='gray';
        else if (group === 'gender') circleColor = genderColorScale(d.gender);
        else if (group === 'stereotyping') circleColor = stereotypingColorScale(d.stereotyping);
        else if (group === 'error') circleColor = miscalibrationColorScale(d.error)
        else if (group === 'filter_bubble') circleColor = filterBubbleColorScale(d.filter_bubble);
        else if (group === 'atypicality') circleColor = typicalityColorScale(d.pred_dev);

        return circleColor;
      });

    //***** Mean preference
    gLayout
      .append('circle')
      .attr('class', 'mean_pref')
      .attr('cx', xScale(meanPref[0]))
      .attr('cy', yScale(meanPref[1]))
      .attr('r', 4)
      .style('stroke', 'black')
      .style('stroke-width', 2)
      .style('fill', 'black')
      .on('mouseover', function(d) {
        const data = d3.select(this).data()[0];
      });

    //***** Typical-atypical line and 
    // line indicating typical-atypical
    gLayout.append('line')
      .style("stroke", "black")
      .style("stroke-width", 1)
      .style("stroke-dasharray", "4,2")
      .attr("x1", xScale(meanPref[0]))
      .attr("y1", yScale(meanPref[1]))
      .attr("x2", xScale(meanPref[0]) + layout.concentricCircles.r[layout.concentricCircles.r.length-1])
      .attr("y2", yScale(meanPref[1]));
    
    // text for 'typical'
    gLayout.append('text')
      .attr("x", xScale(meanPref[0]) + 10)
      .attr("y", yScale(meanPref[1]) + 10)
      .style('font-style', 'italic')
      .style('font-size', '0.7rem')
      .style('fill', 'gray')
      .text('typical');

    // text for 'atypical'
    gLayout.append('text')
      .attr("x", xScale(meanPref[0]) + layout.concentricCircles.r[layout.concentricCircles.r.length-1] - 10)
      .attr("y", yScale(meanPref[1]) + 10)
      .style('font-style', 'italic')
      .style('font-size', '0.7rem')
      .style('fill', 'gray')
      .text('atypical');

    //***** Render concentric circles to indicate the typicality centering the meanPref
    layout.concentricCircles.r.forEach((r, i) => {
      gLayout.append('circle')
        .attr('class', 'concentric_circle')
        .attr('cx', xScale(meanPref[0]))
        .attr('cy', yScale(meanPref[1]))
        .attr('r', r)
        .style('stroke', 'gray')
        .style('stroke-width', 0.5)
        .style('stroke-dasharray', '4,2')
        .style('fill', 'none');
    });

    //***** Render selected and counterfactual users
    const dataSelectedUser = users.filter(d => d.userID === selectedUserId);
    const dataCounterfactualUsers = [ users.filter(d => d.is_cf)[0] ];

    ['selected', 'counterfactual'].forEach(userType => {
      const dataUsers = (userType == 'selected') ? dataSelectedUser : dataCounterfactualUsers;

      gSelectedUsersPred.selectAll('circle').remove();

      gSelectedUsersPred
        .data(dataUsers)
        .enter()
        .append('g')
        .attr('class', 'g_selected_user_pred')
        .attr('transform', function(d) {
          return 'translate(' + xScale(d.x0_pred) + ',' + yScale(d.x1_pred) + ')';
        });

      const selectedUserPredCircle = gSelectedUsersPred
        .append('circle')
        .attr('class', 'selected_user_pred_circle' + userType)
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', 8)
        .style('stroke', 'black')
        .style('stroke-width', 2)
        .style('fill-opacity', 0.5)
        .on('mouseover', function(d) {
          const data = d3.select(this).data()[0];
          console.log('stereotype/pred_dev: ', data.stereotyping, data.actual_dev)
        });

      selectedUserPredCircle
        .style('fill', d => {
          let circleColor = '';
          if (group === '') circleColor ='gray';
          else if (group === 'gender') circleColor = genderColorScale(d.gender);
          else if (group === 'stereotyping') circleColor = stereotypingColorScale(d.stereotyping);
          else if (group === 'error') circleColor = miscalibrationColorScale(d.error)
          else if (group === 'filter_bubble') circleColor = filterBubbleColorScale(d.filter_bubble);
          else if (group === 'atypicality') circleColor = typicalityColorScale(d.pred_dev);

          return circleColor;
        });

      gSelectedUsersActual
        .data(dataUsers)
        .enter()
        .append('g')
        .attr('class', 'g_selected_user_actual')
        .attr('transform', function(d) {
          return 'translate(' + xScale(d.x0_actual) + ',' + yScale(d.x1_actual) + ')';
        });

      gSelectedUsersActual
        .append('circle')
        .attr('class', 'selected_user_actual_circle' + userType)
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', 8)
        .style('stroke', 'black')
        .style('stroke-width', 1)
        .style('stroke-dasharray', '4,2')
        .style('fill-opacity', 0.5)
        .style('fill', 'none')
        .on('mouseover', function(d) {
          const data = d3.select(this).data()[0];
        });

      //***** Arrow from actual to pred
      gSelectedUsersActual
        .append("path")
        .attr( "class", "link")
        .style( "stroke", "#000")
        .style('opacity', 1)
        .attr('marker-start', (d) => "url(#arrow)")//attach the arrow from defs
        .style( "stroke-width", 1.5)
        .attr("d", (d) => {
          const theta = Math.atan2((yScale(d.x1_pred)-yScale(d.x1_actual)), (xScale(d.x0_pred)-xScale(d.x0_actual)));
          const length = 15
          return "M" + 0 + "," + 0 + "," + (length*Math.cos(theta)) + "," + (length*Math.sin(theta))
        });
    });
  }, [ref.current, group])

  return (
    <ExplorerWrapper>
      <AlgoEffectViewer 
        selectedAlgoEff={selectedAlgoEff}
        users={users} 
        selectedUser={users.filter(d => d.userID === selectedUserId)[0]} 
      />
      <svg 
        width={layout.w} 
        height={layout.h} 
        // preserveAspectRatio="xMinYMin"
        ref={ref} 
      />
    </ExplorerWrapper>
  );
};

export default Explorer;
  