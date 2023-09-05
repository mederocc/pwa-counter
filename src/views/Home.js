import React, { useState } from "react";
import { Tabs, TabItem } from "@aws-amplify/ui-react";
import CounterView from "./CounterView";
import History from "./History";
import Modal from "../components/Modal";
import { NavButton } from "../utils/styledComponents";
import classes from "./Home.module.css";
import CenteringCard from "../components/CenteringCard";

function Home({ signOut, isOnline }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Tabs defaultIndex={0} className={classes.tabs}>
        <TabItem title="Contador">
          <CenteringCard>
            <CounterView signOut={signOut} isOnline={isOnline} />
          </CenteringCard>
        </TabItem>
        <TabItem title="Registros">
          <CenteringCard>
            <History signOut={signOut} isOnline={isOnline} />
          </CenteringCard>
        </TabItem>
        <div className={classes["button-container"]}>
          <NavButton
            onClick={() => {
              isOnline
                ? setIsModalOpen(true)
                : alert("No tienes conexión a internet");
            }}
          >
            Cerrar sesión
          </NavButton>
        </div>
        {isModalOpen && (
          <Modal
            open={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
            }}
            onConfirm={() => {
              signOut();
            }}
          >
            ¿Está seguro de cerrar la sesión?
          </Modal>
        )}
      </Tabs>
    </>
  );
}

export default Home;
