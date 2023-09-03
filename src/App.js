import { useState } from 'react';
import './App.css';
import {  Pets  } from './ui-components';
import {  NavBarHeader  } from './ui-components';
import {  MarketingFooterBrand  } from './ui-components';
import {  AddPet  } from './ui-components';
 
function App() {
  const [showForm, setShowForm] = useState(false);
  const formOverride = {
    MyIcon: {
      style: {
        cursor : "pointer",
      },
      onClick: () =>
      {
       setShowForm(false);
      }
    }
  }
  const navbarOverrides = {
    "image"  : {
      src: "https://img.icons8.com/color/50/000000/cat",
    },
    "Add Pet" : {
      style: {
        cursor : "pointer",
      },
      onClick: () => {
        setShowForm(!showForm)
      },
    },

  };
  return (
    <div className="App">
      <NavBarHeader width={"100%"} overrides={navbarOverrides} />
      <header className="App-header">
        {showForm && (
          <AddPet 
          overrides={
            formOverride
          }
          style = {{ 
          textAlign: "left",
          margin: "1rem",
        }} 
        />
        )


        }

        <Pets 
          overrideItems={({item, index})=> ({
            overrides : {
              Breed: {color: "blue"},
              Button29766907: {
                onClick: () => alert(`${item.name}`),
              }
            }

          })}
        />
      </header>
      <MarketingFooterBrand width={"100%"} />
    </div>
  );
}

export default App;
