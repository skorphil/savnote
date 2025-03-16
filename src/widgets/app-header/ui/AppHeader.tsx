import { IonHeader, IonTitle, IonToolbar } from "@ionic/react";

/**
 * App header
 */
function AppHeader() {
  return (
    <IonHeader
      mode="md"
      className="ion-no-border md header-md header-collapse-none hydrated"
    >
      <IonToolbar>
        <IonTitle>Tauri FS playground</IonTitle>
      </IonToolbar>
    </IonHeader>
  );
}

export default AppHeader;
