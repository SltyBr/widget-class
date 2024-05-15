import {
  ColumnType,
  ConfigDataBlockType_Server,
  DataQueryFunction,
  DataQueryMethod,
} from './enums';
import { OutputEvent } from './events';

declare global {
  interface Window {
    format: {
      [key: string]: any;
    };
  }
}

export interface DatasetRow {
  [path: string]: any;
}

export interface WidgetRepresent {
  dataOptionsMap: {
    [key: string]: {
      data_option: {
        key: string;
        id: number;
        dataset: {
          id: number;
          name: string;
          columns_id: {
            id: number;
            name: string;
            base_type: ColumnType;
            path: string;
          }[];
        };
        method: DataQueryMethod.Aggregate;
        limit_rows: -1;
        offset: 0;
        blocks: {
          key: string;
          block_type: ConfigDataBlockType_Server;
          function: DataQueryFunction;
          columns: {
            column_id: number;
            action: any;
            value: any;
          }[];
        }[];
      };
      rows: DatasetRow[];
      total: number;
    };
  };
  viewOptions: {
    key: string;
    value: any;
  }[];
}

// export interface SingleData {
//   readonly data: DataItem[];
//   readonly dataSettings: DataSettings;
// }
// export interface MultiData {
//   readonly data: {
//     [key: string]: DataItem[];
//   };
//   readonly dataSettings: DataSettingsMap;
// }
// export interface DataSettingsMap {
//   [key: string]: DataSettings;
// }
// export interface DataSettings {
//   columns: Column[];
//   columnsByBlock: Record<string, Column[]>;
//   filters: Filter[];
//   sort: Sort[];
//   colorize: ColorizeItem[];
//   total: number;
//   limit: number;
//   offset: number;
//   setFilter(filter: Filter, rowIndex: number, target?: Target): void;
//   removeFilterAt(index: number): void;
//   setSort(sort: Sort | null): void;
//   removeSortAt(index: number): void;
//   interact(dataIndex: number): void;
//   events: {
//     onOtherFilterChange?: (filter: Filter) => void;
//   };
// }
// export interface ColorizeItem {
//   column: Column;
//   getColor(value: number): string;
// }
export interface ViewSettings {
  [key: string]: any;
}

export interface TData {
  token: string | null;
  type: OutputEvent;
  payload: any;
}
