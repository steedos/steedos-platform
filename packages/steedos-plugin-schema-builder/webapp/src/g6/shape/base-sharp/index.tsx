export class BaseDrawer {
  public constructor(protected vm: BaseSharp) {}

  public render(group) {
    group.addShape('rect', {
      attrs: {
        vm: this.vm
      }
    });
  }

} // tslint:disable-next-line: max-classes-per-file

export class BaseSharp {
  public for;

  public constructor(protected attrs: any) {}

}