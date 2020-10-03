import { Entries } from "../utils/types";
import { toCurrency } from "../utils/helpers";

export class Variables {
  accounts_payable: number;
  accounts_receivable: number;
  cash: number;
  inventory: number;
  payroll: number;
  payroll_withholding: number;
  constructor(data: Entries) {
    this.accounts_payable = toCurrency(Number(data?.accounts_payable));
    this.accounts_receivable = toCurrency(Number(data?.accounts_receivable));
    this.cash = toCurrency(Number(data?.cash));
    this.inventory = toCurrency(Number(data?.inventory));
    this.payroll = toCurrency(Number(data?.payroll));
    this.payroll_withholding = toCurrency(Number(data?.payroll_withholding));
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
