import { Component, OnInit, AfterContentInit } from '@angular/core';
import * as D3 from 'd3';
import { DataNodeInterface } from '../model/dataNode.interface';
import { RelationLinkInterface } from '../model/relationLink.interface';

@Component({
  selector: 'app-d3',
  templateUrl: './d3.component.html',
  styleUrls: ['./d3.component.css']
})
export class D3Component implements OnInit, AfterContentInit {

  private width = 960;
  private height = 800;
  private colors = D3.scaleOrdinal(D3.schemeCategory20);

  public svg: any;
  public mainGroup: any;
  public nodesGroup: any;
  public linksGroup: any;
  public addBtn: any;

  public nodesMeta: Array<DataNodeInterface>;
  public linksMeta: Array<RelationLinkInterface>;
  constructor() {
    this.svg = D3.select('svg')
              .attr('oncontextmenu', 'return false;')
              .attr('width', this.width)
              .attr('height', this.height);

    this.mainGroup = this.svg.append('g');
    this.linksGroup = this.mainGroup.append('g').selectAll('path');
    this.nodesGroup = this.mainGroup.append('g').selectAll('g');
    this.addBtn = D3.select('#stgAddBtn');
  }

  ngOnInit() {
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
    // code for pan and zoom
    this.svg.append('rect')
      .attr('width', this.width)
      .attr('height', this.height)
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .call(D3.zoom()
          .scaleExtent([1 / 2, 4])
          .on('zoom', this.zoomed));
  }

  ngAfterContentInit() {
    this.draw();
  }

  draw() {
    
  }

  addBtnClicked(event: MouseEvent) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    

  }

  zoomed() {
    this.mainGroup.attr('transform', D3.event.transform);
  }
}
