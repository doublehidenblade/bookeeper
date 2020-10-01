import { Entries } from "../utils/types";

export class Variables {
  accounts_payable: number;
  accounts_receivable: number;
  cash: number;
  inventory: number;
  payroll: number;
  payroll_withholding: number;
  constructor(data: Entries) {
    this.accounts_payable = Number(data?.accounts_payable);
    this.accounts_receivable = Number(data?.accounts_receivable);
    this.cash = Number(data?.cash);
    this.inventory = Number(data?.inventory);
    this.payroll = Number(data?.payroll);
    this.payroll_withholding = Number(data?.payroll_withholding);
  }

}

export const variablesConverter = {
  toFirestore(data: Variables): firebase.firestore.DocumentData {
    return { ...data };
  },

  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options: firebase.firestore.SnapshotOptions
  ): Variables {
    const JSONdata = snapshot.data(options)!;
    return new Variables(JSONdata);
  }
};
