import { ViewSettings, WidgetRepresent } from './interfaces';
import { InputEvent, OutputEvent } from './events';
import { Theme } from './theme';
import { TData } from './interfaces';
import { UrlKeys, Locale } from './types';
import { defaultDataSettingsMethods } from './data-settings';
import { ConfigDataBlockType_Server } from './enums';
import { blockFilterKey, blockSortKey } from './contants';

const widgetDefaultKey = 'ffed0a4d-4a9d-417f-b502-eb50142c6956';

export abstract class Widget {
  token: string | null = null;
  viewSettings: ViewSettings = {};
  theme!: Theme;
  lang!: Locale;
  uid: string = '';
  data!: any;
  dataSettings!: any;
  inited: boolean = false;
  urlParams: URLSearchParams = new URLSearchParams(window.location.search);
  abstract onInit(): void;
  abstract onChange(): void;
  abstract onThemeChange(): void;
  abstract onLangChange(): void;

  callbacks: Map<InputEvent, Function> = new Map([
    [InputEvent.ChangeTheme, this.themeChangeEvent],
    [InputEvent.ChangeLang, this.langChangeEvent],
    [InputEvent.Change, this.onDataChange],
  ]);

  constructor() {
    this.token = this.getUrlParam('token');
    this.uid = this.getUrlParam('uid');

    window.addEventListener(
      'message',
      ({ data: { type, payload } }: MessageEvent) => {
        const callback = this.callbacks.get(type);
        if (callback) {
          callback.call(this, payload);
        }
      }
    );

    this.sendMessageToParent({
      token: this.token,
      type: OutputEvent.Init,
      payload: null,
    });
  }

  sendMessageToParent(data: TData) {
    window.top?.postMessage(data, '*');
  }

  ready() {
    this.sendMessageToParent({
      token: this.token,
      type: OutputEvent.Ready,
      payload: null,
    });
  }

  getUrlParam(key: UrlKeys) {
    return this.urlParams.get(key) || '';
  }

  themeChangeEvent(data: any): void {
    this.theme = data;
    this.inited && this.onThemeChange();
  }

  langChangeEvent(data: any): void {
    this.lang = data;
    this.inited && this.onLangChange();
  }

  onDataChange({ dataOptionsMap, viewOptions }: WidgetRepresent): void {
    const widgetMultiData: { [key: string]: any } = {};
    const widgetDataSettingsMap: { [key: string]: any } = {};
    const formatters = window.parent['format']?.[this.uid] || {};
    const dataOptions = Object.values(dataOptionsMap);
    dataOptions.forEach(({ data_option, rows, total }) => {
      widgetMultiData[data_option.key] = rows;
      const columns = data_option.dataset.columns_id.map((source) => ({
        type: source.base_type,
        id: source.id,
        path: source.path,
        format: formatters[source.path] || ((value: any) => value),
        name: source.name,
      }));

      const columnsByBlock: { [key: string]: any } = {};
      const filters: any[] = [];
      const sort: any[] = [];
      const colorize: any[] = [];

      data_option.blocks.forEach((block) => {
        if (block.block_type === ConfigDataBlockType_Server.Drilldown) return;

        switch (block.key) {
          case blockFilterKey:
            block.columns.forEach(({ column_id, action, value }) => {
              const column = columns.find(({ id }) => column_id === id);
              filters.push({
                column,
                method: action,
                value,
              });
            });
            break;
          case blockSortKey:
            block.columns.forEach(({ column_id, value: direction }) => {
              const column = columns.find(({ id }) => column_id === id);
              sort.push({
                column,
                direction,
              });
            });
            break;
          // case blockColorizeKey:
          //     block.columns.forEach(({ value }) => {
          //         const source = value;
          //         const column = columns.find(({ id }) => source.columnId === id);
          //         colorize.push((0, widget_1.createColorizeItem)(widget, column, source));
          //     });
          //     break;
          default:
            columnsByBlock[block.key] = block.columns.map(({ column_id }) => {
              return columns.find((item) => item.id === column_id);
            });
        }
      });

      const dataSettingsItem = {
        columns,
        columnsByBlock,
        filters,
        sort,
        colorize,
        total,
        limit: data_option.limit_rows,
        offset: data_option.offset,
        ...{
          ...defaultDataSettingsMethods,
          interact: defaultDataSettingsMethods.interact.bind(data_option),
        },
        ...this.getDataSettingsEvents(data_option.key),
      };
      widgetDataSettingsMap[data_option.key] = dataSettingsItem;
    });

    if (widgetDefaultKey in widgetDataSettingsMap) {
      this.data = widgetMultiData[widgetDefaultKey];
      this.dataSettings = widgetDataSettingsMap[widgetDefaultKey];
    } else {
      this.data = widgetMultiData;
      this.dataSettings = widgetDataSettingsMap;
    }

    viewOptions.forEach(({ key, value }) => (this.viewSettings[key] = value));

    if (!this.inited) {
      this.inited = true;
      this.onInit();
      return;
    }

    this.onChange();
  }

  dispatchChangeOtherFilters(): void {}

  getDataSettingsEvents(key: string): { events: any } {
    const dataSettings =
      key === widgetDefaultKey ? this.dataSettings : this.dataSettings[key];
    if (dataSettings)
      return {
        events: dataSettings.events,
      };
    else
      return {
        events: {},
      };
  }
}
