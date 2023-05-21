import { FirebaseCollection, RootStateV2 } from "@redux/types";
import { collection, doc, getDocs } from "firebase/firestore";
import { firestore } from "../../../../firebaseConfig";
import { AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";
import { Progress, Session } from "./types";
import { setError, setLoading, setBabyProgressAndSession, setSuccess } from ".";

export const getBabyProgressAndSession =
  (babyID: string): ThunkAction<void, RootStateV2, unknown, AnyAction> =>
  async (dispatch) => {
    try {
      // set loading
      dispatch(setLoading());

      // create document reference
      const babyCollectionRef = doc(
        firestore,
        FirebaseCollection.BABIES,
        babyID
      );
      const progressCollectionRef = collection(
        babyCollectionRef,
        FirebaseCollection.PROGRESS
      );
      const sessionCollectionRef = collection(
        babyCollectionRef,
        FirebaseCollection.SESSION
      );

      // get docs
      const progressSnapshots = (await getDocs(progressCollectionRef)).docs;
      const sessionSnapshots = (await getDocs(sessionCollectionRef)).docs;

      const savedProgress: Progress[] = [];
      const savedSession: Session[] = [];

      progressSnapshots.map((snapshot) => {
        savedProgress.push(snapshot.data() as Progress);
      });

      sessionSnapshots.map((snapshot) => {
        savedSession.push(snapshot.data() as Session);
      });

      // save to redux
      dispatch(
        setBabyProgressAndSession({
          progress: savedProgress,
          sessions: savedSession,
        })
      );
      dispatch(setSuccess());
    } catch {
      dispatch(setError());
      console.log("Terjadi kesalahan saat mengambil data");
    }
  };
