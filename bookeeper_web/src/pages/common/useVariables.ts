import { useState, useMemo, useCallback, useEffect } from "react"
import { Variables, variablesConverter } from "../../schema/variables";
import { LoadState } from "../../utils/types";
import { useFirestore } from "react-redux-firebase";

export const useVariables = () => {
  const firestore = useFirestore();
  const [variables, setVariables] = useState<Variables>();
  const [dataLoadState, setDataLoadState] = useState<LoadState>(LoadState.loading);

  const handleSnapshot = (doc: firebase.firestore.DocumentSnapshot<Variables>) => {
    const data = doc.data();
    if (data == null) {
      return;
    }
    setVariables(data);
    return;
  }

  const variablesRef = useMemo(() => firestore.collection('company').doc('variables').withConverter(variablesConverter), [firestore]);

  const getVariables = useCallback(async () => {
    setDataLoadState(LoadState.loading);
    await variablesRef.get().then(handleSnapshot)
      .catch(() => setDataLoadState(LoadState.error))
      .then(() => setDataLoadState(LoadState.loaded))
  }, [variablesRef]);

  const listenForVariablesChange = useCallback(() => {
    return variablesRef.onSnapshot(handleSnapshot);
  }, [variablesRef]);


  useEffect(() => {
    getVariables();
    return listenForVariablesChange();
  }, [getVariables, listenForVariablesChange]);

  return { variables, dataLoadState };
}