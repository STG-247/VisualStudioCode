import { Component, OnInit, AfterContentInit, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-d3',
  templateUrl: './d3.component.html',
  styleUrls: ['./d3.component.css']
})
export class D3Component implements OnInit, AfterContentInit, AfterViewInit {

  private width = 960;
  private height = 800;
  private colors = d3.scaleOrdinal(d3.schemeCategory10);

  public svg: any;
  public mainGroup1: any;
  public circle: any;
  public path: any;
  public addBtn: any;

  public nodes: Array<any> = [
                              { id: 0, reflexive: false },
                              { id: 1, reflexive: true },
                              { id: 2, reflexive: false }
                            ];
  public links: Array<any> = [
                              { source: this.nodes[0], target: this.nodes[1], left: false, right: true },
                              { source: this.nodes[1], target: this.nodes[2], left: false, right: true }
                            ];
  public lastNodeId = 2;
  // mouse event vars
  public selectedNode: any = null;
  public selectedLink: any = null;
  public mouseDownLink: any = null;
  public mouseDownNode: any = null;
  public mouseUpNode: any = null;

  private lastKeyDown = -1;
  private dragLine: any;
  // init D3 force layout
  private force: any;
  private drag: any;

  constructor() { }

  ngOnInit() {
    // Force simulation and drag
    this.force = d3.forceSimulation()
      .force('link', d3.forceLink().id((d) => d.id).distance(150))
      .force('charge', d3.forceManyBody().strength(-500))
      .force('x', d3.forceX(this.width / 2))
      .force('y', d3.forceY(this.height / 2));

    this.svg = d3.select('svg')
      .attr('oncontextmenu', 'return false;')
      .attr('width', this.width)
      .attr('height', this.height);

    this.path = this.svg.append('g').selectAll('path');
    this.circle = this.svg.append('g').selectAll('g');
    this.addBtn = d3.select('#stgAddBtn');
    // define arrow markers for graph links
    this.svg.append('svg:defs').append('svg:marker')
      .attr('id', 'arrow-head')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 6)
      .attr('markerWidth', 3)
      .attr('markerHeight', 3)
      .attr('orient', 'auto')
      .append('svg:path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#000');
    this.svg.append('svg:defs').append('svg:marker')
      .attr('id', 'fletcher')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 4)
      .attr('markerWidth', 3)
      .attr('markerHeight', 3)
      .attr('orient', 'auto')
    .append('svg:path')
      .attr('d', 'M10,-5L0,0L10,5')
      .attr('fill', '#000');

    // line displayed when dragging new nodes
    this.dragLine = this.svg.append('svg:path')
      .attr('class', 'link dragline hidden')
      .attr('d', 'M0,0L0,0');
    /* // code for pan and zoom
    this.svg.append('rect')
      .attr('width', this.width)
      .attr('height', this.height)
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .call(d3.zoom()
      .scaleExtent([1 / 2, 4])
        .on('zoom', () => this.zoomed())); */

  }

  ngAfterContentInit() {
    this.drag = d3.drag()
      .on('start', (d) => {
        if (!d3.event.active) {
          this.force.alphaTarget(0.3).restart();
        }
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (d) => {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      })
      .on('end', (d) => {
        if (!d3.event.active) {
          this.force.alphaTarget(0);
        }
        d.fx = null;
        d.fy = null;
      });

    // app starts here
    this.svg.on('mousedown', () => this.mousedown())
      .on('mousemove', () => this.mousemove())
      .on('mouseup', () => this.mouseup());
    d3.select(window)
      .on('keydown', () => this.keydown())
      .on('keyup', () => this.keyup());
    this.draw();
  }

  ngAfterViewInit() {
    this.force.alphaMin(0.3).alphaTarget(0.55).alphaDecay(0.4).velocityDecay(0.85).restart();
   }

  // update force layout (called automatically each iteration)
  ticked() {
    // draw directed edges with proper padding from node centers
    this.path.attr('d', (d) => {
      const deltaX = d.target.x - d.source.x;
      const deltaY = d.target.y - d.source.y;
      const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const normX = deltaX / dist;
      const normY = deltaY / dist;
      const sourcePadding = d.left ? 17 : 12;
      const targetPadding = d.right ? 17 : 12;
      const sourceX = d.source.x + (sourcePadding * normX);
      const sourceY = d.source.y + (sourcePadding * normY);
      const targetX = d.target.x - (targetPadding * normX);
      const targetY = d.target.y - (targetPadding * normY);
      return `M${sourceX},${sourceY}L${targetX},${targetY}`;
    });
    this.circle.attr('transform', (d) => `translate(${d.x}, ${d.y})`);
  }

  // update graph (called when needed)
  draw() {
    // path (link) group
    this.path = this.path.data(this.links);

    // update existing links
    this.path.classed('selected', (d) => d === this.selectedLink)
      .style('marker-start', (d) => d.left ? 'url(#fletcher)' : '')
      .style('marker-end', (d) => d.right ? 'url(#arrow-head)' : '');

    // remove old links
    this.path.exit().remove();

    // add new links
    this.path = this.path.enter().append('svg:path')
      .attr('class', 'link')
      .classed('selected', (d) => d === this.selectedLink)
      .style('marker-start', (d) => d.left ? 'url(#fletcher)' : '')
      .style('marker-end', (d) => d.right ? 'url(#arrow-head)' : '')
      .on('mousedown', (d) => {
        if (d3.event.ctrlKey) {
          return;
        }
        // select link
        this.mouseDownLink = d;
        this.selectedLink = (this.mouseDownLink === this.selectedLink) ? null : this.mouseDownLink;
        this.selectedNode = null;
        this.draw();
      })
      .merge(this.path);

    // circle (node) group
    // NB: the function arg is crucial here! nodes are known by id, not by index!
    this.circle = this.circle.data(this.nodes, (d) => d.id);

    // update existing nodes (reflexive & selected visual states)
    this.circle.selectAll('circle')
      .style('fill', (d) => (d === this.selectedNode) ? d3.rgb(this.colors(d.id)).brighter().toString() : this.colors(d.id))
      .classed('reflexive', (d) => d.reflexive);

    // remove old nodes
    this.circle.exit().remove();

    // add new nodes
    const g = this.circle.enter().append('svg:g');

    g.append('svg:circle')
      .attr('class', 'node')
      .attr('r', 12)
      .style('fill', (d) => (d === this.selectedNode) ? d3.rgb(this.colors(d.id)).brighter().toString() : this.colors(d.id))
      .style('stroke', (d) => d3.rgb(this.colors(d.id)).darker().toString())
      .classed('reflexive', (d) => d.reflexive)
      .on('mouseover', (d) => {
        if (!this.mouseDownNode || d === this.mouseDownNode) {
          return;
        }
        // enlarge target node
        d3.select(d3.event.currentTarget).attr('transform', 'scale(1.1)');
      })
      .on('mouseout', (d) => {
        if (!this.mouseDownNode || d === this.mouseDownNode) {
          return;
        }
        // unenlarge target node
        d3.select(d3.event.currentTarget).attr('transform', '');
      })
      .on('mousedown', (d) => {
        if (d3.event.ctrlKey) {
          return;
        }
        // select node
        this.mouseDownNode = d;
        this.selectedNode = (this.mouseDownNode === this.selectedNode) ? null : this.mouseDownNode;
        this.selectedLink = null;

        // reposition drag line
        this.dragLine
          .style('marker-end', 'url(#arrow-head)')
          .classed('hidden', false)
          .attr('d', `M${this.mouseDownNode.x},${this.mouseDownNode.y}L${this.mouseDownNode.x},${this.mouseDownNode.y}`);

          this.draw();
      })
      .on('mouseup', (d) => {
        if (!this.mouseDownNode) {
           return;
        }
        // needed by FF
        this.dragLine
          .classed('hidden', true)
          .style('marker-end', '');

        // check for drag-to-self
        this.mouseUpNode = d;
        if (this.mouseUpNode === this.mouseDownNode) {
          this.resetMouseVars();
          return;
        }

        // unenlarge target node
        d3.select(d3.event.currentTarget).attr('transform', '');

        // add link to graph (update if exists)
        // NB: links are strictly source < target; arrows separately specified by booleans
        const isRight = this.mouseDownNode.id < this.mouseUpNode.id;
        const source = isRight ? this.mouseDownNode : this.mouseUpNode;
        const target = isRight ? this.mouseUpNode : this.mouseDownNode;

        const link = this.links.filter((l) => l.source === source && l.target === target)[0];
        if (link) {
          link[isRight ? 'right' : 'left'] = true;
        } else {
          this.links.push({ source, target, left: !isRight, right: isRight });
        }

        // select new link
        this.selectedLink = link;
        this.selectedNode = null;
        this.draw();
      });

    // show node IDs
    g.append('svg:text')
      .attr('x', 0)
      .attr('y', 4)
      .attr('class', 'id')
      .text((d) => d.id);

      this.circle = g.merge(this.circle);

    // set the graph in motion
    this.force.nodes(this.nodes).on('tick', () => this.ticked());
    this.force.force('link').links(this.links);
    this.force.alphaTarget(0.3).restart();
  }

  /**
   * function called when the user clicks the "ADD NODE" button.
   * @param event - click event
   */
  addBtnClicked(event: MouseEvent) {
    this.addNodeInNodesGroup();
  }

  /**
   * Add a single data node in the nodeGroup
   * which in turn is a part of mainGroup.
   */
  addNodeInNodesGroup() {
    const node = { id: ++this.lastNodeId, reflexive: false, x: 50, y: 50 };
    this.nodes.push(node);
    this.draw();
  }

  /**
   * Should be called when mousedown event is fired.
   */
  mousedown() {
    // because :active only works in WebKit?
    this.svg.classed('active', true);
    if (d3.event.ctrlKey || this.mouseDownNode || this.mouseDownLink) {
       return;
    }
    // insert new node at point
    const point = d3.mouse(d3.event.currentTarget);
    const node = { id: ++this.lastNodeId, reflexive: false, x: point[0], y: point[1]};
    this.nodes.push(node);
    // redraw the whole visualization.
    this.draw();
  }

  /**
   * Should be called when mousemove event is fired.
   */
  mousemove() {
    if (!this.mouseDownNode) {
      return;
    }
    // update drag line
    this.dragLine.attr('d',
        `M${this.mouseDownNode.x},${this.mouseDownNode.y}L${d3.mouse(d3.event.currentTarget)[0]},${d3.mouse(d3.event.currentTarget)[1]}`);
    // redraw the whole visualization.
    this.draw();
  }

  /**
   * Should be called when mouseup event is fired.
   */
  mouseup() {
    if (this.mouseDownNode) {
      // hide drag line
      this.dragLine
        .classed('hidden', true)
        .style('marker-end', '');
    }
    // because :active only works in WebKit?
    this.svg.classed('active', false);
    // clear mouse event vars
    this.resetMouseVars();
  }

  /**
   * Should be called when keydown event is fired.
   */
  keydown() {
    d3.event.preventDefault();
    if (this.lastKeyDown !== -1) {
      return;
    }
    this.lastKeyDown = d3.event.keyCode;
    // ctrl
    if (d3.event.keyCode === 17) {
      this.circle.call(this.drag);
      this.svg.classed('ctrl', true);
    }
    if (!this.selectedNode && !this.selectedLink) {
      return;
    }
    switch (d3.event.keyCode) {
      case 8: // backspace
      case 46: // delete
        if (this.selectedNode) {
          this.nodes.splice(this.nodes.indexOf(this.selectedNode), 1);
          this.spliceLinksForNode(this.selectedNode);
        } else if (this.selectedLink) {
          this.links.splice(this.links.indexOf(this.selectedLink), 1);
        }
        this.selectedLink = null;
        this.selectedNode = null;
        this.draw();
        break;
      case 66: // B
        if (this.selectedLink) {
          // set link direction to both left and right
          this.selectedLink.left = true;
          this.selectedLink.right = true;
        }
        this.draw();
        break;
      case 76: // L
        if (this.selectedLink) {
          // set link direction to left only
          this.selectedLink.left = true;
          this.selectedLink.right = false;
        }
        this.draw();
        break;
      case 82: // R
        if (this.selectedNode) {
          // toggle node reflexivity
          this.selectedNode.reflexive = !this.selectedNode.reflexive;
        } else if (this.selectedLink) {
          // set link direction to right only
          this.selectedLink.left = false;
          this.selectedLink.right = true;
        }
        this.draw();
        break;
    }
  }

  /**
   * Shuold be called when keyup event is fired
   */
  keyup() {
    this.lastKeyDown = -1;
    // ctrl
    if (d3.event.keyCode === 17) {
      this.circle.on('.drag', null);
      this.svg.classed('ctrl', false);
    }
  }

  /**
   * Removes links from node.
   * @param node node whose link is to be spliced
   */
  spliceLinksForNode(node) {
    const toSplice = this.links.filter((l) => l.source === node || l.target === node);
    for (const l of toSplice) {
      this.links.splice(this.links.indexOf(l), 1);
    }
  }

  /**
   * Resets mouse state temporary variables.
   */
  resetMouseVars() {
    this.mouseDownNode = null;
    this.mouseUpNode = null;
    this.mouseDownLink = null;
  }

  /**
   * Adding pan and zoom capabilities.
   */
  /* zoomed() {
    this.svg.attr('transform', d3.event.transform);
  } */
}
