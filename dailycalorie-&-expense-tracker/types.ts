
export interface ConsumptionItem {
  id: string;
  name: string;
  amount: number;
  category: string;
  expression?: string; // 新增：保存原始算式
}

export interface DailyData {
  date: string;
  items: ConsumptionItem[];
}

export type ViewState = 'calendar' | 'dayDetail' | 'analysis';
