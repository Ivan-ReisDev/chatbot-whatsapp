export class Schedule {
  public number: string;
  public name?: string;
  public cpf?: string;
  public state?: string;
  public date?: Date;
  public status?: string;

  constructor(props: Schedule) {
    Object.assign(this, props);
  }
}
