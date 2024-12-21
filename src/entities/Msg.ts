export class Msg {
  public number: string;
  public name?: string;
  public state?: string;
  public status?: string;
  public msg?: string;

  constructor(props: Msg) {
    Object.assign(this, props);
  }
}
