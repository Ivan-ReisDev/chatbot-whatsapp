export interface IOperatingHour {
  dayOfWeek: string;
  openingTime: string;
  closingTime: string;
}

export class Config {
  public readonly id?: string;
  public operatingHours: IOperatingHour[];

  constructor(props: Config) {
    Object.assign(this, props);
  }
}
