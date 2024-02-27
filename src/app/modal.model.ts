export class ConfirmModal {
  constructor(
    public title: string,
    public description: string,
    public confirmButtonColor: string = '',
    public confirmButtonText: string = 'Confirm',
  ) {
  }
}

export class AlertModal {
  constructor(
    public title: string,
    public description: string,
  ) {
  }
}
