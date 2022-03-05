import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { DataState } from "../context/DataProvider";

const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [picLoading, setPicLoading] = useState(false);
  const history = useHistory();
  const toast = useToast();
  const { setUser } = DataState();

  const submitHandler = async () => {
    setPicLoading(true);
    if (!email || !password) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "api/user/login",
        {
          email,
          password,
        },
        config
      );
      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);
      setPicLoading(false);
      history.push("/about");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
    }
  };

  return (
    <>
      <VStack spacing={"5px"} color="black">
        <FormControl id="email" isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            value={email}
            type={"email"}
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
          ></Input>
        </FormControl>
        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            value={password}
            type={"password"}
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
          ></Input>
        </FormControl>
        <FormControl>
          <Button
            colorScheme={"blue"}
            width="100%"
            style={{ marginTop: 15 }}
            onClick={submitHandler}
            isLoading={picLoading}
          >
            Login
          </Button>
          <Button
            colorScheme={"red"}
            width="100%"
            style={{ marginTop: 15 }}
            onClick={() => {
              setEmail("john@gmail.com");
              setPassword("john");
            }}
          >
            Get guest credentials
          </Button>
        </FormControl>
      </VStack>
    </>
  );
};

export default Login;
