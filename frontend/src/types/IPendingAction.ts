export interface IPendingAction {
  actionType: string | null;
  title: string;
  message: string;
  canSkip: boolean;
  btnText: string;
}
