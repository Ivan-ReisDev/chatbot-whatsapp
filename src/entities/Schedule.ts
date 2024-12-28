export class Schedule {
  public number: string;
  public name?: string;
  public state?: string;
  public date: Date;
  public service?: string;
  public status?: string;

  constructor(props: Schedule) {
    Object.assign(this, props);
  }
}
