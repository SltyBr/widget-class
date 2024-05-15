import './style.css';
import * as echarts from 'echarts/core';
import { Widget } from './widget/widget';
import { BarChart } from 'echarts/charts';
import { GridComponent, TooltipComponent } from 'echarts/components';
import { SVGRenderer } from 'echarts/renderers';

type ECharts = ReturnType<typeof echarts.init>;

export enum EBlockKey {
  Value = 'Y',
  Category = 'X',
}

echarts.use([BarChart, SVGRenderer, GridComponent, TooltipComponent]);

export class Example extends Widget {
  public _chart!: ECharts;

  constructor() {
    super();
    const root = document.getElementById('root') as HTMLDivElement;
    this._chart = echarts.init(root, undefined, { renderer: 'svg' });
  }

  get categoryPath(): string {
    return this.dataSettings.columnsByBlock[EBlockKey.Category][0]?.['path'];
  }

  get valuePath(): string {
    return this.dataSettings.columnsByBlock[EBlockKey.Value][0]?.['path'];
  }

  get categories(): Set<string> {
    return new Set<string>(
      this.data.map((item: any) => item[this.categoryPath])
    );
  }

  onInit(): void {
    this._chart?.setOption(this.getChartOptions());
    this.ready();
  }
  onChange(): void {
    throw new Error('Method not implemented.');
  }
  onThemeChange(): void {
    throw new Error('Method not implemented.');
  }
  onLangChange(): void {
    throw new Error('Method not implemented.');
  }

  // private chartInit = (): void => {
  //   this._chart = echarts.init(
  //     document.getElementById('root') as HTMLDivElement,
  //     undefined,
  //     { renderer: 'svg' }
  //   );

  //   this.setChartOptions();
  // };

  // private setChartOptions(): void {
  //   this._chart.setOption(this.getChartOptions());
  // }

  private getChartOptions(): echarts.EChartsCoreOption {
    const seriesData = this.data.map((item: any) => {
      const value = item[this.valuePath];
      return {
        value,
      };
    });
    return {
      xAxis: {
        type: 'category',
        data: [...this.categories],
      },
      tooltip: {
        show: true,
      },
      yAxis: {
        type: 'value',
      },
      series: {
        type: 'bar',
        data: seriesData,
      },
    };
  }
}

new Example();
