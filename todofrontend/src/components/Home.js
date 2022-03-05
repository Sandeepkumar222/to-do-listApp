import React, { useEffect } from "react";
import {
  Container,
  Box,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import Login from "../Authentication/Login";
import Signup from "../Authentication/SignUp";

function Home() {
  const history = useHistory();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) history.push("/about");
  }, [history]);

  return (
    <Container>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg={"white"}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="1g"
        borderWidth="1px"
        boxShadow={"dark-lg"}
      >
        <Text fontSize="4xl" fontFamily="Work sans" color="lightskyblue">
          To-Do App
        </Text>
      </Box>
      <Box
        bg={"white"}
        w="100%"
        p={4}
        borderRadius="lg"
        borderWidth={"1px"}
        boxShadow={"dark-lg"}
      >
        <Tabs isFitted variant="enclosed">
          <TabList mb="1em">
            <Tab>Login</Tab>
            <Tab>Sign up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}

export default Home;
