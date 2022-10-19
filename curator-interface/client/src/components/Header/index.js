import React, { useState } from "react";
import { useGlobalState } from "../../hooks/globalState";
import Settings20 from "@carbon/icons-react/lib/settings/20";
import Help20 from "@carbon/icons-react/lib/help/20";
import { Save20, Menu20, Close20 } from "@carbon/icons-react";
import {
  Header,
  HeaderName,
  HeaderMenuItem,
  HeaderGlobalAction,
  HeaderGlobalBar,
  HeaderPanel,
  HeaderMenu,
  Switcher,
  SwitcherItem,
} from "carbon-components-react/lib/components/UIShell";

import textLanguage from "../../helpers/languagesConfig";

import AccountSelectionModal from "../AccountSelectionModal";
import HelpModal from "../HelpModal";
import CognosHelpModal from "../CognosHelpModal";
import HomeHelp from "../HomeHelp";
import SideMenu from "../SideNav";

import WarningModal from "../WarningModal";
import StandardDashboardModal from "../StandardDashboardModal";
import SuccessModal from "../SuccessModal";
import IntentHelperModal from "../IntentHelperModal";

import { switchAccount } from "../../helpers/apiCalls";

import { US, BR, ES } from "country-flag-icons/react/3x2";

import "./style.css";
export default function HeaderIcc({ modalOpen, helpOpen, renderButton }) {
  const {
    language,
    setLanguage,
    setSaveModalOpen,
    setLoadModalOpen,
    unsavedChanges,
    history,
    accounts,
    account,
    setAccount,
    setAccountLoading,
  } = useGlobalState();

  const languageIcons = { pt: <BR />, es: <ES />, en: <US /> };
  const [openSidePanel, setOpenSidePanel] = useState(false);
  const [openSaveMenu, setOpenSaveMenu] = useState(false);

  return (
    <Header aria-label="IBM Innovation Studio" id={"Header"}>
      {!history.location.pathname.includes("login") && (
        <HeaderGlobalAction
          className="navMenu"
          aria-label="Open menu"
          onClick={() => setOpenSidePanel(!openSidePanel)}
        >
          {openSidePanel ? <Close20 /> : <Menu20 />}
        </HeaderGlobalAction>
      )}
      <HeaderName
        prefix="IBM Innovation Studio"
        onClick={() => history.push("/home")}
      >
        Assistant Curator
      </HeaderName>
      {!history.location.pathname.includes("login") && (
        <>
          <SideMenu open={openSidePanel} />
          <HeaderGlobalBar>
            {renderButton && (
              <HeaderGlobalAction
                aria-label="Save"
                onClick={() => {
                  openSaveMenu ? setOpenSaveMenu(false) : setOpenSaveMenu(true);
                }}
              >
                {unsavedChanges ? (
                  <Save20 style={{ fill: "#4589ff" }} />
                ) : (
                  <Save20 />
                )}
              </HeaderGlobalAction>
            )}

            <HeaderMenu menuLinkName={account.entity.name}>
              {accounts.resources.map((acc) => (
                <HeaderMenuItem
                  id="accounts"
                  onClick={() => {
                    switchAccount(acc.metadata.guid).then(() => {
                      localStorage.setItem("savedAccount", JSON.stringify(acc));
                      setAccount(acc);
                      setAccountLoading(true);
                      modalOpen(true);
                    });
                  }}
                >
                  {acc.entity.name}
                </HeaderMenuItem>
              ))}
            </HeaderMenu>

            <HeaderMenu menuLinkName={languageIcons[language]}>
              {Object.entries(languageIcons).map(([key, value]) => (
                <HeaderMenuItem
                  onClick={() => {
                    setLanguage(key);
                    localStorage.setItem("language", key);
                  }}
                >
                  {value}
                  {` ${key.toUpperCase()}`}
                </HeaderMenuItem>
              ))}
            </HeaderMenu>

            <HeaderGlobalAction
              aria-label="Settings"
              onClick={() => {
                modalOpen(true);
              }}
            >
              <Settings20 />
            </HeaderGlobalAction>

            <HeaderGlobalAction
              aria-label="Help"
              onClick={() => {
                helpOpen(true);
              }}
            >
              <Help20 />
            </HeaderGlobalAction>
          </HeaderGlobalBar>

          <HeaderPanel
            aria-label="Header Panel"
            expanded={openSaveMenu}
            style={{ height: "100px", maxWidth: "145px" }}
          >
            <Switcher aria-label="Switcher Container">
              <SwitcherItem
                aria-label="Save"
                onClick={async () => {
                  setOpenSaveMenu(false);
                  setSaveModalOpen(true);
                }}
              >
                {unsavedChanges
                  ? textLanguage[language].headerSwitcher.save
                  : textLanguage[language].headerSwitcher.upToDate}
              </SwitcherItem>
              <SwitcherItem
                aria-label="Load"
                onClick={async () => {
                  setOpenSaveMenu(false);
                  setLoadModalOpen(true);
                }}
              >
                {textLanguage[language].headerSwitcher.load}
              </SwitcherItem>
            </Switcher>
          </HeaderPanel>
          <AccountSelectionModal modalOpen={modalOpen} />
          <HelpModal />
          <CognosHelpModal />
          <HomeHelp />
          <WarningModal />
          <StandardDashboardModal />
          <SuccessModal />
          <IntentHelperModal />
        </>
      )}
    </Header>
  );
}
