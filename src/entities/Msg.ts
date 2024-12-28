export class Msg {
  public number: string;
  public name?: string;
  public state_menu?: string;
  public state?: string;
  public status?: string;
  public msg?: string;
  public msgBot?: object;

  constructor(props: Msg) {
    Object.assign(this, props);
  }
}
