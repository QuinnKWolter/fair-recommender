import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import d3tooltip from 'd3-tooltip';

import styled from 'styled-components';

import AlgoEffectViewer from './AlgoEffectViewer';

const ExplorerWrapper = styled.div.attrs({
    className: 'explorer_wrapper'
  })`
    // grid-area: e;
  `;

const tooltip = d3tooltip(d3);

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
      all: { r: 3 },
      proto: { r: 8 },
      selected: { r: 11 },
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

  const filterBubbleRadiusScaleForProtos = d3
      .scaleLinear()
      .domain([d3.min(users.map(d => d.filterBubble)), 0, d3.max(users.map(d => d.filterBubble))])
      .range([8, 0, -8]),
    filterBubbleRadiusScaleForUsers = d3
      .scaleLinear()
      .domain([d3.min(users.map(d => d.filterBubble)), 0, d3.max(users.map(d => d.filterBubble))])
      .range([3, 0, -3]),
    filterBubbleRadiusScaleForSelected = d3
      .scaleLinear()
      .domain([d3.min(users.map(d => d.filterBubble)), 0, d3.max(users.map(d => d.filterBubble))])
      .range([10, 0, -10]);

  const filterBubbleColorScale = d3
    .scaleLinear()
    .domain([d3.min(users.map(d => d.filterBubble)), 0, d3.max(users.map(d => d.filterBubble))])
    .range(['blue', 'white', 'red']);

  const typicalityColorScale = d3
    .scaleLinear()
    .domain([d3.min(users.map(d => d.pred_dev)), d3.max(users.map(d => d.pred_dev))])
    .range(['lightgray', 'red']);

  const diversityRadiusScaleForProtos = d3
      .scaleLinear()
      .domain([d3.min(users.map(d => d.pred_entropy)), d3.max(users.map(d => d.pred_entropy))])
      .range([layout.circle.proto.r-3, layout.circle.proto.r+3]),
    diversityRadiusScaleForUsers = d3
      .scaleLinear()
      .domain([d3.min(users.map(d => d.pred_entropy)), d3.max(users.map(d => d.pred_entropy))])
      .range([layout.circle.all.r-2, layout.circle.all.r+3]),
    diversityRadiusScaleForSelected = d3
      .scaleLinear()
      .domain([d3.min(users.map(d => d.pred_entropy)), d3.max(users.map(d => d.pred_entropy))])
      .range([layout.circle.selected.r-2, layout.circle.selected.r+3]);

  useEffect(() => {
    const svg = d3.select(ref.current);

    svg.select('.g_layout').remove();
    svg.select('.g_users').remove();

    const gLayout = svg.append('g').attr('class', 'g_layout'),
      gUsers = svg.selectAll('.g_users').data(users),
      gProtoUsers = svg.selectAll('.g_protos').data(protos);
    let gSelected = svg.selectAll('.g_selected'),
      gCF = svg.selectAll('.g_counterfactual'),
      gSelectedUsersActualSelected = svg.selectAll('.g_actual_selected'),
      gSelectedUsersPredSelected = svg.selectAll('.g_pred_selected'),
      gSelectedUsersActualCF = svg.selectAll('.g_actual_counterfactual'),
      gSelectedUsersPredCF = svg.selectAll('.g_pred_counterfactual');

    // gUsers.selectAll('circle').remove();
    // gUsers.selectAll('path').remove();
    gSelected.exit().remove();
    gCF.exit().remove();
    gSelected.selectAll('circle').remove();
    gSelected.selectAll('path').remove();
    gCF.selectAll('circle').remove();
    gCF.selectAll('path').remove();
    gSelectedUsersActualSelected.exit().remove();
    gSelectedUsersPredSelected.exit().remove();
    gSelectedUsersActualCF.exit().remove();
    gSelectedUsersPredCF.exit().remove();
    // gSelectedUsersActual.selectAll('circle').remove();
    // gSelectedUsersActual.selectAll('path').remove();
    gUsers.exit().remove();
    gUsers.selectAll('circle').remove();
    gUsers.selectAll('path').remove();
    gProtoUsers.exit().remove();
    gProtoUsers.selectAll('circle').remove();
    gProtoUsers.selectAll('path').remove();

    const colorScale = (selectedAlgoEff == 'miscalibration') ? miscalibrationColorScale
                          : (selectedAlgoEff == 'stereotype' ? stereotypeColorScale : filterBubbleColorScale);

    renderLayout(gLayout);

    //***** Users and Prototypes
    gUsers
      .enter()
      .append('g')
      .attr('class', 'g_users')
      .attr('transform', function(d) {
        return 'translate(' + xScale(d.x0_pred) + ',' + yScale(d.x1_pred) + ')';
      })
      .style('opacity', 1);
    
    gProtoUsers
      .enter()
      .append('g')
      .attr('class', 'g_protos')
      .attr('transform', function(d) {
        return 'translate(' + xScale(d.x0_pred) + ',' + yScale(d.x1_pred) + ')';
      })
      .style('opacity', 1);
      
    if (selectedAlgoEff == 'all') {
      renderGlyphs(
        'proto',
        gProtoUsers, 
        diversityRadiusScaleForProtos,
        filterBubbleRadiusScaleForProtos,
        miscalibrationColorScale
      );
  
      renderGlyphs(
        'user',
        gUsers, 
        diversityRadiusScaleForUsers,
        filterBubbleRadiusScaleForUsers,
        miscalibrationColorScale
      );
    } else { 
      renderProtos(gProtoUsers, selectedAlgoEff, colorScale); 
      renderUsers(gUsers, selectedAlgoEff, colorScale);
    }
    

    svg
      .append('defs')
      .append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', [0, 0, 5, 5])
      .attr('refX', 2.5)
      .attr('refY', 2.5)
      .attr('markerWidth', 5)
      .attr('markerHeight', 5)
      .attr('orient', 'auto-start-reverse')
      .append('path')
      .attr('d', d3.line()([[0, 0], [0, 5], [5, 2.5]]))
      .attr('stroke', 'black');

    //***** Render selected and counterfactual users
    const dataSelectedUser = users.filter(d => d.userID === selectedUserId);
    const dataCounterfactualUsers = users.filter(d => d.userID === cfUserId);

    console.log('dataSelectedUser: ', dataSelectedUser);
    console.log('dataCounterfactualUsers: ', dataCounterfactualUsers);

    ['selected', 'counterfactual'].forEach(userType => {
      const dataSelected = (userType == 'selected') ? dataSelectedUser : dataCounterfactualUsers;
      const gSelectedUser = (userType == 'selected') ? gSelected : gCF;
      const gUserPred = (userType == 'selected') ? gSelectedUsersPredSelected : gSelectedUsersPredCF;
      const gUserActual = (userType == 'selected') ? gSelectedUsersActualSelected : gSelectedUsersActualCF;

      gSelectedUser
        .data(dataSelected)
        .enter()
        .append('g')
        .attr('class', 'g_' + userType)
        .attr('transform', function(d) {
          return 'translate(' + xScale(d.x0_pred) + ',' + yScale(d.x1_pred) + ')';
        })
        .style('opacity', 1);

      if (selectedAlgoEff == 'all') {
        renderGlyphs(
          'selected',
          gSelectedUser, 
          diversityRadiusScaleForSelected,
          filterBubbleRadiusScaleForSelected,
          miscalibrationColorScale
        );

        gSelectedUser
          .append('text')
          .attr('x', 0)
          .attr('y', 0)
          .style('stroke', 'white')
          .style('stroke-width', 0.5)
          .style('fill', 'black')
          .style('font-weight', 'bold')
          .text(userType);
      } else { 
        renderSelectedUsers(
          userType,
          gSelectedUser, 
          selectedAlgoEff, 
          colorScale
        );
      }

      // renderStereotype(userType, dataUsers, meanPref, gUserActual, gUserPred); // userType == 'selected' or 'counterfactual'

      // explanations
      d3.select('actual_circle_' + userType)
        .on('mouseover', function(d, i) {
          console.log('mouseovered');
          d3.select(this)
            .style('stroke-width', 2);
            const text =
              '<div style="font-weight: 600">' +
              '1111' +
              '</div>';

            tooltip.html(text);
            tooltip.show();
        })
    });

    
  }, [ref.current, selectedAlgoEff, users, group])

  const renderProtos = (gProtoUsers, selectedAlgoEff, colorScale) => {
    gProtoUsers
      .append('path')
      .attr('class', 'proto_circle')
      .attr('d', d3.symbol().type(d3.symbolSquare))
      .attr('x', 0)
      .attr('y', 0)
      .attr('transform', 'rotate(45)')
      // .attr('r', layout.circle.r+10)
      .style('fill-opacity', 0.7)
      .style('stroke', 'black')
      .style('fill', d => colorScale(d[selectedAlgoEff]));
  }

  const renderSelectedUsers = (userType, gSelectedUsers, selectedAlgoEff, colorScale) => {
    gSelectedUsers
      .append('circle')
      .attr('class', 'user_circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', layout.circle.selected.r)
      .style('opacity', 1)
      .style('fill', d => colorScale(d[selectedAlgoEff]))
      .style('stroke', 'black')
      .style('stroke-width', 2);

    gSelectedUsers
      .append('text')
      .attr('x', 0)
      .attr('y', 0)
      .style('stroke', 'white')
      .style('stroke-width', 0.5)
      .style('fill', 'black')
      .style('font-weight', 'bold')
      .text(userType);
  }

  const renderUsers = (gUsers, selectedAlgoEff, colorScale) => {
    gUsers
      .append('circle')
      .attr('class', 'user_circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', layout.circle.all.r)
      .style('opacity', 0.2)
      .style('fill', d => colorScale(d[selectedAlgoEff]))
      .on('mouseover', d => console.log('ste: ', d.stereotype))
  }

  const renderLayout = (gLayout) => {
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
  }

  const renderGlyphs = (
    mode,
    gUsers, 
    diversityRadiusScale,
    filterBubbleRadiusScale,
    miscalibrationColorScale
  ) => {
    const opacityForActual = ((mode == 'proto') || (mode == 'selected')) ? 1 : 0.2;
    const opacityForPred = ((mode == 'proto') || (mode == 'selected')) ? 1 : 0.5;
    const opacityForStereotype = ((mode == 'proto') || (mode == 'selected')) ? 1 : 0.3;

    gUsers
      .append('circle')
      .attr('class', 'glyph_actual_' + mode)
      // .attr('d', d3.symbol().type(d3.symbolSquare))
      .attr('cx', 0)
      .attr('cy', 0)
      // .attr('transform', 'rotate(45)')
      .attr('r', d => diversityRadiusScale(d.pred_entropy))
      .style('fill', 'red')
      .style('opacity', opacityForActual)
      .style('stroke-dasharray', '2,2')
      .style('stroke-width', 3)
      .style('stroke', 'red')
      .on('mouseover', function(d) {
        const data = d3.select(this).data()[0];
      })

    gUsers
      .append('circle')
      .attr('class', 'glyph_pred' + mode)
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('opacity', opacityForPred)
      .attr('r', d => diversityRadiusScale(d.pred_entropy) + filterBubbleRadiusScale(d.filterBubble))
      .style('fill', d => miscalibrationColorScale(d.miscalibration))
      .style('stroke', d => 'white')
      .style('stroke-width', 2)
      // .style('fill-opacity', 0.4)
      .on('mouseover', function(d) {
        const data = d3.select(this).data()[0];
      });

    gUsers
      .append("path")
      .attr( "class", "glyph_stereotype")
      .style( "stroke", "#000")
      .style('opacity', opacityForStereotype)
      // .attr('marker-start', (d) => "url(#arrow)")//attach the arrow from defs
      .style( "stroke-width", 0.5)
      .attr("d", (d) => {
        const theta = Math.atan2((d.x0_actual-d.x0_pred), (d.x1_actual-d.x1_pred));
        const length = 5;
        return "M" + 0 + "," + 0 + "," + (length*Math.cos(theta)) + "," + (length*Math.sin(theta))
      });
  }

  const renderStereotype = (userType, dataUsers, meanPref, gUserActual, gUserPred) => {

    gUserPred.selectAll('circle').remove();
    gUserPred.selectAll('path').remove();
    gUserPred.selectAll('line').remove();
    gUserActual.selectAll('circle').remove();
    gUserActual.selectAll('path').remove();
    gUserActual.selectAll('line').remove();

    gUserPred
      .data(dataUsers)
      .enter()
      .append('g')
      .attr('class', 'g_pred_' + userType)
      .attr('transform', function(d) {
        return 'translate(' + xScale(d.x0_pred) + ',' + yScale(d.x1_pred) + ')';
      });

    const userPredCircle = gUserPred
      .append('circle')
      .attr('class', 'pred_circle_' + userType)
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', layout.circle.selected.r)
      .style('stroke', 'black')
      .style('stroke-width', 2)
      .style('fill-opacity', 1)
      .on('mouseover', function(d, i) {
        const data = d3.select(this).data()[0];

        d3.select(this)
          .style('stroke-width', 3);
        const user = userType == 'selected' ? `User ${d.userID}` : `Counterfactual user`;
        const text =
          `<div style="font-weight: 600">
            ${user} is stereotyped: <br />
            The user's overall recommendation is closer to <br />
            the average preference than original preference. <br />
          </div>`;

        tooltip.html(text);
        tooltip.show();
      })
      .on('mouseout', function(d, i) {
        d3.select(this)
          .style('stroke-width', 2);
        tooltip.hide();
      });

    userPredCircle
      .style('fill', d => {
        let circleColor = '';
        if (group === '') circleColor ='gray';
        else if (group === 'gender') circleColor = genderColorScale(d.gender);
        else if (group === 'stereotype') circleColor = stereotypeColorScale(d.stereotype);
        else if (group === 'miscalibration') circleColor = miscalibrationColorScale(d.miscalibration)
        else if (group === 'filterBubble') circleColor = filterBubbleColorScale(d.filterBubble);
        else if (group === 'atypicality') circleColor = typicalityColorScale(d.pred_dev);

        miscalibrationColorScale(d.miscalibration);

        return circleColor;
      });

    gUserActual
      .data(dataUsers)
      .enter()
      .append('g')
      .attr('class', 'g_actual_' + userType)
      .attr('transform', function(d) {
        return 'translate(' + xScale(d.x0_actual) + ',' + yScale(d.x1_actual) + ')';
      });

    gUserActual
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
      .on('mouseover', function(d, i) {
        const data = d3.select(this).data()[0];

        d3.select(this)
          .style('stroke-width', 3);
        const user = userType == 'selected' ? `User ${d.userID}` : `Counterfactual user`;
        const text =
          `<div style="font-weight: 600">
            ${user}'s original preference <br />
            is deviated from the mean preference <br />
            than 80% of users.
          </div>`;

        tooltip.html(text);
        tooltip.show();
      })
      .on('mouseout', function(d, i) {
        d3.select(this)
          .style('stroke-width', 2);
        tooltip.hide();
      });

    //***** Line representing stereotype
    gUserActual
      .append("path")
      .attr("class", "link")
      .style("stroke", "#000")
      .style('opacity', 1)
      .style("stroke-width", 1.5)
      .attr("d", (d) => {
        const theta = Math.atan2((yScale(d.x1_pred)-yScale(d.x1_actual)), (xScale(d.x0_pred)-xScale(d.x0_actual)));
        const length = 15
        return "M" + 0 + "," + 0 + "," + (length*Math.cos(theta)) + "," + (length*Math.sin(theta))
      });

    //***** Arrow from actual to pred
    gUserActual
      .append("line")
      .attr( "class", "from_actual_to_pred")
      .attr('x1', d => 0)
      .attr('y1', d => 0)
      .attr('x2', d => {
        const theta = Math.atan2((yScale(d.x1_pred)-yScale(d.x1_actual)), (xScale(d.x0_pred)-xScale(d.x0_actual)));
        return xScale(d.x0_pred) - xScale(d.x0_actual) - ((layout.circle.selected.r) * Math.cos(theta));
      })
      .attr('y2', d => {
        const theta = Math.atan2((yScale(d.x1_pred)-yScale(d.x1_actual)), (xScale(d.x0_pred)-xScale(d.x0_actual)));
        return  + yScale(d.x1_pred) - yScale(d.x1_actual) - ((layout.circle.selected.r) * Math.sin(theta));
      })
      .style("stroke", "#000")
      .style('opacity', 1)
      .attr('marker-end', (d) => "url(#arrow)")
      .style("stroke-width", 1)
      .style('stroke-dasharray', '5,4')
      // .attr("d", (d) => {
      //   const theta = Math.atan2((yScale(d.x1_pred)-yScale(d.x1_actual)), (xScale(d.x0_pred)-xScale(d.x0_actual)));
      //   const length = Math.sqrt(Math.pow(yScale(d.x1_pred)-yScale(d.x1_actual), 2)) + Math.pow((xScale(d.x0_pred)-xScale(d.x0_actual), 2))
      //   return "M" + 0 + "," + 0 + "," + (length*Math.cos(theta)) + "," + (length*Math.sin(theta))
      // });

    gUserActual
      .append('text')
      .attr('x', 0)
      .attr('y', 0)
      .style('stroke', 'white')
      .style('stroke-width', 0.5)
      .style('fill', 'black')
      .style('font-weight', 'bold')
      .text(userType);

    gUserActual
      .append("line")
      .attr( "class", "from_actual_to_mean_pref")
      .attr('x1', d => 0)
      .attr('y1', d => 0)
      .attr('x2', d => xScale(meanPref[0]) - xScale(d.x0_actual))
      .attr('y2', d => yScale(meanPref[1]) - yScale(d.x1_actual))
      .style("stroke", "black")
      .style('opacity', 1)
      .style("stroke-width", 1)
      .style('stroke-dasharray', '4,2');

    gUserPred
      .append("line")
      .attr( "class", "from_pred_to_mean_pref")
      .attr('x1', d => 0)
      .attr('y1', d => 0)
      .attr('x2', d => xScale(meanPref[0]) - xScale(d.x0_pred))
      .attr('y2', d => yScale(meanPref[1]) - yScale(d.x1_pred))
      .style("stroke", "red")
      .style('opacity', 1)
      .style("stroke-width", 1);
  }

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
  