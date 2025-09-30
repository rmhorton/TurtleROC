/* Place your Turtle Path JS animation code here */

HTMLWidgets.widget({
  name: 'turtlePath',
  type: 'output',
  factory: function(el, width, height) {
  	
  	// Confirm d3 loaded
    if (typeof d3 === "undefined") {
      console.error("D3 is not loaded!");
    } else {
      console.log("D3 version " + d3.version + " loaded successfully.");
    }
    
    // Create SVG container inside the widget element
    const svg = d3.select(el).append('svg')
      .attr('width', width)
      .attr('height', height);

    // Create a container for the confusion matrix and button
    const container = d3.select(el).append('div')
      .style('position', 'relative');

    const confusionContainer = container.append('div')
      .style('position', 'absolute')
      .style('bottom', '60px')
      .style('right', '30px')
      .style('background', 'white')
      .style('border', '1px solid black')
      .style('padding', '5px');

    confusionContainer.html(`
      <table class="confusion-matrix" style="border-collapse: collapse; font-size: 18px;">
        <tr>
          <th rowspan="2" style="background-color:#f0f0f0; font-weight:bold;">Actual</th>
          <th colspan="2" style="background-color:#f0f0f0; font-weight:bold;">Predicted</th>
        </tr>
        <tr>
          <th>True</th>
          <th>False</th>
        </tr>
        <tr>
          <th>True</th>
          <td id="tp" style="background-color:lightblue; text-align:center; vertical-align:middle;">0</td>
          <td id="fn" style="background-color:pink; text-align:center; vertical-align:middle;">0</td>
        </tr>
        <tr>
          <th>False</th>
          <td id="fp" style="background-color:pink; text-align:center; vertical-align:middle;">0</td>
          <td id="tn" style="background-color:lightblue; text-align:center; vertical-align:middle;">0</td>
        </tr>
      </table>
    `);

    const controlButton = container.append('button')
      .text('Pause')
      .style('position', 'absolute');

    function positionButton() {
      const rect = confusionContainer.node().getBoundingClientRect();
      controlButton.style('left', (rect.left - controlButton.node().offsetWidth - 10) + 'px')
        .style('top', (rect.bottom - controlButton.node().offsetHeight) + 'px');
    }
    window.addEventListener('resize', positionButton);

    return {
      renderValue: function(x) {
        // Convert R data.frame (columns) into array of objects
				let data = HTMLWidgets.dataframeToD3(x.data);
        
        // Ensure numeric types
				data = data.map(d => ({
				  score: +d.score,
				  actual: +d.actual
				}));

        // DEBUG !!!
				console.log("Data received:", data);
				console.log("Type of data:", typeof data);
				
        // scales and margins
        const margin = {top: 20, right: 20, bottom: 40, left: 40};
        const plotWidth = width - margin.left - margin.right;
        const plotHeight = height - margin.top - margin.bottom;

        const g = svg.selectAll('g').data([0]).join('g')
          .attr('transform', `translate(${margin.left},${margin.top})`);

        const positives = data.filter(d => d.actual === 1).length;
        const negatives = data.filter(d => d.actual === 0).length;

        let xPos = 0, yPos = 0;
        const path = [{x:0, y:0}];
        data.sort((a,b) => b.score - a.score);
        data.forEach(d => {
          if(d.actual === 1) yPos += 1/positives;
          else xPos += 1/negatives;
          path.push({x: xPos, y: yPos, actual: d.actual});
        });

        const xScale = d3.scaleLinear().domain([0,1]).range([0, plotWidth]);
        const yScale = d3.scaleLinear().domain([0,1]).range([plotHeight, 0]);

        g.selectAll('*').remove();
        g.append('g').attr('transform', `translate(0,${plotHeight})`).call(d3.axisBottom(xScale));
        g.append('g').call(d3.axisLeft(yScale));

        g.append('line')
          .attr('x1', xScale(0)).attr('y1', yScale(0))
          .attr('x2', xScale(1)).attr('y2', yScale(1))
          .attr('stroke','black').attr('stroke-dasharray','4,4');

        g.append('path')
          .datum(path)
          .attr('fill','none')
          .attr('stroke','black')
          .attr('stroke-width',2)
          .attr('d', d3.line().x(d => xScale(d.x)).y(d => yScale(d.y)));

        const points = g.selectAll('.point')
          .data(path)
          .join('circle')
          .attr('class','point')
          .attr('cx', d=>xScale(d.x))
          .attr('cy', d=>yScale(d.y))
          .attr('r',10)
          .attr('fill', (d,i) => i===0?'black':(d.actual===1?'lightblue':'pink'))
          .attr('opacity', i=>i===0?1:0.6);

        const turtle = g.selectAll('.turtle').data([0]).join('circle')
          .attr('r',12).attr('fill','none').attr('stroke','green').attr('stroke-width',2);

        let i=0, tp=0, fp=0, fn=positives, tn=negatives, paused=false;

        function updateConfusionMatrix() {
          d3.select('#tp').text(tp);
          d3.select('#fp').text(fp);
          d3.select('#fn').text(fn);
          d3.select('#tn').text(tn);
        }
        updateConfusionMatrix();

        controlButton.on('click', () => { paused = !paused; controlButton.text(paused?'Play':'Pause'); if(!paused) animateStep(); });

        function animateStep() {
          if(paused) return;

          if(i===0){
            points.attr('fill',(d,j)=>j===0?'black':(d.actual===1?'lightblue':'pink')).attr('opacity',j=>j===0?1:0.6);
            tp=0; fp=0; fn=positives; tn=negatives;
            updateConfusionMatrix();
          }

          const d = path[i];
          turtle.attr('cx', xScale(d.x)).attr('cy', yScale(d.y));

          if(i>0){
            if(d.actual===1){tp++; fn--;} else {fp++; tn--;}
            updateConfusionMatrix();
            points.filter((p,j)=>j===i).attr('fill', d.actual===1?'blue':'red').attr('opacity',1);
          }

          if(i===path.length-1){
            setTimeout(()=>{i=0; animateStep();}, 1000);
          } else {
            i=(i+1)%path.length;
            setTimeout(animateStep, 500);
          }
        }

        animateStep();
      },
      resize: function(width, height) {
        svg.attr('width', width).attr('height', height);
      }
    };
  }
});
