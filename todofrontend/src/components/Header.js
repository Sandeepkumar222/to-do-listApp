import {
  Button,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import React from "react";
import Lottie from "react-lottie";
import animationData from "../94119-done.json";
import { DataState } from "../context/DataProvider";
import { ChevronDownIcon } from "@chakra-ui/icons";
import Profile from "./Profile";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const Header = () => {
  const { user } = DataState();
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidMid slice",
    },
  };
  const history = useHistory();

  const logOut = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };
  return (
    <>
      <nav>
        <ul className="nav justify-content-center">
          <li className="nav-item justify-content-center">
            <a className="nav-link active" href="/about">
              <Lottie
                options={defaultOptions}
                width={80}
                style={{ marginBottom: 10, marginLeft: 0 }}
                Text="To-do"
              ></Lottie>
            </a>
          </li>
          <li className="nav-item ">
            <a className="nav-link active" href="/about">
              <Text fontSize={"3xl"} mt="3">
                To-Do App
              </Text>
            </a>
          </li>
          <li className="mt-4">
            <Menu>
              <MenuButton
                bgColor={"AppWorkspace"}
                borderColor={"black"}
                border="2px"
                as={Button}
                rightIcon={<ChevronDownIcon />}
              >
                <Image
                  boxSize="2rem"
                  borderRadius="full"
                  src={user.pic}
                  alt="Profile pic"
                  mr="12px"
                />
              </MenuButton>
              <MenuList>
                <MenuItem>
                  <Profile
                    username={user.name}
                    userEmail={user.email}
                    userPic={user.pic}
                  />
                </MenuItem>
                <MenuItem onClick={() => logOut()}>
                  <Text>Log out</Text>
                </MenuItem>
              </MenuList>
            </Menu>
          </li>
        </ul>
        <ul></ul>
      </nav>
    </>
  );
};

export default Header;
