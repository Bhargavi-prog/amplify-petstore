import { useState, useCallback } from "react";
import "./App.css";
import { Pets } from "./ui-components";
import { NavBarHeader } from "./ui-components";
import { MarketingFooterBrand } from "./ui-components";
import { AddPet } from "./ui-components";
//import { Alert } from '@aws-amplify/ui-react';
import { withAuthenticator } from "@aws-amplify/ui-react";
import ConnectCCP from "./ConnectCCP";
// import GridLayout from "react-grid-layout";
import RGL, { WidthProvider } from "react-grid-layout";
import axios from "axios";
import { acceptCall, useConnecting } from "./contact-events-hooks";

const ReactGridLayout = WidthProvider(RGL);

function App({ user, signOut }) {
  const [showForm, setShowForm] = useState(false);
  const [layout, setLayout] = useState(getDefaultLayout());

  function getDefaultLayout() {
    const defaultLayout = [
      {
        i: "GRID#LENS",
        sk: "GRID#LENS",
        x: 0,
        y: 0,
        w: 10,
        h: 2,
        minW: 1,
        maxW: 10,
      },
    ];
    return defaultLayout;
  }
  function handleOnLayoutChange(layout) {
    console.log("Handle onLayoutChange..."); // DEBUG
    setLayout(layout);
    const layoutJsonData = JSON.stringify(layout);

    console.log("DOM was here...");
    console.log(layout);

    axios
      .post(
        "https://hle6x9x42l.execute-api.eu-west-2.amazonaws.com/dev/admin/USER233/grids/set",
        layout[0],
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        // Handle the response from the server
        console.log("Server response:", response.data); // DEBUG
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error:", error); // DEBUG
      });
  }

  // const onConnecting = useCallback(() => {
  //   console.log("-bhagitest----onConnecting-callback-----");
  // }, []);

  // useConnecting(onConnecting);

  const formOverride = {
    MyIcon: {
      style: {
        cursor: "pointer",
      },
      onClick: () => {
        setShowForm(false);
      },
    },
  };
  const navbarOverrides = {
    image: {
      //src: "https://img.icons8.com/color/50/000000/cat",
      src: user?.attributes?.profile,
    },
    "Add Pet": {
      style: {
        cursor: "pointer",
      },
      onClick: () => {
        acceptCall();
        // setShowForm(!showForm);
      },
    },

    "Remove Pet": {
      style: {
        cursor: "pointer",
      },
      onClick: () => {
        alert("Delete");
      },
    },
    Button: {
      onClick: signOut,
    },
  };

  return (
    <div className="App">
      <ConnectCCP />
      <ReactGridLayout
        className="layout"
        layout={layout}
        cols={12}
        width={1400}
        rowHeight={60}
        isDraggable
        onLayoutChange={(layout) => {
          handleOnLayoutChange(layout);
        }}
      >
        <div key="GRID#LENS" className="widget">
          <NavBarHeader width={"100%"} overrides={navbarOverrides} />
        </div>
      </ReactGridLayout>
      <header className="App-header">
        {showForm && (
          <AddPet
            overrides={formOverride}
            style={{
              textAlign: "left",
              margin: "1rem",
            }}
          />
        )}

        <Pets
          overrideItems={({ item, index }) => ({
            overrides: {
              Breed: { color: "grey" },
              Button29766907: {
                onClick: () => alert(`${item.name}`),
              },
            },
          })}
        />
      </header>
      <MarketingFooterBrand width={"100%"} />
    </div>
  );
}

export default withAuthenticator(App);
