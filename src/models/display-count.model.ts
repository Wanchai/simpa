export interface SiteDisplayCount {
  counts: DisplayPoint;
  data: any;
  id: string;
  name: string;
  url: string;
  createdAt: Date;
  referers: Record<string, RefererCount>;
  referersCount: RefererCount[];
}

export interface DisplayPoint {
  labels: string[];
  data: number[];
}

export interface RefererCount {
  url: string;
  count: number;
}
