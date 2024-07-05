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
  cfUserId,
  users,
  group,
  protos,
  selectedAlgoEff,
  meanPref,
  setAlgoEff
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

  const algoEffs = [
    { 'name': 'miscalibration', 'label': 'Miscalibration', 'data': users.map(d => d.miscalibration) },
    { 'name': 'stereotype', 'label': 'Stereotype', 'data': users.map(d => d.stereotype) },
    { 'name': 'filterBubble', 'label': 'Filter Bubble', 'data': users.map(d => d.filterBubble) },
  ];
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

  const stereotypeColorScale = d3
    .scaleLinear()
    .domain([d3.min(users.map(d => d.stereotype)), 0, d3.max(users.map(d => d.stereotype))])
    .range(['blue', 'whitesmoke', 'red']);

  const miscalibrationColorScale = d3
    .scaleLinear()
    .domain([0, d3.max(users.map(d => d.miscalibration))])
    .range(['white', 'red']);

  const filterBubbleRadiusScale = d3
    .scaleLinear()
    .domain([0, d3.max(users.map(d => d.filterBubble))])
    .range([layout.circle.r-1, layout.circle.r+1]);

  const filterBubbleColorScale = d3
    .scaleLinear()
    .domain([d3.min(users.map(d => d.filterBubble)), 0, d3.max(users.map(d => d.filterBubble))])
    .range(['blue', 'lightgray', 'red']);

  const typicalityColorScale = d3
    .scaleLinear()
    .domain([d3.min(users.map(d => d.pred_dev)), d3.max(users.map(d => d.pred_dev))])
    .range(['lightgray', 'red']);

  const filterBubbleBorderScale = d3
    .scaleLinear()
    .domain([0, d3.max(users.map(d => Math.abs(d.filterBubble)))])
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
      gUsers = svg.selectAll('.g_users').data(users),
      gProtoUsers = svg.selectAll('.g_protos').data(protos);
    let gSelectedUsersActualSelected = svg.selectAll('.g_actual_selected'),
      gSelectedUsersPredSelected = svg.selectAll('.g_pred_selected'),
      gSelectedUsersActualCF = svg.selectAll('.g_actual_counterfactual'),
      gSelectedUsersPredCF = svg.selectAll('.g_pred_counterfactual');

    // gUsers.selectAll('circle').remove();
    // gUsers.selectAll('path').remove();
    gSelectedUsersActualSelected.exit().remove();
    gSelectedUsersPredSelected.exit().remove();
    gSelectedUsersActualCF.exit().remove();
    gSelectedUsersPredCF.exit().remove();
    // gSelectedUsersActual.selectAll('circle').remove();
    // gSelectedUsersActual.selectAll('path').remove();
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
        console.log('stereotype/pred_dev: ', data.stereotype, data.pred_dev)
      });

    gUserCircles
      .style('fill', d => {
        let circleColor = '';
        
        if (group === '') circleColor ='gray';
        else if (group === 'gender') circleColor = genderColorScale(d.gender);
        else if (group === 'stereotype') circleColor = stereotypeColorScale(d.stereotype);
        else if (group === 'miscalibration') circleColor = miscalibrationColorScale(d.miscalibration)
        else if (group === 'filterBubble') circleColor = filterBubbleColorScale(d.filterBubble);
        else if (group === 'atypicality') circleColor = typicalityColorScale(d.pred_dev);

        return circleColor;
      });
    
    //***** Prototypes
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
        console.log('stereotype/pred_dev: ', data.stereotype, data.pred_dev)
      });

    gProtoUserCircles
      .style('fill', d => {
        let circleColor = '';
        
        if (group === '') circleColor ='gray';
        else if (group === 'gender') circleColor = genderColorScale(d.gender);
        else if (group === 'stereotype') circleColor = stereotypeColorScale(d.stereotype);
        else if (group === 'miscalibration') circleColor = miscalibrationColorScale(d.miscalibration)
        else if (group === 'filterBubble') circleColor = filterBubbleColorScale(d.filterBubble);
        else if (group === 'atypicality') circleColor = typicalityColorScale(d.pred_dev);

        return circleColor;
      });

    // // const gProtoUserCirclesActual = gProtoUsers
    // //   .append('circle')
    // //   .attr('class', 'proto_circle')
    // //   // .attr('d', d3.symbol().type(d3.symbolSquare))
    // //   .attr('cx', 0)
    // //   .attr('cy', 0)
    // //   // .attr('transform', 'rotate(45)')
    // //   .attr('r', layout.circle.r+3)
    // //   .style('fill-opacity', d => {
    // //     let circleOpacity = '';
        
    // //     circleOpacity = 0.2
    // //     if (d.is_cf === 1) circleOpacity = 1
    // //     if (d.is_focal === 1) circleOpacity = 1
    // //     // return circleOpacity
    // //     return 0.7
    // //   })
    // //   .style('stroke', d => {
    // //     let circleStroke = '';
        
    // //     circleStroke = 'none';
    // //     if (d.is_cf === 1) circleStroke = 'red';
    // //     if (d.is_focal === 1) circleStroke = 'blue';
    // //     return 'black'
    // //   })
    // //   .on('mouseover', function(d) {
    // //     const data = d3.select(this).data()[0];
    // //     console.log('stereotype/pred_dev: ', data.stereotype, data.pred_dev)
    // //   });

    // // gProtoUserCirclesActual
    // //   .style('fill', d => {
    // //     let circleColor = '';
        
    // //     if (group === '') circleColor ='gray';
    // //     else if (group === 'gender') circleColor = genderColorScale(d.gender);
    // //     else if (group === 'stereotype') circleColor = stereotypeColorScale(d.stereotype);
    // //     else if (group === 'miscalibration') circleColor = miscalibrationColorScale(d.miscalibration)
    // //     else if (group === 'filterBubble') circleColor = filterBubbleColorScale(d.filterBubble);
    // //     else if (group === 'atypicality') circleColor = typicalityColorScale(d.pred_dev);

    // //     return circleColor;
    // //   });

    // gProtoUsers
    //   .append('circle')
    //   .attr('class', 'user_circle_bubble')
    //   .attr('cx', 0)
    //   .attr('cy', 0)
    //   .attr('opacity', 0)
    //   .attr('r', d => filterBubbleRadiusScale(d.filterBubble))
    //   .style('fill', 'none')
    //   .style('stroke', d => {
    //     let circleStroke = '';
        
    //     circleStroke = filterBubbleColorScale(d.filterBubble)
    //     if (d.is_cf === 1) circleStroke = 'green';
    //     if (d.is_focal === 1) circleStroke = 'blue';
    //     return circleStroke
    //   })
    //   // .style('stroke-dasharray', '2,1')
    //   .style('stroke-width', d => {
    //     let strokeWidth = 1;
        
    //     strokeWidth = filterBubbleBorderScale(d.filterBubble)
    //     if (d.is_cf === 1) strokeWidth = 4
    //     if (d.is_focal === 1) strokeWidth = 4
    //     return strokeWidth
    //   })
    //   // .style('fill-opacity', 0.4)
    //   .on('mouseover', function(d) {
    //     const data = d3.select(this).data()[0];
    //     console.log('stereotype/pred_dev: ', data.stereotype, data.actual_dev, data.is_cf, data.is_focal)
    //   })

    // gProtoUsers
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
    console.log('is_cf? ', users.filter(d => d.is_cf));
    const dataSelectedUser = users.filter(d => d.userID === selectedUserId);
    const dataCounterfactualUsers = users.filter(d => d.userId === cfUserId);
    // console.log('dataCounterfactualUsers: ', [ users.filter(d => d.is_cf)[0] ])

    console.log('dataSelectedUser: ', dataSelectedUser);
    console.log('dataCounterfactualUsers: ', dataCounterfactualUsers);

    ['selected', 'counterfactual'].forEach(userType => {
      const dataUsers = (userType == 'selected') ? dataSelectedUser : dataCounterfactualUsers;
      const gSelectedUsersPred = (userType == 'selected') ? gSelectedUsersPredSelected : gSelectedUsersPredCF;
      const gSelectedUsersActual = (userType == 'selected') ? gSelectedUsersActualSelected : gSelectedUsersActualCF;

      gSelectedUsersPred.selectAll('circle').remove();
      gSelectedUsersPred.selectAll('path').remove();
      gSelectedUsersPred.selectAll('line').remove();
      gSelectedUsersActual.selectAll('circle').remove();
      gSelectedUsersActual.selectAll('path').remove();
      gSelectedUsersActual.selectAll('line').remove();

      gSelectedUsersPred
        .data(dataUsers)
        .enter()
        .append('g')
        .attr('class', 'g_pred_' + userType)
        .attr('transform', function(d) {
          return 'translate(' + xScale(d.x0_pred) + ',' + yScale(d.x1_pred) + ')';
        });

      const selectedUserPredCircle = gSelectedUsersPred
        .append('circle')
        .attr('class', 'pred_circle_' + userType)
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', 8)
        .style('stroke', 'black')
        .style('stroke-width', 2)
        .style('fill-opacity', 0.5)
        .on('mouseover', function(d) {
          const data = d3.select(this).data()[0];
          console.log('stereotype/pred_dev: ', data.stereotype, data.actual_dev)
        });

      selectedUserPredCircle
        .style('fill', d => {
          let circleColor = '';
          if (group === '') circleColor ='gray';
          else if (group === 'gender') circleColor = genderColorScale(d.gender);
          else if (group === 'stereotype') circleColor = stereotypeColorScale(d.stereotype);
          else if (group === 'miscalibration') circleColor = miscalibrationColorScale(d.miscalibration)
          else if (group === 'filterBubble') circleColor = filterBubbleColorScale(d.filterBubble);
          else if (group === 'atypicality') circleColor = typicalityColorScale(d.pred_dev);

          return circleColor;
        });

      gSelectedUsersActual
        .data(dataUsers)
        .enter()
        .append('g')
        .attr('class', 'g_actual_' + userType)
        .attr('transform', function(d) {
          return 'translate(' + xScale(d.x0_actual) + ',' + yScale(d.x1_actual) + ')';
        });

      gSelectedUsersActual
        .append('circle')
        .attr('class', 'actual_circle_' + userType)
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
        .attr('marker-start', (d) => "url(#arrow)") //attach the arrow from defs
        .style( "stroke-width", 1.5)
        .attr("d", (d) => {
          const theta = Math.atan2((yScale(d.x1_pred)-yScale(d.x1_actual)), (xScale(d.x0_pred)-xScale(d.x0_actual)));
          const length = 15
          return "M" + 0 + "," + 0 + "," + (length*Math.cos(theta)) + "," + (length*Math.sin(theta))
        });

      gSelectedUsersActual
        .append("line")
        .attr( "class", "from_actual_to_pred")
        .attr('x1', d => 0)
        .attr('y1', d => 0)
        .attr('x2', d => xScale(d.x0_pred) - xScale(d.x0_actual))
        .attr('y2', d => yScale(d.x1_pred) - yScale(d.x1_actual))
        .style("stroke", "#000")
        .style('opacity', 1)
        .attr('marker-start', (d) => "url(#arrow)")//attach the arrow from defs
        .style("stroke-width", 1)
        .style('stroke-dasharray', '6,3')
        // .attr("d", (d) => {
        //   const theta = Math.atan2((yScale(d.x1_pred)-yScale(d.x1_actual)), (xScale(d.x0_pred)-xScale(d.x0_actual)));
        //   const length = Math.sqrt(Math.pow(yScale(d.x1_pred)-yScale(d.x1_actual), 2)) + Math.pow((xScale(d.x0_pred)-xScale(d.x0_actual), 2))
        //   return "M" + 0 + "," + 0 + "," + (length*Math.cos(theta)) + "," + (length*Math.sin(theta))
        // });

      gSelectedUsersActual
        .append('text')
        .attr('x', 0)
        .attr('y', 0)
        .style('stroke', 'white')
        .style('stroke-width', 0.5)
        .style('fill', 'black')
        .style('font-weight', 'bold')
        .text(userType)
    });
  }, [ref.current, users, group])

  return (
    <ExplorerWrapper>
      <AlgoEffectViewer 
        algoEffs={algoEffs}
        selectedAlgoEff={selectedAlgoEff}
        users={users} 
        selectedUser={users.filter(d => d.userID === selectedUserId)[0]}
        setAlgoEff={setAlgoEff}
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
  